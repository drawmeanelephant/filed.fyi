#!/usr/bin/env python3
"""Read-only scope, preservation, and evidence checks for one presentation workload."""

from __future__ import annotations

import argparse
import difflib
import json
import re
import subprocess
import sys
from collections import Counter
from pathlib import Path


ROOT = Path(__file__).resolve().parent.parent
SHA = re.compile(r"(?:[0-9a-f]{40}|[0-9a-f]{64})")
DISPOSITIONS = {"changed": "changed", "reviewed unchanged": "unchanged",
                "needs decision": "needs_decision"}
TOTAL_KEYS = {"reviewed", "changed", "unchanged", "needs_decision"}


class InputError(ValueError):
    pass


def git(repo: Path, *args: str) -> bytes:
    result = subprocess.run(["git", "--no-replace-objects", "-C", str(repo), *args],
                            capture_output=True)
    if result.returncode:
        raise InputError(f"Git {' '.join(args[:2])} failed: "
                         f"{result.stderr.decode('utf-8', errors='replace').strip()}")
    return result.stdout


def tree(repo: Path, revision: str) -> dict[str, tuple[str, str, str]]:
    entries = {}
    for record in git(repo, "ls-tree", "-r", "-z", "--full-tree", revision).split(b"\0"):
        if record:
            metadata, path = record.split(b"\t", 1)
            entries[path.decode("utf-8")] = tuple(metadata.decode("ascii").split())
    return entries


def changes(repo: Path, base: str, head: str) -> list[dict[str, str]]:
    fields = git(repo, "diff", "--no-ext-diff", "--no-textconv", "--name-status",
                 "-z", "--find-renames=50%", base, head, "--").decode("utf-8").split("\0")
    result = []
    index = 0
    while index < len(fields) - 1:
        status, old = fields[index:index + 2]
        index += 2
        new = old
        if status.startswith(("R", "C")):
            new = fields[index]
            index += 1
        result.append({"status": status, "old": old, "new": new})
    return result


def content_path(value: object) -> bool:
    return (isinstance(value, str) and value.startswith("content/")
            and value.endswith(".md")
            and all(part not in {"", ".", ".."} for part in value.split("/"))
            and not any(ord(c) < 32 or ord(c) == 127 for c in value))


def frontmatter(text: str) -> tuple[str, list[str]]:
    lines = text.splitlines(keepends=True)
    if lines and lines[0].rstrip("\r\n") == "---":
        for index in range(1, len(lines)):
            if lines[index].rstrip("\r\n") == "---":
                return "".join(lines[:index + 1]), lines[index + 1:]
        raise InputError("unterminated frontmatter")
    return "", lines


def protected_lines(lines: list[str]) -> set[int]:
    protected = set()
    fence = None
    for index, line in enumerate(lines):
        marker = re.match(r"^ {0,3}(`{3,}|~{3,})", line)
        if fence:
            protected.add(index)
            if re.fullmatch(r" {0,3}" + re.escape(fence[0]) + r"{"
                            + str(fence[1]) + r",}[ \t\r\n]*", line):
                fence = None
        elif marker:
            fence = (marker[1][0], len(marker[1]))
            protected.add(index)
        elif (line.startswith(("    ", "\t"))
              or re.match(r"^ {0,3}(?:#{1,6}(?:\s|$)|>|[-+*]\s|\d+[.)]\s)", line)
              or re.fullmatch(r" {0,3}(?:[-_*][ \t]*){3,}[\r\n]*", line)
              or any(c in line for c in "`\\[]|<>_&\"'“”‘’{}()/@~$")):
            protected.add(index)
        if re.fullmatch(r" {0,3}(?:=+|-+)[ \t\r\n]*", line):
            protected.update({index, index - 1})
    # Lazy quote/list continuation and multiline headings inherit block context.
    start = 0
    for index in range(len(lines) + 1):
        if index == len(lines) or not lines[index].strip():
            paragraph = set(range(start, index))
            if paragraph & protected:
                protected.update(paragraph)
            start = index + 1
    # HTML/components can span blank lines. Do not guess their parsing rules.
    if any("<" in line or "{{" in line for line in lines):
        protected.update(range(len(lines)))
    return protected


def emphasis(line: str) -> tuple[int, str | None]:
    """Accept only separate, balanced *word phrases* or **word phrases**."""
    index = 0
    bold = 0
    while index < len(line):
        if line[index] != "*":
            index += 1
            continue
        end = index
        while end < len(line) and line[end] == "*":
            end += 1
        width = end - index
        if width not in {1, 2}:
            return bold, "nested or ambiguous emphasis delimiter run"
        close = line.find("*", end)
        if close == -1:
            return bold, "unbalanced emphasis"
        finish = close
        while finish < len(line) and line[finish] == "*":
            finish += 1
        if finish - close != width:
            return bold, "nested or mismatched emphasis"
        phrase = line[end:close]
        before = line[index - 1] if index else ""
        after = line[finish] if finish < len(line) else ""
        if (not re.fullmatch(r"\w+(?:[ \t]+\w+)*", phrase)
                or before.isalnum() or after.isalnum()
                or before == "*" or after == "*"):
            return bold, "emphasis flanking or phrase syntax needs human review"
        bold += width == 2
        index = finish
    return bold, None


def preservation(before: bytes, after: bytes) -> list[tuple[str, str]]:
    if before == after:
        return []
    old_front, old = frontmatter(before.decode("utf-8"))
    new_front, new = frontmatter(after.decode("utf-8"))
    if old_front != new_front:
        return [("error", "frontmatter or canonical identity changed")]
    if len(old) != len(new):
        return [("human_review", "line/paragraph/stanza layout changed; preservation undecided")]
    protected = protected_lines(old) | protected_lines(new)
    findings = []
    bold = 0
    for index, (left, right) in enumerate(zip(old, new)):
        if left == right:
            continue
        anchor = len(old_front.splitlines()) + index + 1
        detail = f"line {anchor}: "
        edits = difflib.SequenceMatcher(None, left, right, autojunk=False).get_opcodes()
        if any(tag != "equal" and (tag != "insert" or set(right[c:d]) != {"*"})
               for tag, a, b, c, d in edits):
            findings.append(("error", detail + "words, order, whitespace, or existing markup changed"))
            continue
        if (re.match(r"[ \t]*", left)[0] != re.match(r"[ \t]*", right)[0]
                or re.search(r"[ \t\r\n]*$", left)[0] != re.search(r"[ \t\r\n]*$", right)[0]):
            findings.append(("error", detail + "indentation, line ending, or hard break changed"))
            continue
        if index in protected or "*" in left:
            findings.append(("human_review", detail + "protected syntax, quoted material, or existing asterisks"))
            continue
        added_bold, reason = emphasis(right)
        bold += added_bold
        if reason:
            findings.append(("human_review", detail + reason))
    if bold > 1:
        findings.append(("error", "more than one new bold pivot"))
    if bold and (b"**" in before or b"__" in before):
        findings.append(("human_review", "new bold alongside existing bold syntax needs review"))
    return findings


def audit(repo: Path, base: str, head: str, assignment: dict, evidence: dict) -> dict:
    if not isinstance(assignment, dict) or set(assignment) != {"base", "head", "paths", "maintenance_docket"}:
        raise InputError("assignment requires exactly base, head, paths, maintenance_docket")
    for revision in (base, head):
        if not SHA.fullmatch(revision):
            raise InputError("base/head must be full lowercase commit object IDs, not refs")
        if git(repo, "rev-parse", "--verify", revision + "^{commit}").decode().strip() != revision:
            raise InputError("base/head must identify commits directly")
    if assignment["base"] != base or assignment["head"] != head:
        raise InputError("declared base/head do not match the requested comparison")
    git(repo, "merge-base", "--is-ancestor", base, head)
    paths = assignment["paths"]
    if (not isinstance(paths, list) or not paths or not all(content_path(p) for p in paths)
            or len(set(paths)) != len(paths)):
        raise InputError("paths must be a nonempty, unique list of exact content/*.md paths")
    poetry = all(p.split("/")[1] in {"aphorisms", "haikus", "limericks"} for p in paths)
    if len(paths) > (25 if poetry else 10):
        raise InputError("assignment exceeds the baseline's file cap")
    docket = assignment["maintenance_docket"]
    if docket is not None and (not content_path(docket) or docket in paths
                              or not re.fullmatch(r"content/changelog/\d{4}-\d{2}-\d{2}-[^/]+\.md", docket)):
        raise InputError("maintenance_docket must be this PR's exact new dated docket or null")
    if not isinstance(evidence, dict) or set(evidence) != {"files", "totals"}:
        raise InputError("evidence requires exactly files and totals")
    if not isinstance(evidence["files"], list):
        raise InputError("evidence files must be a list")
    totals = evidence["totals"]
    if (not isinstance(totals, dict) or set(totals) != TOTAL_KEYS
            or any(type(n) is not int or n < 0 for n in totals.values())):
        raise InputError("evidence totals require nonnegative integer reviewed/changed/unchanged/needs_decision")
    old_tree, new_tree = tree(repo, base), tree(repo, head)
    delta = changes(repo, base, head)
    findings = []

    def finding(level: str, path: str, message: str) -> None:
        findings.append({"level": level, "file": path, "message": message})

    def source(entries: dict, path: str) -> bytes:
        mode, kind, oid = entries[path]
        if kind != "blob" or mode not in {"100644", "100755"}:
            raise InputError(f"{path}: not a regular source file")
        data = git(repo, "cat-file", "blob", oid)
        data.decode("utf-8")
        return data

    allowed = set(paths)
    trunk = "content/changelog.md"
    if docket:
        allowed.update({docket, trunk})
        if docket in old_tree or docket not in new_tree:
            finding("error", docket, "own docket must be a new addition, not an existing/missing file")
        if docket in new_tree:
            source(new_tree, docket).decode("utf-8")
        if not any(old_tree.get(p) != new_tree.get(p) for p in paths):
            finding("error", docket, "no-change review must not add an artificial maintenance docket")
    for change in delta:
        status, old_path, new_path = change["status"], change["old"], change["new"]
        if old_path not in allowed or new_path not in allowed:
            finding("error", new_path, "change outside the explicit assignment and own maintenance allowance")
        if status != "M" and not (status == "A" and new_path == docket):
            finding("error", new_path, f"{status}: addition, deletion, move, or type change requires a decision")
    source_cache = {}
    for path in paths:
        if path not in old_tree or path not in new_tree:
            finding("error", path, "assigned record missing at base/head; stop on moves/removals/additions")
            continue
        if old_tree[path][0] != new_tree[path][0]:
            finding("error", path, "source file mode changed")
        before, after = source(old_tree, path), source(new_tree, path)
        source_cache[path] = (before, after)
        checked = [] if path == trunk and docket else preservation(before, after)
        for level, message in checked:
            finding(level, path, message)
    if len(paths) > 1 and (sum(len(a.splitlines()) for a, b in source_cache.values()) > 1600
                          or sum(len(a.split()) for a, b in source_cache.values()) > 7000):
        finding("human_review", "", "assignment exceeds approximate line/word caps; coordinator must split it")
    if docket:
        if trunk not in old_tree or trunk not in new_tree:
            finding("error", trunk, "maintenance trunk must already exist")
        else:
            before, after = source(old_tree, trunk).decode(), source(new_tree, trunk).decode()
            pattern = re.compile(r"^Count: ([0-9]+) records\.$", re.M)
            counts = pattern.findall(after)
            actual = sum(p.startswith("content/changelog/") and p.endswith(".md") for p in new_tree)
            if (len(pattern.findall(before)) != 1 or len(counts) != 1
                    or pattern.sub("Count: <actual> records.", before)
                    != pattern.sub("Count: <actual> records.", after)
                    or int(counts[0]) != actual or old_tree[trunk][0] != new_tree[trunk][0]):
                finding("error", trunk, "only the accurate, recounted Count line may change")
    rows = {}
    counts = Counter({key: 0 for key in TOTAL_KEYS})
    required = {"file", "read_in_full", "disposition", "observation", "line_anchor",
                "decision", "review_evidence"}
    for row in evidence["files"]:
        if not isinstance(row, dict) or set(row) != required:
            raise InputError("each evidence row requires the documented seven fields")
        path = row["file"]
        if not isinstance(path, str) or path not in paths or path in rows:
            raise InputError("evidence paths must be assigned exactly once, without extra paths")
        rows[path] = row
        disposition = row["disposition"]
        if (not isinstance(disposition, str) or disposition not in DISPOSITIONS
                or type(row["read_in_full"]) is not bool):
            raise InputError("invalid disposition or read_in_full flag")
        counts[DISPOSITIONS[disposition]] += 1
        counts["reviewed"] += row["read_in_full"]
        for field in ("observation", "decision", "review_evidence"):
            if not isinstance(row[field], str) or not row[field].strip():
                finding("error", path, f"missing {field}")
        anchor = re.fullmatch(re.escape(path) + r":([1-9]\d*)(?:-([1-9]\d*))?",
                              row["line_anchor"]) if isinstance(row["line_anchor"], str) else None
        if (not anchor or (anchor[2] and int(anchor[2]) < int(anchor[1]))
                or path not in source_cache
                or int(anchor[2] or anchor[1]) > len(source_cache[path][1].splitlines())):
            finding("error", path, "line_anchor must address real lines in this head's assigned file")
        changed = old_tree.get(path) != new_tree.get(path)
        if ((disposition == "changed" and not changed)
                or (disposition == "reviewed unchanged" and changed)):
            finding("error", path, "disposition disagrees with the actual base/head change")
        if not row["read_in_full"] or disposition == "needs decision":
            finding("human_review", path, "reading blocked or needs decision; maintainer resolution required")
    for path in paths:
        if path not in rows:
            finding("error", path, "assigned file omitted from evidence, even if unchanged")
    if dict(counts) != totals:
        finding("error", "", "declared totals do not reconcile with per-file evidence")
    return {"status": "PASS" if not findings else "FINDINGS", "base": base, "head": head,
            "assigned": len(paths), "totals": dict(counts), "changes": delta, "findings": findings,
            "limitation": "Structural checks do not prove reading or editorial quality; independent review is required."}


def load_json(path: Path) -> dict:
    def unique(pairs: list) -> dict:
        result = {}
        for key, value in pairs:
            if key in result:
                raise InputError(f"duplicate JSON key: {key}")
            result[key] = value
        return result
    value = json.loads(path.read_text(encoding="utf-8"), object_pairs_hook=unique)
    if not isinstance(value, dict):
        raise InputError("input must be a JSON object")
    return value


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--repo", type=Path, default=ROOT, help="Git repository (default: this checkout)")
    parser.add_argument("--base", required=True, help="full agreed base commit ID")
    parser.add_argument("--head", required=True, help="full agreed head commit ID")
    parser.add_argument("--assignment", type=Path, required=True, help="one workload's explicit assignment JSON")
    parser.add_argument("--evidence", type=Path, required=True, help="per-file evidence and totals JSON")
    parser.add_argument("--json", action="store_true", help="emit the report as JSON on stdout")
    args = parser.parse_args()
    try:
        report = audit(args.repo.resolve(), args.base, args.head,
                       load_json(args.assignment), load_json(args.evidence))
    except (InputError, OSError, UnicodeError, json.JSONDecodeError) as error:
        print(f"Presentation QA: input/environment error: {error}", file=sys.stderr)
        return 2
    if args.json:
        print(json.dumps(report, ensure_ascii=False, sort_keys=True, indent=2))
    else:
        print(f"Presentation QA: {report['status']}; {report['assigned']} assigned file(s); "
              f"totals {report['totals']}")
        for item in report["findings"]:
            print(f"{item['level']}: {json.dumps(item['file'])}: {item['message']}")
        print(report["limitation"])
    return 1 if report["findings"] else 0


if __name__ == "__main__":
    raise SystemExit(main())
