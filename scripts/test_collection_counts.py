#!/usr/bin/env python3
"""Focused regressions for the read-only source census."""

import csv
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path

sys.dont_write_bytecode = True

from check_collection_counts import inspect_counts  # noqa: E402


SCRIPT = Path(__file__).resolve().with_name("check_collection_counts.py")
ROOT = SCRIPT.parents[1]


class CountTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory(prefix="filed-counts-")
        self.addCleanup(self.temp.cleanup)
        self.root = Path(self.temp.name)
        self.write("content/index.md", "# Home\n")
        self.write("content/reference.md", "# Reference\n\nCount: 2 records.\n")
        self.write("content/reference/fref-0001.md", "# Reference record\n")
        self.write("content/reference/empathegy/FREF-Mixed.md", "# Nested record\n")
        self.write("content/changelog.md", "# Changelog\n\nCount: 1 records.\n")
        self.write("content/changelog/old.md", "# Old docket\n")
        self.write(
            "README.md",
            "Filed is a 6-page archive. The corpus includes 3 trunk pages "
            "and 3 satellite records.\n",
        )

    def write(self, path, text):
        target = self.root / path
        target.parent.mkdir(parents=True, exist_ok=True)
        target.write_text(text, encoding="utf-8")

    def test_nested_mixed_case_records_and_home_are_counted(self):
        collections, totals, findings = inspect_counts(self.root)
        self.assertEqual(collections, [("changelog", 1, 1), ("reference", 2, 2)])
        self.assertEqual(totals, {"pages": 6, "trunks": 3, "satellites": 3})
        self.assertEqual(findings, [])

    def test_stale_count_fails_without_blind_increment(self):
        self.write("content/reference.md", "Count: 57 records.\n")
        self.assertIn(
            "content/reference.md: declares 57, actual 2",
            inspect_counts(self.root)[2],
        )

    def test_new_uncommitted_docket_requires_all_totals_to_change(self):
        self.write("content/changelog/new.md", "# New docket\n")
        findings = inspect_counts(self.root)[2]
        self.assertIn("content/changelog.md: declares 1, actual 2", findings)
        self.assertIn("README.md: declares 6 pages, actual 7", findings)
        self.assertIn("README.md: declares 3 satellites, actual 4", findings)

    def test_missing_and_duplicate_count_lines_fail(self):
        for text in ("# Reference\n", "Count: 2 records.\nCount: 2 records.\n"):
            with self.subTest(text=text):
                self.write("content/reference.md", text)
                self.assertIn(
                    "content/reference.md: expected one Count: line",
                    inspect_counts(self.root)[2],
                )

    def test_unowned_nested_record_fails(self):
        self.write("content/orphan/nested/record.md", "# Not assigned\n")
        self.assertIn(
            "No collection trunk for content/orphan/nested/record.md",
            inspect_counts(self.root)[2],
        )

    def test_stale_and_missing_readme_claims_fail(self):
        self.write(
            "README.md",
            "Filed is a 2,265-page archive. The corpus includes 11 trunk pages "
            "and 2,254 satellite records.\n",
        )
        self.assertEqual(len(inspect_counts(self.root)[2]), 3)
        self.write("README.md", "# No totals\n")
        self.assertEqual(len(inspect_counts(self.root)[2]), 3)

    def test_missing_source_fails(self):
        with tempfile.TemporaryDirectory(prefix="filed-counts-empty-") as empty:
            with self.assertRaisesRegex(ValueError, "Missing source directory"):
                inspect_counts(Path(empty))

    def test_cli_passes_and_fails_without_modifying_files(self):
        def snapshot():
            return {
                p.relative_to(self.root): p.read_bytes()
                for p in self.root.rglob("*")
                if p.is_file()
            }

        for expected_exit in (0, 1):
            if expected_exit:
                self.write("content/changelog/new.md", "# New docket\n")
            before = snapshot()
            result = subprocess.run(
                [sys.executable, str(SCRIPT), "--root", str(self.root)],
                capture_output=True, text=True, check=False,
            )
            self.assertEqual(result.returncode, expected_exit, result.stdout)
            self.assertEqual(snapshot(), before)


class HistoricalEvidenceTests(unittest.TestCase):
    def setUp(self):
        path = ROOT / "reports/presentation-qa-prior-coverage.tsv"
        with path.open(encoding="utf-8", newline="") as stream:
            self.rows = list(csv.DictReader(stream, delimiter="\t"))

    def test_inventory_never_infers_reading_from_changes(self):
        self.assertEqual(len(self.rows), 527)
        self.assertEqual(len({row["path"] for row in self.rows}), 527)
        self.assertEqual({row["historical_read"] for row in self.rows}, {"unknown"})
        self.assertEqual(
            sum(row["first_parent_change"] == "modified" for row in self.rows), 511
        )

    def test_mixed_case_records_remain_explicit_unknowns(self):
        by_path = {row["path"]: row for row in self.rows}
        for name in ("APH-fref-0650-pbc.md", "APH-fref-0661-agbx.md"):
            row = by_path[f"content/aphorisms/{name}"]
            self.assertEqual(row["pr"], "608")
            self.assertEqual(row["first_parent_change"], "unchanged")
            self.assertEqual(row["historical_read"], "unknown")

    def test_exact_changed_paths_match_first_parent_history(self):
        merges = {row["merge"] for row in self.rows}
        for merge in merges:
            available = subprocess.run(
                ["git", "-C", str(ROOT), "cat-file", "-e", merge + "^1"],
                capture_output=True, check=False,
            )
            if available.returncode:
                self.skipTest("Full emphasis merge history is unavailable")
        for merge in sorted(merges):
            rows = [row for row in self.rows if row["merge"] == merge]
            prefix = f"content/{rows[0]['collection']}/"
            changes = subprocess.check_output(
                ["git", "-C", str(ROOT), "diff", "--name-status", "--no-renames",
                 merge + "^1", merge, "--", prefix],
                text=True,
            ).splitlines()
            self.assertTrue(all(line.startswith("M\t") for line in changes))
            self.assertEqual(
                {line.split("\t", 1)[1] for line in changes},
                {row["path"] for row in rows
                 if row["first_parent_change"] == "modified"},
            )
            source_paths = set(subprocess.check_output(
                ["git", "-C", str(ROOT), "ls-tree", "-r", "--name-only",
                 merge, "--", "content/"],
                text=True,
            ).splitlines())
            self.assertTrue({row["path"] for row in rows} <= source_paths)


if __name__ == "__main__":
    unittest.main()
