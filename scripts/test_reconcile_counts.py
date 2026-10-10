#!/usr/bin/env python3
"""Focused regressions for the write-mode source census reconciler."""

import subprocess
import sys
import tempfile
import unittest
from pathlib import Path

sys.dont_write_bytecode = True

from reconcile_counts import reconcile_counts  # noqa: E402

SCRIPT = Path(__file__).resolve().with_name("reconcile_counts.py")


class ReconcileTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory(prefix="filed-reconcile-")
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

    def read(self, path):
        return (self.root / path).read_text(encoding="utf-8")

    def test_clean_census_is_a_noop(self):
        changes, findings = reconcile_counts(self.root, apply=True)
        self.assertEqual(changes, [])
        self.assertEqual(findings, [])

    def test_stale_trunk_count_is_rewritten_not_incremented(self):
        self.write("content/reference.md", "# Reference\n\nCount: 57 records.\n")
        changes, findings = reconcile_counts(self.root, apply=True)
        self.assertEqual(findings, [])
        self.assertEqual(changes, ["content/reference.md: Count 57 -> 2"])
        self.assertIn("Count: 2 records.", self.read("content/reference.md"))

    def test_new_record_repairs_trunk_and_all_readme_totals(self):
        self.write("content/changelog/new.md", "# New docket\n")
        changes, findings = reconcile_counts(self.root, apply=True)
        self.assertEqual(findings, [])
        self.assertIn("Count: 2 records.", self.read("content/changelog.md"))
        readme = self.read("README.md")
        self.assertIn("7-page archive", readme)
        self.assertIn("4 satellite records", readme)
        self.assertTrue(any(c.startswith("README.md") for c in changes))

    def test_readme_totals_keep_comma_formatting(self):
        for i in range(1, 2000):
            self.write(f"content/changelog/docket-{i:04d}.md", "# Docket\n")
        reconcile_counts(self.root, apply=True)
        self.assertIn("2,005-page archive", self.read("README.md"))
        self.assertIn("2,002 satellite records", self.read("README.md"))

    def test_missing_count_line_is_reported_not_fabricated(self):
        self.write("content/reference.md", "# Reference\n")
        changes, findings = reconcile_counts(self.root, apply=True)
        self.assertNotIn("Count:", self.read("content/reference.md"))
        self.assertIn("content/reference.md: expected one Count: line", findings)
        self.assertTrue(all("reference" not in c for c in changes))

    def test_check_mode_reports_drift_without_writing(self):
        self.write("content/changelog/new.md", "# New docket\n")
        before = {p: p.read_bytes() for p in self.root.rglob("*") if p.is_file()}
        result = subprocess.run(
            [sys.executable, str(SCRIPT), "--root", str(self.root), "--check"],
            capture_output=True, text=True, check=False,
        )
        self.assertEqual(result.returncode, 1, result.stdout)
        self.assertIn("DRY-RUN", result.stdout)
        self.assertEqual(
            before, {p: p.read_bytes() for p in self.root.rglob("*") if p.is_file()}
        )

    def test_cli_converges_and_exit_codes(self):
        self.write("content/changelog/new.md", "# New docket\n")
        first = subprocess.run(
            [sys.executable, str(SCRIPT), "--root", str(self.root)],
            capture_output=True, text=True, check=False,
        )
        self.assertEqual(first.returncode, 0, first.stdout)
        second = subprocess.run(
            [sys.executable, str(SCRIPT), "--root", str(self.root)],
            capture_output=True, text=True, check=False,
        )
        self.assertEqual(second.returncode, 0, second.stdout)
        self.assertIn("already match", second.stdout)


if __name__ == "__main__":
    unittest.main()
