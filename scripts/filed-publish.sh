#!/usr/bin/env bash
set -Eeuo pipefail

# One predictable dogfood export for the public site and LLM workflows.
BORIS_BIN=${BORIS_BIN:-./bin/boris}
CONTENT_DIR=${CONTENT_DIR:-content}
PUBLISH_DIR=${PUBLISH_DIR:-publish}
THEME=${THEME:-themes/cantilever}
SITE_URL=${SITE_URL:-https://filed.fyi}
BORIS_JOBS=${BORIS_JOBS:-1}

if [[ ! -x "$BORIS_BIN" ]]; then
  echo "ERROR: Boris binary is not executable: $BORIS_BIN" >&2
  echo "Set BORIS_BIN=/path/to/boris to use a local Boris build." >&2
  exit 2
fi

mkdir -p "$PUBLISH_DIR"

echo "==> Exporting Filed publishing artifacts to $PUBLISH_DIR"
echo "    Boris: $BORIS_BIN"
echo "    Input: $CONTENT_DIR"
echo "    Theme: $THEME"

python3 scripts/filed_ids.py --root "$CONTENT_DIR" --map metadata/id-map.jsonl

"$BORIS_BIN" --input "$CONTENT_DIR" --theme "$THEME" --html-dir "$PUBLISH_DIR/site" --sitemap --site-url "$SITE_URL" --jobs "$BORIS_JOBS" --quiet
"$BORIS_BIN" --input "$CONTENT_DIR" --out "$PUBLISH_DIR/ir" --quiet
"$BORIS_BIN" --input "$CONTENT_DIR" --rag-dir "$PUBLISH_DIR/rag" --quiet
"$BORIS_BIN" --input "$CONTENT_DIR" --context-dir "$PUBLISH_DIR/context" --quiet

# Boris exports structural adjacency into `related` (and, in split builds,
# bundle-part container paths).  Rebuild the relationship fields from the
# source of record so semantic links survive bundling.
python3 scripts/repair_relationships.py \
  --content "$CONTENT_DIR" \
  --rag-dir "$PUBLISH_DIR/rag" \
  --context-dir "$PUBLISH_DIR/context"

# Guard the LLM-export path: source-to-export parity and shape checks.  The
# static-site deployment build proves nothing about this export path, so the
# publish pipeline itself must fail when a semantic edge was lost.
python3 scripts/validate_relationships.py \
  --content "$CONTENT_DIR" \
  --rag-dir "$PUBLISH_DIR/rag" \
  --context-dir "$PUBLISH_DIR/context" \
  --report reports/relationship-integrity.md

# Relationship ground truth is the committed recovery manifest
# (metadata/relationship-map.jsonl) — the pipeline never needs a scratch
# directory or git history.  Verify it is consistent with content/, and when
# history is available reproduce it byte-for-byte from the immutable
# pre-migration tree at commit 6abe4416.
python3 scripts/recover_relationships.py --check
python3 scripts/recover_relationships.py --verify

if "$BORIS_BIN" --input "$CONTENT_DIR" --llms-path "$PUBLISH_DIR/llms.txt" --quiet; then
  if python3 -c 'from pathlib import Path; import sys; Path(sys.argv[1]).read_text(encoding="utf-8")' "$PUBLISH_DIR/llms.txt"; then
    echo "✅ llms.txt exported and is valid UTF-8"
  else
    echo "❌ llms.txt was emitted but is not valid UTF-8; fix the Boris emitter before publishing this artifact." >&2
    exit 1
  fi
else
  echo "⚠️  llms.txt export is unavailable in this Boris build" >&2
fi

cat > "$PUBLISH_DIR/README.txt" <<'EOF'
Filed publishing artifacts

site/     Public HTML site (add a theme build here when publishing).
llms.txt  Public crawler/discovery index, when supported by Boris.
context/  Provenance-rich bundle for deliberate LLM context uploads.
rag/      Retrieval corpus for local or hosted RAG systems.
ir/       Machine-readable graph and reverse-index artifacts.

Review context/ and rag/ before uploading them. They are source-derived and
may include archived material or comments that should not become public canon.
EOF

echo "✅ Export complete"
echo "   Review $PUBLISH_DIR/README.txt before uploading context or RAG files."
