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
THEME=${THEME:-themes/cantilever}
DIST_DIR=${DIST_DIR:-dist/cantilever}
STAGE_DIR=${STAGE_DIR:-dist/.stage-content}
SITE_URL=${SITE_URL:-https://filed.fyi}
BORIS_JOBS=${BORIS_JOBS:-1}

# The staged input tree must never live inside the compiler output tree:
# Boris would either reject the overlap or certify its own staging artifacts.
case "$STAGE_DIR" in
  "$DIST_DIR"|"$DIST_DIR"/*)
    echo "filed-build: STAGE_DIR ($STAGE_DIR) must not be inside DIST_DIR ($DIST_DIR)." >&2
    exit 2
    ;;
esac

python3 scripts/audit_markdown_links.py "$CONTENT_DIR"

if rg -n '^:::note\[' "$CONTENT_DIR" >/dev/null; then
  echo "Unsupported export-only :::note authoring syntax remains in content." >&2
  exit 1
fi

# Publication evidence certifies the exact bytes Boris renders. The verse
# residue presentation must therefore exist BEFORE Boris runs, never by
# rewriting certified HTML afterward. Stage the content tree, express the
# residue panel in the staged Markdown, and compile the staged tree.
rm -rf "$STAGE_DIR"
mkdir -p "$STAGE_DIR"
cp -R "$CONTENT_DIR"/. "$STAGE_DIR"/
python3 scripts/verse_stage.py "$STAGE_DIR"

"$BORIS_BIN" \
  --input "$STAGE_DIR" \
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

# The residue panel is expressed pre-render; verify the certified output
# satisfies the presentation invariants without touching it.
python3 scripts/verse_residue.py "$DIST_DIR"

python3 scripts/audit_html_ids.py "$DIST_DIR"

# Mandatory publication evidence gate: fails unless the complete Boris
# evidence chain is present, consistent, and matches the certified tree
# byte-for-byte.
python3 scripts/certify_publication.py "$DIST_DIR"

echo "Filed build passed: $DIST_DIR"
