#!/usr/bin/env bash
set -Eeuo pipefail

ROOT=$(CDPATH= cd -- "$(dirname -- "${BASH_SOURCE[0]}")/.." && pwd)
BORIS_BIN=${BORIS_BIN:-./bin/boris}
CONTENT_DIR=${CONTENT_DIR:-content}
THEME=${THEME:-themes/cantilever}
DIST_DIR=${DIST_DIR:-dist/cantilever}
SITE_URL=${SITE_URL:-https://filed.fyi}
BORIS_JOBS=${BORIS_JOBS:-1}

cd "$ROOT"

python3 scripts/filed_ids.py --root "$CONTENT_DIR" --map metadata/id-map.jsonl
python3 scripts/audit_markdown_links.py "$CONTENT_DIR"

if rg -n '^:::note\[' "$CONTENT_DIR" >/dev/null; then
  echo "Unsupported export-only :::note authoring syntax remains in content." >&2
  exit 1
fi

"$BORIS_BIN" \
  --input "$CONTENT_DIR" \
  --theme "$THEME" \
  --html-dir "$DIST_DIR" \
  --sitemap \
  --site-url "$SITE_URL" \
  --layout-rule default glob:aphorisms/* "$THEME/layouts/compact.html" \
  --layout-rule default glob:changelog/* "$THEME/layouts/compact.html" \
  --layout-rule default glob:guides/* "$THEME/layouts/compact.html" \
  --layout-rule default glob:haikus/* "$THEME/layouts/compact.html" \
  --layout-rule default glob:limericks/* "$THEME/layouts/compact.html" \
  --layout-rule default glob:lorelog/* "$THEME/layouts/compact.html" \
  --layout-rule default glob:mascots/* "$THEME/layouts/compact.html" \
  --layout-rule default glob:posts/* "$THEME/layouts/compact.html" \
  --layout-rule default glob:releases/* "$THEME/layouts/compact.html" \
  --layout-rule default glob:reference/* "$THEME/layouts/compact.html" \
  --jobs "$BORIS_JOBS"

python3 scripts/audit_html_ids.py "$DIST_DIR"

if [[ -f "$DIST_DIR/_boris/proof/checks.json" ]]; then
  bad_checks=$(jq -r '[.checks[] | select(.status != "passed" and .status != "not-applicable")] | length' "$DIST_DIR/_boris/proof/checks.json")
  if [[ "$bad_checks" -ne 0 ]]; then
    echo "Filed publication checks failed: $bad_checks check(s) are not green." >&2
    exit 1
  fi
fi

echo "Filed build passed: $DIST_DIR"
