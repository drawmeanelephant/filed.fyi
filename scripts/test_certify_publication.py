#!/usr/bin/env python3
"""test_certify_publication.py — Regression tests for the Filed certification gate.

scripts/certify_publication.py enforces the Filed publication invariant:

    the bytes Filed deploys must be the bytes its Boris evidence certifies.

It re-verifies the complete Boris publication evidence set over the on-disk
deployable tree and fails the build when any link in the chain is broken.
This test drives the gate over synthetic-but-schema-faithful evidence trees
and proves every failure mode:

  * an untouched build passes;
  * missing Proof Pack (or any required evidence file) fails;
  * a failed Boris check fails;
  * a tampered Proof Pack JSON fails digest verification;
  * script-bearing Proof Pack HTML fails;
  * mutating a certified HTML file after the run fails the gate;
  * absolute, `..`-traversing, and out-of-tree evidence paths are rejected
    before anything outside the certified tree is read;
  * committed artifacts lacking a valid 64-hex SHA-256 fail the gate;
  * duplicate committed artifact paths fail the gate;
  * untouched real and synthetic evidence still passes;
  * the validator never writes into the certified tree.

Usage:
    python3 scripts/test_certify_publication.py
"""

import hashlib
import json
import os
import shutil
import sys
import tempfile
from pathlib import Path

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(ROOT, "scripts"))

from certify_publication import (  # noqa: E402
    GateFailure,
    certify,
)

FAILURES = []


def sha256_bytes(data: bytes) -> str:
    return hashlib.sha256(data).hexdigest()


def sha256_file(path: Path) -> str:
    return sha256_bytes(path.read_bytes())


def check(label, condition):
    if condition:
        print(f"  ok  {label}")
    else:
        FAILURES.append(label)
        print(f"  !!  {label}")


def expect_pass(root: Path) -> str:
    """Certify; returns nothing, raising if the gate unexpectedly fails."""
    certify(root)
    return "pass"


def expect_fail(root: Path, needle: str) -> str:
    """Certify expecting GateFailure mentioning ``needle``."""
    try:
        certify(root)
    except GateFailure as failure:
        if needle in str(failure):
            return "pass"
        raise AssertionError(
            f"expected failure mentioning {needle!r}, got: {failure}"
        ) from failure
    raise AssertionError(f"expected GateFailure mentioning {needle!r}, gate passed")


class EvidenceBuilder:
    """Build a schema-faithful Boris publication evidence tree under a root.

    All digests are recomputed from the actual written bytes, so the builder
    always produces a *passing* tree unless a test tampers with it.
    """

    def __init__(self, root: Path):
        self.root = Path(root)
        self.proof = self.root / "_boris" / "proof"
        self.proof.mkdir(parents=True, exist_ok=True)

    def write_html(self, rel: str, body: str) -> Path:
        path = self.root / rel
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_text(body, encoding="utf-8")
        return path

    def write_json(self, name: str, data: dict) -> Path:
        path = self.proof / name
        path.write_text(json.dumps(data, indent=2), encoding="utf-8")
        return path

    @staticmethod
    def _artifact_record(rel: str, kind: str) -> dict:
        return {
            "path": rel,
            "kind": kind,
            "producer": kind,
            "required": True,
            "status": "committed",
            "bytes": 0,
            "sha256": "",
            "format_version": "1",
        }

    def build(self) -> Path:
        """Write a complete, consistent evidence tree. Returns the root."""
        page = self.write_html(
            "reference/fref-sample.html",
            "<!DOCTYPE html>\n<html><body><h1 id=\"sample\">Sample</h1></body></html>\n",
        )
        search = self.write_html(
            "_boris/search/search-index.json",
            '{"entries": []}\n',
        )
        sitemap = self.write_html("sitemap.xml", "<urlset/>\n")

        artifacts = [
            self._artifact_record("_boris/search/search-index.json",
                                  "rendered-search"),
            self._artifact_record("reference/fref-sample.html", "html-page"),
            self._artifact_record("sitemap.xml", "sitemap"),
        ]
        for record, path in zip(artifacts, (search, page, sitemap)):
            record["bytes"] = path.stat().st_size
            record["sha256"] = sha256_file(path)
        artifacts_path = self.write_json("artifacts.json", {
            "format": "boris-publication-artifacts",
            "artifact_count": len(artifacts),
            "artifacts": artifacts,
        })

        checks_path = self.write_json("checks.json", {
            "format": "boris-publication-checks",
            "checks": [
                {"id": "artifact-integrity", "status": "passed"},
                {"id": "rendered-html", "status": "passed"},
                {"id": "rendered-search", "status": "passed"},
            ],
            "findings": [],
            "artifact_inventory": {
                "path": "_boris/proof/artifacts.json",
                "bytes": artifacts_path.stat().st_size,
                "sha256": sha256_file(artifacts_path),
                "format": "boris-publication-artifacts",
                "schema_version": 1,
                "target": "default",
                "artifact_count": len(artifacts),
            },
        })

        claims_path = self.write_json("claims.json", {
            "format": "boris-publication-claims",
            "claims": [
                {"id": "committed-artifacts-match-inventory",
                 "status": "verified"},
                {"id": "rendered-html-passed-declared-audit",
                 "status": "verified"},
                {"id": "rendered-search-matches-selected-html",
                 "status": "verified"},
            ],
            "limitations": [
                "L1: the proof certifies the bytes Boris committed; "
                "any mutation after the run invalidates it.",
            ],
        })

        touches_path = self.write_json("touches.json", {
            "format": "boris-publication-touches",
            "schema_version": 1,
            "target": "default",
            "nodes": [],
            "edges": [],
            "inputs": {
                "artifacts": {"path": "_boris/proof/artifacts.json",
                              "sha256": sha256_file(artifacts_path)},
                "checks": {"path": "_boris/proof/checks.json",
                           "sha256": sha256_file(checks_path)},
                "claims": {"path": "_boris/proof/claims.json",
                           "sha256": sha256_file(claims_path)},
            },
        })

        def input_entry(name: str, path: Path, count: int) -> dict:
            return {
                "path": f"_boris/proof/{name}",
                "bytes": path.stat().st_size,
                "sha256": sha256_file(path),
                "format": f"boris-publication-{name.rstrip('s')}",
                "schema_version": 1,
                "target": "default",
                "count": count,
            }

        proof_pack_path = self.write_json("proof-pack.json", {
            "format": "boris-publication-proof-pack",
            "schema_version": 1,
            "target": "default",
            "summary": {
                "artifacts": {"total": len(artifacts),
                              "by_status": {"committed": len(artifacts)}},
                "checks": {"total": 3,
                           "by_status": {"passed": 3, "failed": 0,
                                         "incomplete": 0, "not-applicable": 0}},
                "claims": {"total": 3,
                           "by_status": {"verified": 3, "failed": 0,
                                         "not-verified": 0}},
                "findings": {"total": 0,
                             "by_severity": {"error": 0, "warning": 0,
                                             "info": 0}},
                "limitation_count": 1,
                "relationship_node_count": 0,
                "relationship_edge_count": 0,
                "overall_presentation_status": "verified",
            },
            "inputs": {
                "artifacts": input_entry("artifacts.json", artifacts_path,
                                         len(artifacts)),
                "checks": input_entry("checks.json", checks_path, 3),
                "claims": input_entry("claims.json", claims_path, 3),
                "touches": input_entry("touches.json", touches_path, 0),
            },
        })

        # The static presentation embeds a digest of the exact Proof Pack
        # model bytes. No script element.
        self.rebind_presentation()
        return self.root

    def rebind_presentation(self) -> None:
        """Rewrite the Proof Pack presentation embedding the model digest."""
        (self.proof / "index.html").write_text(
            "<!DOCTYPE html>\n<html><head>\n"
            '<meta name="proof-pack-sha256" '
            f'content="{sha256_file(self.proof / "proof-pack.json")}">\n'
            "</head><body><p>Proof Pack</p></body></html>\n",
            encoding="utf-8",
        )

    def tamper_artifacts(self, mutate) -> None:
        """Mutate the artifact inventory and rebind every dependent digest.

        Simulates a malicious-but-consistent evidence set: after ``mutate``
        edits the artifacts records, the digest references in checks.json and
        the Proof Pack model, plus the embedded presentation digest, are
        recomputed so the decisive failure is the confinement/digest check
        itself — not a stale digest elsewhere in the chain.
        """
        artifacts_path = self.proof / "artifacts.json"
        data = json.loads(artifacts_path.read_text(encoding="utf-8"))
        mutate(data)
        artifacts_path.write_text(json.dumps(data, indent=2), encoding="utf-8")

        checks_path = self.proof / "checks.json"
        checks = json.loads(checks_path.read_text(encoding="utf-8"))
        checks["artifact_inventory"]["sha256"] = sha256_file(artifacts_path)
        checks["artifact_inventory"]["bytes"] = artifacts_path.stat().st_size
        checks_path.write_text(json.dumps(checks, indent=2), encoding="utf-8")

        # checks.json was rewritten above, so every Proof Pack input digest
        # is rebound to the current on-disk bytes.
        model_path = self.proof / "proof-pack.json"
        model = json.loads(model_path.read_text(encoding="utf-8"))
        for key in ("artifacts", "checks", "claims", "touches"):
            target = self.proof / f"{key}.json"
            model["inputs"][key]["sha256"] = sha256_file(target)
            model["inputs"][key]["bytes"] = target.stat().st_size
        model_path.write_text(json.dumps(model, indent=2), encoding="utf-8")

        self.rebind_presentation()


def test_untouched_passes():
    print("== untouched build passes ==")
    tmp = Path(tempfile.mkdtemp(prefix="certify-ok-"))
    try:
        root = EvidenceBuilder(tmp).build()
        expect_pass(root)
        check("gate accepted the untouched tree", True)
    finally:
        shutil.rmtree(tmp, ignore_errors=True)


def test_missing_proof_pack_fails():
    print("== missing Proof Pack fails ==")
    tmp = Path(tempfile.mkdtemp(prefix="certify-missing-"))
    try:
        root = EvidenceBuilder(tmp).build()
        (root / "_boris" / "proof" / "proof-pack.json").unlink()
        expect_fail(root, "proof-pack.json")
        check("missing proof-pack.json failed the gate", True)
    finally:
        shutil.rmtree(tmp, ignore_errors=True)


def test_missing_evidence_any_file_fails():
    print("== every required evidence file is mandatory ==")
    tmp = Path(tempfile.mkdtemp(prefix="certify-missing-any-"))
    try:
        for name in ("artifacts.json", "checks.json", "claims.json",
                     "touches.json", "proof-pack.json", "index.html"):
            root = EvidenceBuilder(tmp / name.replace(".", "-")).build()
            (root / "_boris" / "proof" / name).unlink()
            expect_fail(root, name)
            check(f"missing {name} failed the gate", True)
    finally:
        shutil.rmtree(tmp, ignore_errors=True)


def test_no_evidence_dir_fails():
    print("== no evidence directory fails ==")
    tmp = Path(tempfile.mkdtemp(prefix="certify-noev-"))
    try:
        (tmp / "reference").mkdir(parents=True)
        (tmp / "reference" / "fref-sample.html").write_text("<html></html>")
        expect_fail(tmp, "no Boris publication evidence directory")
        check("missing evidence directory failed the gate", True)
    finally:
        shutil.rmtree(tmp, ignore_errors=True)


def test_failed_check_fails():
    print("== failed Boris check fails ==")
    tmp = Path(tempfile.mkdtemp(prefix="certify-failcheck-"))
    try:
        root = EvidenceBuilder(tmp).build()
        checks = json.loads((root / "_boris" / "proof" / "checks.json")
                            .read_text(encoding="utf-8"))
        checks["checks"][1]["status"] = "failed"
        (root / "_boris" / "proof" / "checks.json").write_text(
            json.dumps(checks, indent=2), encoding="utf-8")
        expect_fail(root, "'rendered-html' is 'failed'")
        check("failed check failed the gate", True)
    finally:
        shutil.rmtree(tmp, ignore_errors=True)


def test_tampered_proof_pack_fails_digest():
    print("== tampered Proof Pack JSON fails digest verification ==")
    tmp = Path(tempfile.mkdtemp(prefix="certify-tamperpp-"))
    try:
        root = EvidenceBuilder(tmp).build()
        model = root / "_boris" / "proof" / "proof-pack.json"
        model.write_text(model.read_text(encoding="utf-8") + "\n", encoding="utf-8")
        expect_fail(root, "embedded model digest does not match")
        check("tampered proof-pack.json failed digest verification", True)
    finally:
        shutil.rmtree(tmp, ignore_errors=True)


def test_script_bearing_proof_html_fails():
    print("== script-bearing Proof Pack HTML fails ==")
    tmp = Path(tempfile.mkdtemp(prefix="certify-script-"))
    try:
        root = EvidenceBuilder(tmp).build()
        index = root / "_boris" / "proof" / "index.html"
        index.write_text(
            index.read_text(encoding="utf-8")
            .replace("</body>", "<script>alert(1)</script></body>"),
            encoding="utf-8",
        )
        expect_fail(root, "contains a <script> element")
        check("script-bearing proof HTML failed the gate", True)
    finally:
        shutil.rmtree(tmp, ignore_errors=True)


def test_post_certification_mutation_fails():
    print("== post-certification mutation of certified HTML fails ==")
    tmp = Path(tempfile.mkdtemp(prefix="certify-stale-"))
    try:
        root = EvidenceBuilder(tmp).build()
        page = root / "reference" / "fref-sample.html"
        page.write_text(page.read_text(encoding="utf-8") + "<!-- tampered -->\n",
                        encoding="utf-8")
        expect_fail(root, "mutated after the Boris run")
        check("mutated certified HTML failed the gate", True)
    finally:
        shutil.rmtree(tmp, ignore_errors=True)


def test_absolute_artifact_path_fails():
    print("== absolute artifact path is rejected ==")
    tmp = Path(tempfile.mkdtemp(prefix="certify-abs-"))
    try:
        builder = EvidenceBuilder(tmp)
        root = builder.build()
        builder.tamper_artifacts(
            lambda data: data["artifacts"][0].update(path="/etc/passwd")
        )
        expect_fail(root, "absolute path")
        check("absolute artifact path failed the gate", True)
    finally:
        shutil.rmtree(tmp, ignore_errors=True)


def test_traversal_artifact_path_fails():
    print("== '..' artifact traversal is rejected ==")
    tmp = Path(tempfile.mkdtemp(prefix="certify-traverse-"))
    try:
        builder = EvidenceBuilder(tmp)
        root = builder.build()
        builder.tamper_artifacts(
            lambda data: data["artifacts"][0].update(path="../../outside.html")
        )
        expect_fail(root, "escapes the certified tree")
        check("'..' artifact path failed the gate", True)
    finally:
        shutil.rmtree(tmp, ignore_errors=True)


def test_proof_pack_input_path_escape_fails():
    print("== Proof Pack input path escaping the root is rejected ==")
    tmp = Path(tempfile.mkdtemp(prefix="certify-ppescape-"))
    try:
        builder = EvidenceBuilder(tmp)
        root = builder.build()
        model = json.loads((builder.proof / "proof-pack.json")
                           .read_text(encoding="utf-8"))
        model["inputs"]["checks"]["path"] = "../../../etc/passwd"
        (builder.proof / "proof-pack.json").write_text(
            json.dumps(model, indent=2), encoding="utf-8")
        builder.rebind_presentation()
        expect_fail(root, "escapes the certified tree")
        check("Proof Pack input escape failed the gate", True)
    finally:
        shutil.rmtree(tmp, ignore_errors=True)


def test_committed_artifact_missing_sha256_fails():
    print("== committed artifact missing sha256 is rejected ==")
    tmp = Path(tempfile.mkdtemp(prefix="certify-nosha-"))
    try:
        builder = EvidenceBuilder(tmp)
        root = builder.build()
        builder.tamper_artifacts(
            lambda data: data["artifacts"][0].pop("sha256", None)
        )
        expect_fail(root, "valid 64-hex sha256")
        check("committed artifact without sha256 failed the gate", True)
    finally:
        shutil.rmtree(tmp, ignore_errors=True)


def test_malformed_sha256_fails():
    print("== malformed SHA-256 digest is rejected ==")
    tmp = Path(tempfile.mkdtemp(prefix="certify-badsha-"))
    try:
        builder = EvidenceBuilder(tmp)
        root = builder.build()
        builder.tamper_artifacts(
            lambda data: data["artifacts"][0].update(sha256="not-a-digest")
        )
        expect_fail(root, "valid 64-hex sha256")
        check("malformed sha256 failed the gate", True)
    finally:
        shutil.rmtree(tmp, ignore_errors=True)


def test_non_string_artifact_path_fails():
    print("== non-string artifact path is rejected ==")
    tmp = Path(tempfile.mkdtemp(prefix="certify-nonstr-"))
    try:
        builder = EvidenceBuilder(tmp)
        root = builder.build()
        builder.tamper_artifacts(
            lambda data: data["artifacts"][0].update(path=123)
        )
        expect_fail(root, "not a valid relative path")
        check("non-string artifact path failed the gate", True)
    finally:
        shutil.rmtree(tmp, ignore_errors=True)


def test_symlink_escape_artifact_path_fails():
    print("== artifact path resolving outside the root via symlink is rejected ==")
    tmp = Path(tempfile.mkdtemp(prefix="certify-symlink-"))
    outside_tmp = Path(tempfile.mkdtemp(prefix="certify-outside-"))
    try:
        builder = EvidenceBuilder(tmp)
        root = builder.build()
        outside = outside_tmp / "secret.html"
        outside.write_text("<html></html>", encoding="utf-8")
        (root / "escape-link.html").symlink_to(outside)
        builder.tamper_artifacts(
            lambda data: data["artifacts"][0].update(path="escape-link.html")
        )
        expect_fail(root, "escapes the certified tree")
        check("symlink-escape artifact path failed the gate", True)
    finally:
        shutil.rmtree(tmp, ignore_errors=True)
        shutil.rmtree(outside_tmp, ignore_errors=True)


def test_duplicate_artifact_path_fails():
    print("== duplicate committed artifact path is rejected ==")
    tmp = Path(tempfile.mkdtemp(prefix="certify-dup-"))
    try:
        builder = EvidenceBuilder(tmp)
        root = builder.build()
        builder.tamper_artifacts(
            lambda data: data["artifacts"][1].update(
                path=data["artifacts"][0]["path"])
        )
        expect_fail(root, "duplicate committed artifact path")
        check("duplicate artifact path failed the gate", True)
    finally:
        shutil.rmtree(tmp, ignore_errors=True)


def test_untouched_real_evidence_passes_when_present():
    print("== untouched real Boris evidence passes (if a built tree is present) ==")
    tree = Path(ROOT) / "dist" / "cantilever"
    if not (tree / "_boris" / "proof" / "proof-pack.json").is_file():
        print("  -- no built tree at dist/cantilever; skipping real-evidence check")
        return
    expect_pass(tree)
    check("gate accepted the untouched real evidence tree", True)


def _tree_snapshot(root: Path) -> dict:
    """Return {relative-path: bytes} for every file under ``root``."""
    snapshot = {}
    for path in sorted(root.rglob("*")):
        if path.is_file():
            snapshot[str(path.relative_to(root))] = path.read_bytes()
    return snapshot


def test_inventory_sha256_mismatch_fails():
    print("== checks.json artifact inventory digest mismatch fails ==")
    tmp = Path(tempfile.mkdtemp(prefix="certify-inventory-"))
    try:
        root = EvidenceBuilder(tmp).build()
        checks = json.loads((root / "_boris" / "proof" / "checks.json")
                            .read_text(encoding="utf-8"))
        checks["artifact_inventory"]["sha256"] = "0" * 64
        (root / "_boris" / "proof" / "checks.json").write_text(
            json.dumps(checks, indent=2), encoding="utf-8")
        expect_fail(root, "artifact_inventory.sha256 does not match")
        check("inventory digest mismatch failed the gate", True)
    finally:
        shutil.rmtree(tmp, ignore_errors=True)


def test_validator_is_read_only():
    print("== validator never writes into the certified tree ==")
    tmp = Path(tempfile.mkdtemp(prefix="certify-readonly-"))
    try:
        root = EvidenceBuilder(tmp).build()
        before = _tree_snapshot(root)
        expect_pass(root)
        after = _tree_snapshot(root)
        check("no bytes changed by a passing certification", before == after)
        check("no new files created by a passing certification",
              sorted(before) == sorted(after))

        # A failing certification must also be strictly read-only: the gate
        # detects the tamper without writing anything into the tree.
        page = root / "reference" / "fref-sample.html"
        page.write_text(page.read_text(encoding="utf-8") + "<!-- tampered -->\n",
                        encoding="utf-8")
        before_fail = _tree_snapshot(root)
        expect_fail(root, "mutated after the Boris run")
        after_fail = _tree_snapshot(root)
        check("no bytes changed by a failing certification",
              after_fail == before_fail)
        check("no new files created by a failing certification",
              sorted(after_fail) == sorted(before_fail))
    finally:
        shutil.rmtree(tmp, ignore_errors=True)


def main():
    tests = [
        test_untouched_passes,
        test_untouched_real_evidence_passes_when_present,
        test_missing_proof_pack_fails,
        test_missing_evidence_any_file_fails,
        test_no_evidence_dir_fails,
        test_failed_check_fails,
        test_tampered_proof_pack_fails_digest,
        test_script_bearing_proof_html_fails,
        test_post_certification_mutation_fails,
        test_inventory_sha256_mismatch_fails,
        test_absolute_artifact_path_fails,
        test_traversal_artifact_path_fails,
        test_proof_pack_input_path_escape_fails,
        test_committed_artifact_missing_sha256_fails,
        test_malformed_sha256_fails,
        test_non_string_artifact_path_fails,
        test_symlink_escape_artifact_path_fails,
        test_duplicate_artifact_path_fails,
        test_validator_is_read_only,
    ]
    for test in tests:
        test()
        print()

    if FAILURES:
        print("FAILED:")
        for failure in FAILURES:
            print(f"  - {failure}")
        sys.exit(1)
    print("PASS — certification gate detects every stale-proof failure mode, "
          "confines all evidence paths to the certified tree, requires "
          "digests for committed artifacts, and never writes into the tree.")


if __name__ == "__main__":
    main()
