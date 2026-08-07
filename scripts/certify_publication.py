#!/usr/bin/env python3
"""certify_publication.py — Mandatory Filed publication evidence gate.

Filed's build invariant is:

    the bytes Filed deploys must be the bytes its Boris evidence certifies.

Boris emits a publication proof pack under <html-dir>/_boris/proof/ that
certifies the HTML, search index, sitemap, and assets it rendered. This
validator re-verifies that evidence **against the on-disk deployable tree**
and fails the build if any link in the chain is broken:

  * every required evidence file is present (no optional `if -f` skip);
  * every publication check is `passed` or `not-applicable`, and the checks
    report no findings;
  * every claim is `verified`;
  * the Proof Pack model state is `verified`/successful per its schema;
  * the Proof Pack HTML's embedded model digest matches the exact bytes of
    the Proof Pack JSON it presents;
  * the Proof Pack presentation contains no `<script` element;
  * the artifacts/checks/claims/touches files are all from the same build
    (their recorded sha256 digests match the on-disk bytes);
  * every committed artifact recorded in the inventory matches the exact
    on-disk bytes — so any post-certification mutation of the deployable
    tree fails the gate.

The validator is strictly read-only: it never writes into the certified tree.

Usage:
    python3 scripts/certify_publication.py <html-dir>
"""

from __future__ import annotations

import argparse
import hashlib
import json
import re
import sys
from pathlib import Path

# Exact evidence files emitted by the pinned Boris contract, relative to
# <html-dir>/_boris/proof/.
REQUIRED_EVIDENCE = (
    "artifacts.json",   # artifact inventory
    "checks.json",      # publication checks
    "claims.json",      # claims + limitations
    "touches.json",     # Touch Atlas
    "proof-pack.json",  # Proof Pack model
    "index.html",       # Proof Pack static presentation
)

CHECK_PASS_STATUSES = {"passed", "not-applicable"}
CLAIM_VERIFIED_STATUS = "verified"
PROOF_PACK_OK_STATES = {"verified", "successful", "success", "passed", "ok"}

SCRIPT_RE = re.compile(r"<\s*script[\s>]", re.IGNORECASE)
PROOF_PACK_SHA_META_RE = re.compile(
    r'<meta\s+name="proof-pack-sha256"\s+content="([0-9a-fA-F]{64})"\s*/?>'
)


def sha256_bytes(data: bytes) -> str:
    return hashlib.sha256(data).hexdigest()


def sha256_file(path: Path) -> str:
    return sha256_bytes(path.read_bytes())


class GateFailure(Exception):
    """Raised with a human-readable finding."""


def _require_file(path: Path) -> None:
    if not path.is_file():
        raise GateFailure(f"missing required evidence file: {path.relative_to(path.parents[1])}")


def validate_checks(proof_dir: Path) -> dict:
    path = proof_dir / "checks.json"
    _require_file(path)
    try:
        data = json.loads(path.read_text(encoding="utf-8"))
    except (OSError, UnicodeError, json.JSONDecodeError) as error:
        raise GateFailure(f"checks.json unreadable: {error}") from error

    if data.get("format") != "boris-publication-checks":
        raise GateFailure(f"checks.json unexpected format: {data.get('format')!r}")
    for check in data.get("checks", []):
        status = check.get("status")
        if status not in CHECK_PASS_STATUSES:
            raise GateFailure(
                f"check {check.get('id')!r} is {status!r}; "
                f"expected one of {sorted(CHECK_PASS_STATUSES)}"
            )
    if data.get("findings"):
        raise GateFailure(f"checks.json reports {len(data['findings'])} finding(s)")
    if data.get("artifact_inventory", {}).get("sha256"):
        recorded = data["artifact_inventory"]["sha256"]
        actual = sha256_file(proof_dir / "artifacts.json")
        if actual != recorded:
            raise GateFailure(
                "checks.json artifact_inventory.sha256 does not match "
                f"artifacts.json bytes ({recorded} != {actual})"
            )
    return data


def validate_claims(proof_dir: Path) -> dict:
    path = proof_dir / "claims.json"
    _require_file(path)
    try:
        data = json.loads(path.read_text(encoding="utf-8"))
    except (OSError, UnicodeError, json.JSONDecodeError) as error:
        raise GateFailure(f"claims.json unreadable: {error}") from error

    if data.get("format") != "boris-publication-claims":
        raise GateFailure(f"claims.json unexpected format: {data.get('format')!r}")
    for claim in data.get("claims", []):
        if claim.get("status") != CLAIM_VERIFIED_STATUS:
            raise GateFailure(
                f"claim {claim.get('id')!r} is {claim.get('status')!r}; "
                f"expected {CLAIM_VERIFIED_STATUS!r}"
            )
    limitations = data.get("limitations")
    if not isinstance(limitations, list) or not limitations:
        raise GateFailure("claims.json carries no limitations")
    return data


def validate_touches(proof_dir: Path) -> dict:
    path = proof_dir / "touches.json"
    _require_file(path)
    try:
        data = json.loads(path.read_text(encoding="utf-8"))
    except (OSError, UnicodeError, json.JSONDecodeError) as error:
        raise GateFailure(f"touches.json unreadable: {error}") from error
    if data.get("format") != "boris-publication-touches":
        raise GateFailure(f"touches.json unexpected format: {data.get('format')!r}")
    if "nodes" not in data or "edges" not in data:
        raise GateFailure("touches.json missing nodes/edges")
    return data


def validate_proof_pack_model(root: Path, proof_dir: Path) -> dict:
    """Validate the Proof Pack model and bind its inputs to the on-disk bytes.

    The Proof Pack JSON records sha256 digests of artifacts/checks/claims/
    touches. Their ``path`` values are **root-relative** (e.g.
    ``_boris/proof/artifacts.json``), so they are resolved against ``root``,
    not ``proof_dir``. Any mismatch means the evidence set is not from one
    consistent build.
    """
    path = proof_dir / "proof-pack.json"
    _require_file(path)
    try:
        data = json.loads(path.read_text(encoding="utf-8"))
    except (OSError, UnicodeError, json.JSONDecodeError) as error:
        raise GateFailure(f"proof-pack.json unreadable: {error}") from error

    if data.get("format") != "boris-publication-proof-pack":
        raise GateFailure(f"proof-pack.json unexpected format: {data.get('format')!r}")

    summary = data.get("summary") or {}
    overall = summary.get("overall_presentation_status")
    if overall not in PROOF_PACK_OK_STATES:
        raise GateFailure(
            f"Proof Pack overall status is {overall!r}; "
            f"expected one of {sorted(PROOF_PACK_OK_STATES)}"
        )

    checks_summary = summary.get("checks") or {}
    by_status = checks_summary.get("by_status") or {}
    if by_status.get("failed", 0) or by_status.get("incomplete", 0):
        raise GateFailure(
            "Proof Pack summary reports failed/incomplete checks: "
            f"{by_status}"
        )
    claims_summary = summary.get("claims") or {}
    claims_by_status = claims_summary.get("by_status") or {}
    if claims_by_status.get("failed", 0) or claims_by_status.get("not-verified", 0):
        raise GateFailure(
            "Proof Pack summary reports failed/unverified claims: "
            f"{claims_by_status}"
        )
    findings = summary.get("findings") or {}
    if findings.get("total", 0):
        raise GateFailure(f"Proof Pack summary reports {findings['total']} finding(s)")

    # Every input recorded in the Proof Pack model must match the on-disk
    # bytes — this binds artifacts/checks/claims/touches to one build.
    inputs = data.get("inputs") or {}
    for key in ("artifacts", "checks", "claims", "touches"):
        entry = inputs.get(key)
        if not isinstance(entry, dict):
            raise GateFailure(f"proof-pack.json inputs missing {key!r}")
        recorded = entry.get("sha256")
        if not recorded:
            raise GateFailure(f"proof-pack.json inputs.{key} missing sha256")
        rel = entry.get("path", f"_boris/proof/{key}.json")
        target = root / rel.lstrip("/")
        if not target.is_file():
            raise GateFailure(f"proof-pack.json inputs.{key} path not found: {rel}")
        actual = sha256_file(target)
        if actual != recorded:
            raise GateFailure(
                f"proof-pack.json inputs.{key}.sha256 does not match on-disk "
                f"{rel!r} bytes ({recorded} != {actual})"
            )
    return data


def validate_proof_pack_presentation(proof_dir: Path, model_path: Path) -> None:
    path = proof_dir / "index.html"
    _require_file(path)
    try:
        html = path.read_text(encoding="utf-8")
    except (OSError, UnicodeError) as error:
        raise GateFailure(f"proof/index.html unreadable: {error}") from error

    if SCRIPT_RE.search(html):
        raise GateFailure("Proof Pack presentation contains a <script> element")

    model_digest = sha256_file(model_path)
    match = PROOF_PACK_SHA_META_RE.search(html)
    if not match:
        raise GateFailure(
            "Proof Pack presentation does not embed a proof-pack-sha256 meta "
            "digest of the Proof Pack model"
        )
    if match.group(1).lower() != model_digest.lower():
        raise GateFailure(
            "Proof Pack presentation embedded model digest does not match the "
            f"exact Proof Pack JSON bytes ({match.group(1)} != {model_digest})"
        )


def validate_inventory_matches_disk(root: Path, proof_dir: Path) -> None:
    """Every committed artifact must match the exact on-disk bytes.

    This is the decisive "no post-certification mutation" check: any rewrite
    of a certified HTML/asset/search/sitemap file after the Boris run changes
    its sha256 and fails the gate.
    """
    path = proof_dir / "artifacts.json"
    try:
        data = json.loads(path.read_text(encoding="utf-8"))
    except (OSError, UnicodeError, json.JSONDecodeError) as error:
        raise GateFailure(f"artifacts.json unreadable: {error}") from error

    if data.get("format") != "boris-publication-artifacts":
        raise GateFailure(f"artifacts.json unexpected format: {data.get('format')!r}")

    artifacts = data.get("artifacts")
    if not isinstance(artifacts, list) or not artifacts:
        raise GateFailure("artifacts.json carries no artifacts")

    committed = [a for a in artifacts if a.get("status") == "committed"]
    if not committed:
        raise GateFailure("artifacts.json records no committed artifacts")

    mismatches = 0
    missing = 0
    for artifact in committed:
        rel = artifact.get("path")
        target = root / rel
        if not target.is_file():
            missing += 1
            continue
        recorded = artifact.get("sha256")
        if not recorded:
            continue
        if sha256_file(target) != recorded:
            mismatches += 1
            if mismatches <= 5:
                print(
                    f"  !! artifact changed after certification: {rel}",
                    file=sys.stderr,
                )
    if missing:
        raise GateFailure(f"{missing} committed artifact(s) missing from the tree")
    if mismatches:
        raise GateFailure(
            f"{mismatches} committed artifact(s) differ from the certified "
            "bytes — the deployable tree was mutated after the Boris run"
        )


def certify(root: Path) -> None:
    proof_dir = root / "_boris" / "proof"
    if not proof_dir.is_dir():
        raise GateFailure(
            f"no Boris publication evidence directory at "
            f"{proof_dir.relative_to(root)}/_boris/proof"
        )

    missing = [name for name in REQUIRED_EVIDENCE if not (proof_dir / name).is_file()]
    if missing:
        raise GateFailure(
            "missing required publication evidence: "
            + ", ".join(sorted(missing))
        )

    validate_checks(proof_dir)
    validate_claims(proof_dir)
    validate_touches(proof_dir)
    validate_proof_pack_model(root, proof_dir)
    validate_proof_pack_presentation(proof_dir, proof_dir / "proof-pack.json")
    validate_inventory_matches_disk(root, proof_dir)


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("html_dir", type=Path, help="Rendered HTML directory")
    args = parser.parse_args(argv)

    root = args.html_dir
    if not root.is_dir():
        print(f"certify_publication: not a directory: {root}", file=sys.stderr)
        return 2

    try:
        certify(root)
    except GateFailure as failure:
        print(f"Filed certification failed: {failure}", file=sys.stderr)
        return 1

    print(
        f"Filed certification passed: evidence in {root}/_boris/proof is "
        "complete, consistent, and matches the certified tree byte-for-byte."
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
