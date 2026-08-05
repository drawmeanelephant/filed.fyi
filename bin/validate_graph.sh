#!/usr/bin/env bash
set -Eeuo pipefail

export PATH="/usr/bin:/bin:$PATH"

ROOT=$(CDPATH= cd -- "$(dirname -- "${BASH_SOURCE[0]}")/.." && pwd)
cd "$ROOT"

BORIS_BIN=$("./scripts/ensure-boris.sh")
export BORIS_BIN
CONTENT_DIR=${CONTENT_DIR:-content}
DIST_DIR=${DIST_DIR:-dist/cantilever}

echo "==> Validating Filed form IDs"
python3 scripts/filed_ids.py --root "$CONTENT_DIR" --map metadata/id-map.jsonl

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

echo "🎉 Filed graph, form IDs, HTML IDs, and publication checks passed."
