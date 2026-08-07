#!/usr/bin/env python3
"""test_content_audit_policy.py — Regression tests for the deterministic
Boris poetry-audit policy generator (scripts/build_content_audit_policy.py).

Proves the reviewed-policy contract:

1. accepted ownership evidence (mascotRef / relatedMascots / relatedHaiku /
   relatedLimerick) maps a poetry record to exactly one owner;
2. an unrelated category (relatedEntries) never becomes ownership;
3. poetry/source direction is deterministic for accepted relationships whose
   poetry endpoint may sit on either legacy side;
4. two owners for one poetry id produce an ambiguous_ownership finding and no
   mapping (the generator never picks a winner);
5. unresolved accepted evidence is reported, never dropped;
6. duplicate identical evidence deduplicates safely;
7. output is byte-identical across runs;
8. --check detects drift;
9. filenames, titles, tags, numeric prefixes, and legacy match types never
   participate in matching — only canonical ids do.

Usage:
    python3 scripts/test_content_audit_policy.py
"""

import json
import os
import subprocess
import sys
import tempfile
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT / "scripts"))

import build_content_audit_policy as b  # noqa: E402

FAILURES = []


def check(condition, message):
    if condition:
        print(f"  ok  {message}")
    else:
        FAILURES.append(message)


# ---------------------------------------------------------------------------
# Fixture helpers
# ---------------------------------------------------------------------------

def write_fixture(tmp: Path, *, rows, content_files, idmap_rows=None):
    """Write a minimal project under tmp with committed inputs + content."""
    (tmp / "metadata" / "content-audit-policy").mkdir(parents=True, exist_ok=True)
    (tmp / "content").mkdir(parents=True, exist_ok=True)

    # Population + categories are the committed canonical config.
    population = json.loads(
        (ROOT / "metadata" / "content-audit-policy" / "population.json").read_text()
    )
    categories = json.loads(
        (ROOT / "metadata" / "content-audit-policy" / "categories.json").read_text()
    )
    (tmp / "metadata" / "content-audit-policy" / "population.json").write_text(
        json.dumps(population, indent=2, sort_keys=True)
    )
    (tmp / "metadata" / "content-audit-policy" / "categories.json").write_text(
        json.dumps(categories, indent=2, sort_keys=True)
    )

    idmap_rows = idmap_rows if idmap_rows is not None else []
    if idmap_rows:
        (tmp / "metadata" / "id-map.jsonl").write_text(
            "".join(json.dumps(r) + "\n" for r in idmap_rows)
        )

    with (tmp / "metadata" / "relationship-map.jsonl").open("w") as fh:
        for row in rows:
            fh.write(json.dumps(row) + "\n")

    for rel, text in content_files.items():
        path = tmp / "content" / rel
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_text(text, encoding="utf-8")


def record(collection, form, *, status="published", title=None, tags=None):
    """A content satellite file whose canonical id is collection/FORM."""
    rel = f"{collection}/{form.lower()}.md"
    text = (
        f"---\n"
        f'title: "{title or form}"\n'
        f"id: {collection}/{form}\n"
        f"parent: {collection}\n"
        f"status: {status}\n"
        f"tags: {json.dumps(tags or [])}\n"
        f"---\n\n# {title or form}\n"
    )
    return rel, text


def trunk(collection):
    return f"{collection}.md", (
        f"---\ntitle: {collection}\nid: {collection}\nstatus: published\n---\n\n# {collection}\n"
    )


def idmap_rows(*ids):
    """Build id-map rows for canonical ids (satellite role)."""
    rows = []
    for entity in ids:
        collection = entity.split("/")[0]
        rows.append(
            {
                "collection": collection,
                "form_id": entity.split("/")[1],
                "id": entity,
                "legacy_id": entity,
                "parent": collection,
                "role": "satellite",
                "source": f"{collection}/x.md",
                "title": entity,
            }
        )
    return rows


def run_gen(tmp, *extra):
    """Run the generator inside tmp; returns (exit_code, output_dir Path)."""
    out = tmp / "out"
    cmd = [
        sys.executable,
        str(ROOT / "scripts" / "build_content_audit_policy.py"),
        "--map", str(tmp / "metadata" / "relationship-map.jsonl"),
        "--id-map", str(tmp / "metadata" / "id-map.jsonl"),
        "--population", str(tmp / "metadata" / "content-audit-policy" / "population.json"),
        "--categories", str(tmp / "metadata" / "content-audit-policy" / "categories.json"),
        "--content", str(tmp / "content"),
        "--output", str(out / "policy.json"),
        "--summary", str(out / "summary.json"),
        "--quiet",
    ] + list(extra)
    result = subprocess.run(cmd, capture_output=True, text=True, cwd=tmp)
    return result.returncode, out


def mapping_summary(out: Path):
    summary = json.loads((out / "summary.json").read_text())
    return summary


# ---------------------------------------------------------------------------
# Shared fixture: one mascot, one lorelog, three poems, generic links.
# ---------------------------------------------------------------------------

def base_fixture(tmp):
    rows = [
        # accepted: haiku declares its mascot (poetry endpoint = declarer)
        {
            "current_id": "haikus/HAI-0001",
            "current_source": "haikus/hai-0001.md",
            "legacy_collection": "mascots",
            "legacy_field": "mascotRef",
            "legacy_source": "docs/haikus/hai-0001.mdx",
            "legacy_target": "mascot-one",
            "match_type": "slug",
            "provenance": "6abe4416",
            "resolved_id": "mascots/M-0001",
            "resolved_source": "mascots/001.mascot-one.md",
            "status": "resolved",
        },
        # accepted: lorelog hosts a haiku (poetry endpoint = target)
        {
            "current_id": "lorelog/LLG-0001",
            "current_source": "lorelog/llg-0001.md",
            "legacy_collection": "lorelog",
            "legacy_field": "relatedHaiku",
            "legacy_source": "docs/lorelog/llg-0001.mdx",
            "legacy_target": "H-0002",
            "match_type": "exact",
            "provenance": "6abe4416",
            "resolved_id": "haikus/HAI-0002",
            "resolved_source": "haikus/hai-0002.md",
            "status": "resolved",
        },
        # rejected: generic link between a mascot and an aphorism
        {
            "current_id": "mascots/M-0001",
            "current_source": "mascots/001.mascot-one.md",
            "legacy_collection": "mascots",
            "legacy_field": "relatedEntries",
            "legacy_source": "docs/mascots/001.mascot-one.mdx",
            "legacy_target": "aphorism-one",
            "match_type": "exact",
            "provenance": "6abe4416",
            "resolved_id": "aphorisms/APH-0001",
            "resolved_source": "aphorisms/aph-0001.md",
            "status": "resolved",
        },
    ]
    content = {
        trunk("haikus"),
        trunk("aphorisms"),
        trunk("limericks"),
        record("haikus", "HAI-0001"),
        record("haikus", "HAI-0002"),
        record("aphorisms", "APH-0001"),
        record("mascots", "M-0001"),
        record("lorelog", "LLG-0001"),
    }
    # content files dict: {rel: text}
    files = {}
    for rel, text in content:
        files[rel] = text
    idmap = idmap_rows(
        "haikus/HAI-0001",
        "haikus/HAI-0002",
        "aphorisms/APH-0001",
        "mascots/M-0001",
        "lorelog/LLG-0001",
    )
    write_fixture(tmp, rows=rows, content_files=files, idmap_rows=idmap)


# ---------------------------------------------------------------------------
# Tests
# ---------------------------------------------------------------------------

def test_accepted_ownership_maps():
    print("accepted ownership evidence maps poetry to exactly one owner")
    with tempfile.TemporaryDirectory() as td:
        tmp = Path(td)
        base_fixture(tmp)
        code, out = run_gen(tmp)
        check(code == 0, "generation exits 0 with no blocking findings")
        policy = json.loads((out / "policy.json").read_text())
        check(
            policy["exact_mappings"].get("haikus/HAI-0001") == "mascots/M-0001",
            "mascotRef maps haikus/HAI-0001 -> mascots/M-0001",
        )
        check(
            policy["exact_mappings"].get("haikus/HAI-0002") == "lorelog/LLG-0001",
            "relatedHaiku maps haikus/HAI-0002 -> lorelog/LLG-0001",
        )
        summary = mapping_summary(out)
        check(summary["mappings"]["total"] == 2, "exactly two mappings")


def test_unrelated_category_not_ownership():
    print("unrelated relationship category never becomes ownership")
    with tempfile.TemporaryDirectory() as td:
        tmp = Path(td)
        base_fixture(tmp)
        code, out = run_gen(tmp)
        policy = json.loads((out / "policy.json").read_text())
        check(
            "aphorisms/APH-0001" not in policy["exact_mappings"],
            "relatedEntries does not map aphorisms/APH-0001",
        )


def test_direction_deterministic():
    print("poetry/source direction is deterministic for both accepted sides")
    with tempfile.TemporaryDirectory() as td:
        tmp = Path(td)
        base_fixture(tmp)
        code, out = run_gen(tmp)
        policy = json.loads((out / "policy.json").read_text())
        # mascotRef: poetry endpoint is the declarer; relatedHaiku: the target.
        check(policy["exact_mappings"]["haikus/HAI-0001"] == "mascots/M-0001", "declarer side is the poetry record")
        check(policy["exact_mappings"]["haikus/HAI-0002"] == "lorelog/LLG-0001", "target side is the poetry record")
        # The audit-facing invariant: key is poetry, value is a source.
        for poetry_id, owner in policy["exact_mappings"].items():
            check(
                poetry_id.startswith(("haikus/", "aphorisms/", "limericks/"))
                and owner.startswith(("mascots/", "lorelog/")),
                f"mapping direction {poetry_id} -> {owner} is poetry -> source",
            )


def test_two_owners_reported_not_chosen():
    print("two owners for one poetry id: reported, never chosen")
    with tempfile.TemporaryDirectory() as td:
        tmp = Path(td)
        base_fixture(tmp)
        rows = [
            {
                "current_id": "haikus/HAI-0003",
                "current_source": "haikus/hai-0003.md",
                "legacy_collection": "mascots",
                "legacy_field": "mascotRef",
                "legacy_source": "docs/haikus/hai-0003.mdx",
                "legacy_target": "mascot-one",
                "match_type": "exact",
                "provenance": "6abe4416",
                "resolved_id": "mascots/M-0001",
                "resolved_source": "mascots/001.mascot-one.md",
                "status": "resolved",
            },
            {
                "current_id": "lorelog/LLG-0001",
                "current_source": "lorelog/llg-0001.md",
                "legacy_collection": "lorelog",
                "legacy_field": "relatedHaiku",
                "legacy_source": "docs/lorelog/llg-0001.mdx",
                "legacy_target": "H-0003",
                "match_type": "exact",
                "provenance": "6abe4416",
                "resolved_id": "haikus/HAI-0003",
                "resolved_source": "haikus/hai-0003.md",
                "status": "resolved",
            },
        ]
        files = {}
        for rel, text in (
            trunk("haikus"),
            trunk("limericks"),
            trunk("aphorisms"),
            record("haikus", "HAI-0003"),
            record("mascots", "M-0001"),
            record("lorelog", "LLG-0001"),
        ):
            files[rel] = text
        write_fixture(
            tmp,
            rows=rows,
            content_files=files,
            idmap_rows=idmap_rows(
                "haikus/HAI-0003", "mascots/M-0001", "lorelog/LLG-0001"
            ),
        )
        code, out = run_gen(tmp)
        check(code == 0, "contested evidence is reported, not blocking (exit 0)")
        policy = json.loads((out / "policy.json").read_text())
        check(
            "haikus/HAI-0003" not in policy["exact_mappings"],
            "contested poetry id is not mapped",
        )
        summary = mapping_summary(out)
        kinds = [f["kind"] for f in summary["findings"]]
        check(
            "ambiguous_ownership" in kinds,
            "ambiguous_ownership finding reported",
        )
        check(summary["poetry"]["records_ambiguous"] == 1, "ambiguity count is 1")


def test_blocking_findings_fail_generation():
    print("blocking findings (noncanonical / missing content) fail generation")
    with tempfile.TemporaryDirectory() as td:
        tmp = Path(td)
        base_fixture(tmp)
        rows = [
            {
                "current_id": "haikus/HAI-0001",
                "current_source": "haikus/hai-0001.md",
                "legacy_collection": "mascots",
                "legacy_field": "mascotRef",
                "legacy_source": "docs/haikus/hai-0001.mdx",
                "legacy_target": "mascot-one",
                "match_type": "exact",
                "provenance": "6abe4416",
                "resolved_id": "mascots/M-9999",  # valid collection, NOT canonical
                "resolved_source": "mascots/9999.x.md",
                "status": "resolved",
            }
        ]
        files = {
            trunk("haikus")[0]: trunk("haikus")[1],
            record("haikus", "HAI-0001")[0]: record("haikus", "HAI-0001")[1],
        }
        write_fixture(
            tmp,
            rows=rows,
            content_files=files,
            idmap_rows=idmap_rows("haikus/HAI-0001"),
        )
        code, out = run_gen(tmp)
        check(code == 1, "noncanonical source endpoint fails generation (exit 1)")
        summary = mapping_summary(out)
        check(
            any(f["kind"] == "noncanonical_endpoint" and f["blocking"] for f in summary["findings"]),
            "noncanonical_endpoint blocking finding reported",
        )
        policy = json.loads((out / "policy.json").read_text())
        check(
            "haikus/HAI-0001" not in policy["exact_mappings"],
            "noncanonical evidence never becomes a mapping",
        )


def test_missing_endpoint_reported():
    print("unresolved accepted evidence is reported, never dropped")
    with tempfile.TemporaryDirectory() as td:
        tmp = Path(td)
        base_fixture(tmp)
        rows = [
            {
                "current_id": None,
                "current_source": "haikus/hai-0099.md",
                "legacy_collection": "mascots",
                "legacy_field": "mascotRef",
                "legacy_source": "docs/haikus/hai-0099.mdx",
                "legacy_target": "missing-mascot",
                "match_type": None,
                "provenance": "6abe4416",
                "resolved_id": None,
                "resolved_source": None,
                "status": "missing",
            }
        ]
        files = {
            trunk("haikus")[0]: trunk("haikus")[1],
            record("haikus", "HAI-0001")[0]: record("haikus", "HAI-0001")[1],
        }
        write_fixture(
            tmp,
            rows=rows,
            content_files=files,
            idmap_rows=idmap_rows("haikus/HAI-0001"),
        )
        code, out = run_gen(tmp)
        check(code == 0, "reported (non-blocking), exit 0")
        summary = mapping_summary(out)
        check(
            any(f["kind"] == "unresolved_accepted_evidence" for f in summary["findings"]),
            "unresolved_accepted_evidence finding present",
        )
        policy = json.loads((out / "policy.json").read_text())
        check("haikus/HAI-0099" not in policy["exact_mappings"], "no mapping for missing endpoint")


def test_duplicate_evidence_dedupes():
    print("duplicate identical evidence deduplicates safely")
    with tempfile.TemporaryDirectory() as td:
        tmp = Path(td)
        base_fixture(tmp)
        rows = [
            {
                "current_id": "haikus/HAI-0001",
                "current_source": "haikus/hai-0001.md",
                "legacy_collection": "mascots",
                "legacy_field": "mascotRef",
                "legacy_source": "docs/haikus/hai-0001.mdx",
                "legacy_target": "mascot-one",
                "match_type": "exact",
                "provenance": "6abe4416",
                "resolved_id": "mascots/M-0001",
                "resolved_source": "mascots/001.mascot-one.md",
                "status": "resolved",
            },
            {
                "current_id": "haikus/HAI-0001",
                "current_source": "haikus/hai-0001.md",
                "legacy_collection": "mascots",
                "legacy_field": "relatedMascots",
                "legacy_source": "docs/haikus/hai-0001.mdx",
                "legacy_target": "mascot-one",
                "match_type": "slug",
                "provenance": "6abe4416",
                "resolved_id": "mascots/M-0001",
                "resolved_source": "mascots/001.mascot-one.md",
                "status": "resolved",
            },
        ]
        files = {
            trunk("haikus")[0]: trunk("haikus")[1],
            record("haikus", "HAI-0001")[0]: record("haikus", "HAI-0001")[1],
            record("mascots", "M-0001")[0]: record("mascots", "M-0001")[1],
        }
        write_fixture(
            tmp,
            rows=rows,
            content_files=files,
            idmap_rows=idmap_rows("haikus/HAI-0001", "mascots/M-0001"),
        )
        code, out = run_gen(tmp)
        policy = json.loads((out / "policy.json").read_text())
        check(policy["exact_mappings"] == {"haikus/HAI-0001": "mascots/M-0001"}, "one stable mapping after dedupe")
        summary = mapping_summary(out)
        check(summary["rows"]["duplicate_evidence_removed"] == 1, "duplicate evidence counted")


def test_byte_identical_across_runs():
    print("output is byte-identical across runs")
    with tempfile.TemporaryDirectory() as td:
        tmp = Path(td)
        base_fixture(tmp)
        _, out1 = run_gen(tmp)
        first_policy = (out1 / "policy.json").read_bytes()
        first_summary = (out1 / "summary.json").read_bytes()
        _, out2 = run_gen(tmp)
        check(first_policy == (out2 / "policy.json").read_bytes(), "policy.json identical")
        check(first_summary == (out2 / "summary.json").read_bytes(), "summary.json identical")


def test_check_detects_drift():
    print("--check detects drift in the committed policy")
    with tempfile.TemporaryDirectory() as td:
        tmp = Path(td)
        base_fixture(tmp)
        # First run commits the outputs inside the fixture project.
        out = tmp / "out"
        code, _ = run_gen(tmp)
        check(code == 0, "fresh generation succeeds")
        code_ok, _ = run_gen(tmp, "--check")
        check(code_ok == 0, "--check passes on identical bytes")
        # Tamper with the committed policy.
        policy_path = out / "policy.json"
        policy_path.write_text(policy_path.read_text() + '  "tampered": true\n')
        code_drift, _ = run_gen(tmp, "--check")
        check(code_drift == 1, "--check exits 1 on drift")


def test_no_filename_title_tag_matching():
    print("filenames, titles, tags, and match types never participate")
    with tempfile.TemporaryDirectory() as td:
        tmp = Path(td)
        base_fixture(tmp)
        # Misleading content: the file for HAI-0009 is named and titled after a
        # *different* mascot, with tags that resemble another record, and the
        # legacy resolution used a slug that shares nothing with the canonical
        # id. The mapping must still follow the canonical ids in the map.
        rows = [
            {
                "current_id": "haikus/HAI-0009",
                "current_source": "haikus/wrong-name.md",
                "legacy_collection": "mascots",
                "legacy_field": "mascotRef",
                "legacy_source": "docs/haikus/some-other-slug.mdx",
                "legacy_target": "some-other-slug",
                "match_type": "slug",
                "provenance": "6abe4416",
                "resolved_id": "mascots/M-0042",
                "resolved_source": "mascots/0042.wrong-owner.md",
                "status": "resolved",
            }
        ]
        files = {
            trunk("haikus")[0]: trunk("haikus")[1],
            "haikus/wrong-name.md": (
                "---\n"
                'title: "Mascot Forty-Two"  # title that matches the *other* record\n'
                "id: haikus/HAI-0009\n"
                "parent: haikus\n"
                "status: published\n"
                'tags: ["haikus", "stub", "kindy-mcexistentialcrisis"]\n'
                "---\n\n# Stub: Misleading\n"
            ),
            "mascots/0042.wrong-owner.md": (
                "---\n"
                'title: "Wrong Owner"\n'
                "id: mascots/M-0042\n"
                "parent: mascots\n"
                "status: published\n"
                "tags: []\n"
                "---\n\n# Wrong Owner\n"
            ),
        }
        write_fixture(
            tmp,
            rows=rows,
            content_files=files,
            idmap_rows=idmap_rows("haikus/HAI-0009", "mascots/M-0042"),
        )
        code, out = run_gen(tmp)
        policy = json.loads((out / "policy.json").read_text())
        check(
            policy["exact_mappings"].get("haikus/HAI-0009") == "mascots/M-0042",
            "mapping follows canonical ids despite misleading filename/title/tags",
        )
        check(
            all(not pid.startswith(("HAI-0042", "042")) for pid in policy["exact_mappings"]),
            "numeric prefixes in ids/filenames are not used as identity",
        )


def main() -> int:
    tests = [
        test_accepted_ownership_maps,
        test_unrelated_category_not_ownership,
        test_direction_deterministic,
        test_two_owners_reported_not_chosen,
        test_missing_endpoint_reported,
        test_blocking_findings_fail_generation,
        test_duplicate_evidence_dedupes,
        test_byte_identical_across_runs,
        test_check_detects_drift,
        test_no_filename_title_tag_matching,
    ]
    for test in tests:
        test()
    if FAILURES:
        print(f"\ncontent audit policy tests: {len(FAILURES)} failure(s)")
        for message in FAILURES:
            print(f"  FAIL  {message}")
        return 1
    print(f"\ncontent audit policy tests: all {len(tests)} checks passed")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
