#!/usr/bin/env python3
"""Adversarial preservation checks and isolated, read-only Git workload fixtures."""

from __future__ import annotations

import copy
import hashlib
import json
import os
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path

from check_presentation_qa import InputError, audit, load_json, preservation


ROOT = Path(__file__).resolve().parent.parent
SCRIPT = ROOT / "scripts/check_presentation_qa.py"
PATH = "content/reference/forms/MiXeD.record.md"
OTHER = "content/reference/another.md"
TRUNK = "content/changelog.md"
DOCKET = "content/changelog/2026-10-06-test-workload.md"
PREFIX = b'---\ntitle: "Fixture"\nid: reference/FIXTURE\nparent: reference\nstatus: published\n---\n\n# Fixture\n\n'


def record(body: str = "A plain pivot remains.\n") -> bytes:
    return PREFIX + body.encode()


class PreservationTests(unittest.TestCase):
    def test_separate_balanced_emphasis_and_hard_breaks(self):
        for before, after in [
            ("A plain pivot remains.\n", "A **plain pivot** remains.\n"),
            ("A plain pivot remains.\n", "A *plain pivot* remains.\n"),
            ("A plain pivot remains.  \n", "A *plain pivot* remains.  \n"),
            ("  A plain pivot remains.\n", "  A *plain pivot* remains.\n"),
            ("A plain pivot remains.\n", "*A plain pivot remains*.\n"),
            ("A plain pivot remains.\n", "A *plain* **pivot** *remains*.\n"),
        ]:
            with self.subTest(after=after):
                self.assertEqual(preservation(record(before), record(after)), [])

    def test_protected_syntax_unchanged_is_not_a_failure(self):
        for body in [
            "*existing* and **bold** and literal * remain.\n",
            "`inline * code` remains.\n",
            "```md\n**code**\n```\n",
            "~~~md\n*code*\n~~~\n",
            "[label](target.md#anchor)\n",
            "| cell | other |\n| --- | --- |\n",
            r"An escaped \* delimiter remains." + "\n",
            "> Quoted material remains.\n",
            "A stanza ends here.  \n\nAnother begins.\n",
        ]:
            with self.subTest(body=body):
                self.assertEqual(preservation(record(body), record(body)), [])

    def test_existing_asterisks_ambiguous_or_protected_insertions_need_review(self):
        cases = [
            ("A *plain* pivot remains.\n", "A *plain* **pivot** remains.\n"),
            ("A literal * pivot remains.\n", "A literal * *pivot* remains.\n"),
            ("A plain pivot remains.\n", "A *plain pivot remains.\n"),
            ("A plain pivot remains.\n", "A plain pivot remains*.\n"),
            ("A plain pivot remains.\n", "A ***plain pivot*** remains.\n"),
            ("A plain pivot remains.\n", "A **plain *pivot* remains**.\n"),
            ("A plain pivot remains.\n", "A p*lain p*ivot remains.\n"),
            ("A plain pivot remains.\n", "A plain* *pivot remains.\n"),
            ("`plain pivot` remains.\n", "`plain *pivot*` remains.\n"),
            ("```md\nplain pivot\n```\n", "```md\nplain *pivot*\n```\n"),
            ("~~~md\nplain pivot\n~~~\n", "~~~md\nplain *pivot*\n~~~\n"),
            ("[plain pivot](target.md)\n", "[plain *pivot*](target.md)\n"),
            ("[plain pivot][ref]\n", "[plain *pivot*][ref]\n"),
            ("| plain pivot | other |\n", "| plain *pivot* | other |\n"),
            (r"A \*plain pivot remains." + "\n", r"A \*plain *pivot* remains." + "\n"),
            ("# Plain pivot\n", "# Plain *pivot*\n"),
            ("Plain pivot\n---\n", "Plain *pivot*\n---\n"),
            ("Plain\npivot\n---\n", "*Plain*\npivot\n---\n"),
            ("> plain pivot\n", "> plain *pivot*\n"),
            ("> quoted start\nplain pivot\n", "> quoted start\nplain *pivot*\n"),
            ("- list start\nplain pivot\n", "- list start\nplain *pivot*\n"),
            ("<Aside>\n\nplain pivot\n\n</Aside>\n", "<Aside>\n\nplain *pivot*\n\n</Aside>\n"),
            ("<!--\nplain pivot\n-->\n", "<!--\nplain *pivot*\n-->\n"),
            ('A "plain pivot" remains.\n', 'A "plain *pivot*" remains.\n'),
            ("An anchor {#plain-pivot} remains.\n", "An anchor {#*plain*-pivot} remains.\n"),
            ("Visit https://plain.example/ now.\n", "Visit https://*plain*.example/ now.\n"),
            ("Contact plain@example.org now.\n", "Contact *plain*@example.org now.\n"),
            ("~~plain pivot~~ remains.\n", "~~plain *pivot*~~ remains.\n"),
            ("{{include plain}}\n", "{{include *plain*}}\n"),
            ("$plain$ remains.\n", "$*plain*$ remains.\n"),
            ("    plain pivot\n", "    plain *pivot*\n"),
            ("A plain pivot remains.\n", "A plain\npivot remains.\n"),
        ]
        for before, after in cases:
            with self.subTest(after=after):
                results = preservation(record(before), record(after))
                self.assertTrue(results)
                self.assertIn("human_review", {level for level, message in results})

    def test_preserved_bytes_cannot_be_deleted_reordered_or_cleaned(self):
        cases = [
            ("A plain pivot remains.\n", "A corrected pivot remains.\n"),
            ("A plain pivot remains.\n", "A pivot plain remains.\n"),
            ("A *plain* pivot remains.\n", "A plain pivot remains.\n"),
            ("A plain pivot remains.  \n", "A *plain pivot* remains.\n"),
            ("A plain pivot remains.\n", "A *plain pivot* remains.  \n"),
            ("A plain pivot remains.\r\n", "A *plain pivot* remains.\n"),
            ("  A plain pivot remains.\n", " A *plain pivot* remains.\n"),
            ("A plain pivot remains.\n", "A *plain pivot* remains."),
            ("[label](target.md)\n", "[label](different.md)\n"),
            ("A plain pivot remains.\n", "*A* **plain** **pivot** remains.\n"),
        ]
        for before, after in cases:
            with self.subTest(after=after):
                self.assertIn("error", {level for level, message in preservation(record(before), record(after))})

    def test_frontmatter_identity_and_title_are_byte_protected(self):
        before = record()
        for after in [
            before.replace(b"reference/FIXTURE", b"reference/OTHER"),
            before.replace(b'title: "Fixture"', b'title: "Different"'),
            before.replace(b"status: published", b"status: archived"),
            before.replace(b"# Fixture", b"# Different"),
        ]:
            with self.subTest(after=after):
                self.assertIn("error", {level for level, message in preservation(before, after)})

    def test_one_new_bold_pivot_with_existing_bold_requires_review(self):
        for delimiter in ("**", "__"):
            before = record(f"{delimiter}Earlier bold.{delimiter}\n\nA plain pivot remains.\n")
            after = record(f"{delimiter}Earlier bold.{delimiter}\n\nA **plain pivot** remains.\n")
            with self.subTest(delimiter=delimiter):
                self.assertIn("human_review", {level for level, message in preservation(before, after)})


class WorkloadTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        # Reuse existing commit identity headers in temporary raw Git objects.
        # No configured author/committer identity or checkout is changed.
        original = subprocess.check_output(["git", "-C", str(ROOT), "cat-file", "-p", "HEAD"])
        cls.identity = b"\n".join(line for line in original.split(b"\n\n", 1)[0].splitlines()
                                  if line.startswith((b"author ", b"committer ")))

    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory(prefix="filed-presentation-qa-")
        self.addCleanup(self.tmp.cleanup)
        self.repo = Path(self.tmp.name) / "repo.git"
        subprocess.run(["git", "init", "--bare", str(self.repo)], check=True, capture_output=True)
        self.files = {PATH: record(), OTHER: record("Another plain record.\n"),
                      TRUNK: b"---\ntitle: Changelog\n---\n\n# Changelog\n\nCount: 0 records.\n"}
        self.base = self.commit(self.files)

    def git(self, *args, data=None):
        return subprocess.check_output(["git", "-C", str(self.repo), *args], input=data,
                                       stderr=subprocess.PIPE).strip()

    def commit(self, files, parent=None):
        nested = {}
        for path, value in files.items():
            mode, content = value if isinstance(value, tuple) else ("100644", value)
            oid = self.git("hash-object", "-w", "--stdin", data=content)
            node = nested
            parts = path.split("/")
            for part in parts[:-1]:
                node = node.setdefault(part, {})
            node[parts[-1]] = (mode, oid)

        def subtree(node):
            rows = []
            for name, value in sorted(node.items()):
                mode, kind, oid = ("040000", "tree", subtree(value)) if isinstance(value, dict) else (value[0], "blob", value[1])
                rows.append(f"{mode} {kind} ".encode() + oid + b"\t" + name.encode() + b"\n")
            return self.git("mktree", data=b"".join(rows))

        raw = b"tree " + subtree(nested) + b"\n"
        if parent:
            raw += b"parent " + parent.encode() + b"\n"
        raw += self.identity + b"\n\nPresentation QA test fixture.\n"
        return self.git("hash-object", "-t", "commit", "-w", "--stdin", data=raw).decode()

    def inputs(self, files=None, paths=None, docket=None, head=None):
        files = self.files if files is None else files
        paths = [PATH, OTHER] if paths is None else paths
        head = head or self.commit(files, self.base)
        assignment = {"base": self.base, "head": head, "paths": paths, "maintenance_docket": docket}
        rows = []
        for path in paths:
            rows.append({"file": path, "read_in_full": True,
                         "disposition": "changed" if files.get(path) != self.files.get(path) else "reviewed unchanged",
                         "observation": "The last sentence retains the plain pivot.",
                         "line_anchor": path + ":1", "decision": "Retain words and structure.",
                         "review_evidence": "Independent reviewer must inspect this fixture."})
        changed = sum(r["disposition"] == "changed" for r in rows)
        evidence = {"files": rows, "totals": {"reviewed": len(rows), "changed": changed,
                                            "unchanged": len(rows) - changed, "needs_decision": 0}}
        return assignment, evidence

    def report(self, assignment, evidence):
        return audit(self.repo, self.base, assignment["head"], assignment, evidence)

    def test_no_change_review_and_mixed_case_nested_paths(self):
        assignment, evidence = self.inputs(head=self.base)
        self.assertEqual(self.report(assignment, evidence)["status"], "PASS")

    def test_simple_edit_and_own_docket_with_actual_trunk_count(self):
        files = {**self.files, PATH: record("A *plain pivot* remains.\n"),
                 DOCKET: b"---\nparent: changelog\n---\n\nNew maintenance.\n",
                 TRUNK: self.files[TRUNK].replace(b"Count: 0", b"Count: 1")}
        assignment, evidence = self.inputs(files, docket=DOCKET)
        report = self.report(assignment, evidence)
        self.assertEqual(report["status"], "PASS", report)
        self.assertEqual({c["status"] for c in report["changes"]}, {"M", "A"})

    def test_unassigned_additions_deletions_and_renames_are_rejected(self):
        cases = [
            {**self.files, "docs/unassigned.md": b"Unexpected.\n"},
            {**self.files, "content/reference/new.md": record()},
            {p: text for p, text in self.files.items() if p != PATH},
            {**{p: text for p, text in self.files.items() if p != PATH},
             PATH.lower(): self.files[PATH]},
            {**self.files, PATH: ("100755", record())},
        ]
        for files in cases:
            with self.subTest(files=list(files)):
                assignment, evidence = self.inputs(files)
                self.assertEqual(self.report(assignment, evidence)["status"], "FINDINGS")
        assignment, evidence = self.inputs(cases[3])
        self.assertTrue(any(c["status"].startswith("R") for c in self.report(assignment, evidence)["changes"]))

    def test_symlink_source_is_not_followed(self):
        assignment, evidence = self.inputs({**self.files, PATH: ("120000", b"/private/source.md")})
        with self.assertRaises(InputError):
            self.report(assignment, evidence)

    def test_invalid_utf8_is_not_a_green_unchanged_record(self):
        self.files[PATH] = b"\xff"
        self.base = self.commit(self.files)
        assignment, evidence = self.inputs(head=self.base)
        with self.assertRaises(UnicodeError):
            self.report(assignment, evidence)

    def test_docket_and_trunk_allowance_is_not_a_blank_check(self):
        base_edit = {**self.files, PATH: record("A *plain pivot* remains.\n")}
        cases = [
            ({**base_edit, DOCKET: record()}, None),
            ({**base_edit, TRUNK: self.files[TRUNK].replace(b"Count: 0", b"Count: 1")}, None),
            ({**base_edit, DOCKET: record()}, DOCKET),
            ({**base_edit, DOCKET: record(), TRUNK: self.files[TRUNK].replace(b"Count: 0", b"Count: 2")}, DOCKET),
            ({**base_edit, DOCKET: record(), TRUNK: self.files[TRUNK].replace(b"# Changelog", b"# Renamed").replace(b"Count: 0", b"Count: 1")}, DOCKET),
            ({**self.files, DOCKET: record(), TRUNK: self.files[TRUNK].replace(b"Count: 0", b"Count: 1")}, DOCKET),
            (base_edit, DOCKET),
        ]
        for files, docket in cases:
            with self.subTest(docket=docket):
                assignment, evidence = self.inputs(files, docket=docket)
                self.assertEqual(self.report(assignment, evidence)["status"], "FINDINGS")

    def test_existing_docket_cannot_be_claimed_as_own(self):
        self.files[DOCKET] = record("Earlier docket.\n")
        self.base = self.commit(self.files)
        assignment, evidence = self.inputs({**self.files, PATH: record("A *plain pivot* remains.\n")}, docket=DOCKET)
        self.assertEqual(self.report(assignment, evidence)["status"], "FINDINGS")

    def test_wrong_base_head_refs_missing_objects_and_non_ancestor_stop(self):
        assignment, evidence = self.inputs()
        for base, head in [("HEAD", assignment["head"]), (self.base[:8], assignment["head"]),
                           (self.base, "0" * 40), (assignment["head"], self.base)]:
            with self.subTest(base=base, head=head), self.assertRaises(InputError):
                audit(self.repo, base, head, assignment, evidence)
        wrong = {**assignment, "base": "0" * 40}
        with self.assertRaises(InputError):
            self.report(wrong, evidence)
        with self.assertRaises(InputError):
            audit(self.repo, self.base, assignment["head"],
                  {**assignment, "head": self.base}, evidence)
        orphan = self.commit({**self.files, PATH: record("Unrelated.\n")})
        assignment["head"] = orphan
        with self.assertRaises(InputError):
            self.report(assignment, evidence)
        tree_id = self.git("rev-parse", self.base + "^{tree}").decode()
        assignment["head"] = tree_id
        with self.assertRaises(InputError):
            self.report(assignment, evidence)

    def test_missing_moved_and_added_assignments_stop(self):
        for paths in [[PATH.lower()], ["content/reference/missing.md"],
                      ["content/reference/*.md"], ["content/../reference/no.md"]]:
            with self.subTest(paths=paths):
                assignment, evidence = self.inputs(paths=paths)
                if ".." in paths[0]:
                    with self.assertRaises(InputError):
                        self.report(assignment, evidence)
                else:
                    self.assertEqual(self.report(assignment, evidence)["status"], "FINDINGS")

    def test_literal_irregular_filename_is_not_expanded(self):
        path = "content/reference/nested/odd[1]*?.md"
        self.files[path] = record()
        self.base = self.commit(self.files)
        assignment, evidence = self.inputs(paths=[path], head=self.base)
        self.assertEqual(self.report(assignment, evidence)["status"], "PASS")

    def test_assigned_trunk_count_still_uses_the_narrow_maintenance_rule(self):
        files = {**self.files, DOCKET: record(),
                 TRUNK: self.files[TRUNK].replace(b"Count: 0", b"Count: 1")}
        assignment, evidence = self.inputs(files, paths=[TRUNK], docket=DOCKET)
        self.assertEqual(self.report(assignment, evidence)["status"], "PASS")
        files[TRUNK] = files[TRUNK].replace(b"# Changelog", b"# Different")
        assignment, evidence = self.inputs(files, paths=[TRUNK], docket=DOCKET)
        self.assertEqual(self.report(assignment, evidence)["status"], "FINDINGS")

    def test_trunk_mode_changes_do_not_pass(self):
        self.files[TRUNK] = self.files[TRUNK].replace(b"Count: 0", b"Count: 1")
        self.base = self.commit(self.files)
        files = {**self.files, PATH: record("A *plain pivot* remains.\n"), DOCKET: record(),
                 TRUNK: ("100755", self.files[TRUNK])}
        assignment, evidence = self.inputs(files, docket=DOCKET)
        self.assertEqual(self.report(assignment, evidence)["status"], "FINDINGS")

    def test_multi_record_size_needs_coordinator_but_one_oversized_is_allowed(self):
        self.files[PATH] = record("A line remains.\n" * 1600)
        self.base = self.commit(self.files)
        assignment, evidence = self.inputs(head=self.base)
        self.assertTrue(any(f["level"] == "human_review" for f in self.report(assignment, evidence)["findings"]))
        assignment, evidence = self.inputs(paths=[PATH], head=self.base)
        self.assertEqual(self.report(assignment, evidence)["status"], "PASS")

    def test_poetry_and_other_file_caps_are_workload_caps(self):
        self.files = {f"content/haikus/{n}.md": record() for n in range(26)}
        self.base = self.commit(self.files)
        assignment, evidence = self.inputs(paths=list(self.files)[:25], head=self.base)
        self.assertEqual(self.report(assignment, evidence)["status"], "PASS")
        with self.assertRaises(InputError):
            self.report({**assignment, "paths": list(self.files)}, evidence)
        self.files = {f"content/reference/{n}.md": record() for n in range(11)}
        self.base = self.commit(self.files)
        assignment, evidence = self.inputs(paths=list(self.files), head=self.base)
        with self.assertRaises(InputError):
            self.report(assignment, evidence)

    def test_unchanged_omission_totals_and_dispositions_are_checked(self):
        assignment, evidence = self.inputs({**self.files, PATH: record("A *plain pivot* remains.\n")})
        for mutate in [
            lambda e: e["files"].pop(),
            lambda e: e["totals"].update(unchanged=99),
            lambda e: e["files"][0].update(disposition="reviewed unchanged"),
            lambda e: e["files"][1].update(disposition="changed"),
            lambda e: e["files"][0].update(observation=""),
            lambda e: e["files"][0].update(line_anchor=PATH + ":9999"),
            lambda e: e["files"][0].update(line_anchor=PATH + ":5-1"),
        ]:
            with self.subTest(mutate=mutate):
                trial = copy.deepcopy(evidence)
                mutate(trial)
                self.assertEqual(self.report(assignment, trial)["status"], "FINDINGS")

    def test_needs_decision_and_blocked_reading_stay_non_green(self):
        assignment, evidence = self.inputs()
        evidence["files"][0].update(disposition="needs decision", read_in_full=False)
        evidence["totals"].update(reviewed=1, unchanged=1, needs_decision=1)
        report = self.report(assignment, evidence)
        self.assertEqual(report["totals"], evidence["totals"])
        self.assertEqual(report["status"], "FINDINGS")
        self.assertIn("human_review", {f["level"] for f in report["findings"]})

    def test_duplicate_extra_invalid_evidence_and_assignment_rows_stop(self):
        assignment, evidence = self.inputs()
        trials = []
        for mutate in [
            lambda e: e["files"].append(e["files"][0]),
            lambda e: e["files"][0].update(file="content/reference/unassigned.md"),
            lambda e: e["files"][0].update(disposition=[]),
            lambda e: e["files"][0].update(read_in_full="yes"),
            lambda e: e["totals"].update(reviewed=True),
            lambda e: e["files"][0].update(extra="undeclared"),
        ]:
            trial = copy.deepcopy(evidence)
            mutate(trial)
            trials.append(trial)
        for trial in trials:
            with self.subTest(trial=trial), self.assertRaises(InputError):
                self.report(assignment, trial)
        for paths in [[PATH, PATH], ["docs/not-content.md"], [], [None], [PATH] * 26]:
            with self.subTest(paths=paths), self.assertRaises(InputError):
                self.report({**assignment, "paths": paths}, evidence)

    def test_cli_read_only_exits_and_json_errors(self):
        assignment, evidence = self.inputs(head=self.base)
        assignment_path, evidence_path = Path(self.tmp.name) / "assignment.json", Path(self.tmp.name) / "evidence.json"
        assignment_path.write_text(json.dumps(assignment))
        evidence_path.write_text(json.dumps(evidence))

        def digest():
            return {str(p.relative_to(self.repo)): hashlib.sha256(p.read_bytes()).hexdigest()
                    for p in self.repo.rglob("*") if p.is_file()}

        before = digest()
        command = [sys.executable, str(SCRIPT), "--repo", str(self.repo), "--base", self.base,
                   "--head", self.base, "--assignment", str(assignment_path),
                   "--evidence", str(evidence_path), "--json"]
        result = subprocess.run(command, capture_output=True, text=True,
                                env={**os.environ, "PYTHONDONTWRITEBYTECODE": "1"})
        self.assertEqual(result.returncode, 0, result.stderr)
        self.assertEqual(json.loads(result.stdout)["status"], "PASS")
        self.assertEqual(digest(), before)
        evidence["files"].pop()
        evidence_path.write_text(json.dumps(evidence))
        self.assertEqual(subprocess.run(command, capture_output=True).returncode, 1)
        evidence_path.write_text('{"files":[],"files":[]}')
        self.assertEqual(subprocess.run(command, capture_output=True).returncode, 2)
        with self.assertRaises(InputError):
            load_json(evidence_path)
        evidence_path.write_text("{malformed")
        self.assertEqual(subprocess.run(command, capture_output=True).returncode, 2)


if __name__ == "__main__":
    unittest.main()
