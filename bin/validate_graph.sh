#!/bin/bash
set -Eeuo pipefail

export PATH="${PATH:+$PATH:}/usr/bin:/bin"

ROOT=$(CDPATH= cd -- "$(dirname -- "${BASH_SOURCE[0]}")/.." && pwd)
cd "$ROOT"

if [[ -z "${BORIS_BIN:-}" || ! -x "${BORIS_BIN}" ]]; then
  BORIS_BIN=$("./scripts/ensure-boris.sh")
  export BORIS_BIN
fi

CONTENT_DIR=${CONTENT_DIR:-content}
DIST_DIR=${DIST_DIR:-dist/cantilever}

echo "==> Running Boris graph diagnostics"
CHECK_REPORT=$(mktemp "${TMPDIR:-/tmp}/filed-boris-check.XXXXXX")
trap 'rm -f "$CHECK_REPORT"' EXIT

if "$BORIS_BIN" check --input "$CONTENT_DIR" --format json 2>"$CHECK_REPORT"; then
  echo "✅ Boris graph diagnostics passed"
else
  unexpected=$(jq -r '[.findings[]? | select(.code != "unreferenced_page")] | length' "$CHECK_REPORT")
  if [[ "$unexpected" -ne 0 ]]; then
    echo "❌ Boris graph diagnostics found $unexpected unexpected finding(s)" >&2
    cat "$CHECK_REPORT" >&2
    exit 1
  fi
  echo "⚠️ Boris reported only the documented unreferenced-page baseline; parent edges remain valid."
fi

echo "==> Compiling the primary Cantilever publication"
BORIS_BIN="$BORIS_BIN" CONTENT_DIR="$CONTENT_DIR" DIST_DIR="$DIST_DIR" ./scripts/filed-build.sh

echo "🎉 Filed graph, HTML IDs, and publication checks passed."
