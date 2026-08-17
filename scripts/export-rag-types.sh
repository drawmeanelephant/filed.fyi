#!/usr/bin/env bash
set -Eeuo pipefail

# export-rag-types.sh — per-type RAG working-context packs from boris PR #317.
#
# The default pinned boris (bin/boris) still emits the legacy per-page RAG
# corpus with machine frontmatter on every file. This script provisions the
# PR #317 binary — the only one that produces working-context packs — then
# runs a scoped RAG export per content type and flattens the result into:
#
#   publish/rag/<type>/<type>-NN.md     working-context packs (upload these)
#   publish/rag/<type>/<type>.manifest.json   provenance sidecar (not for upload)
#   publish/rag/INDEX.md                per-type index with token counts
#
# Env overrides:
#   BORIS_PR_BIN      path to a prebuilt PR #317 binary (skips provisioning)
#   BORIS_PR_COMMIT   PR head commit to pin/build (default: current PR #317 head)
#   BORIS_PR_REF      git ref to fetch (default: refs/pull/317/head)
#   BORIS_REPOSITORY  boris git URL
#   CONTENT_DIR       input content tree (default: <repo>/content)
#   OUT_DIR           output directory (default: <repo>/publish/rag)

ROOT=$(CDPATH= cd -- "$(dirname -- "${BASH_SOURCE[0]}")/.." && pwd)
CONTENT_DIR=${CONTENT_DIR:-"$ROOT/content"}
OUT_DIR=${OUT_DIR:-"$ROOT/publish/rag"}
BORIS_REPOSITORY=${BORIS_REPOSITORY:-https://github.com/drawmeanelephant/boris.git}
PR_REF=${BORIS_PR_REF:-refs/pull/317/head}
PR_COMMIT=${BORIS_PR_COMMIT:-fa28c46ab9fcaf32927e19f3e153416b44a906ab}
ZIG_VERSION=${ZIG_VERSION:-0.16.0}

TARGET_BIN="$ROOT/bin/boris-pr317"
MANIFEST="$ROOT/bin/boris-pr317.json"
BUILD_DIR="$ROOT/.tools/boris-pr317"

# Content types = collection directories under CONTENT_DIR (scoped export prefix).
TYPES=""
for d in "$CONTENT_DIR"/*/; do
  TYPES="$TYPES $(basename "$d")"
done
TYPES=${TYPES# }
if [[ -z "$TYPES" ]]; then
  echo "ERROR: no content collections found under $CONTENT_DIR" >&2
  exit 1
fi

# --- 1. Resolve the PR #317 boris binary -------------------------------

if [[ -n "${BORIS_PR_BIN:-}" && -x "${BORIS_PR_BIN}" ]]; then
  # Explicit prebuilt binary wins; no provisioning.
  BORIS_BIN=$(python3 -c 'import os,sys; print(os.path.abspath(sys.argv[1]))' "$BORIS_PR_BIN")
else
  # Reuse an existing build when the manifest matches the pinned PR commit.
  reuse=false
  if [[ -x "$TARGET_BIN" && -f "$MANIFEST" ]]; then
    if python3 - "$TARGET_BIN" "$MANIFEST" "$PR_COMMIT" <<'EOF'
import json, sys, hashlib
binary, manifest, commit = sys.argv[1:4]
try:
    data = json.load(open(manifest))
    if data.get("commit") != commit:
        sys.exit(1)
    if hashlib.sha256(open(binary, "rb").read()).hexdigest() != data.get("checksum"):
        sys.exit(1)
except Exception:
    sys.exit(1)
EOF
    then
      reuse=true
    fi
  fi

  if $reuse; then
    BORIS_BIN="$TARGET_BIN"
  else
    # Resolve a zig $ZIG_VERSION compiler: PATH first, then the one
    # ensure-boris.sh provisions into .tools/zig.
    ZIG_CMD=""
    if command -v zig >/dev/null 2>&1 && [[ "$(zig version)" == "$ZIG_VERSION" ]]; then
      ZIG_CMD="zig"
    elif [[ -x "$ROOT/.tools/zig/zig" ]] && [[ "$("$ROOT/.tools/zig/zig" version)" == "$ZIG_VERSION" ]]; then
      ZIG_CMD="$ROOT/.tools/zig/zig"
    else
      echo "ERROR: zig $ZIG_VERSION not found. Run ./scripts/ensure-boris.sh --provision to install it." >&2
      exit 1
    fi

    echo "==> Building boris PR #317 ($PR_COMMIT)..." >&2
    mkdir -p "$BUILD_DIR" "$ROOT/bin"
    if [[ ! -d "$BUILD_DIR/.git" ]]; then
      git clone --quiet "$BORIS_REPOSITORY" "$BUILD_DIR"
    fi
    git -C "$BUILD_DIR" fetch --quiet origin "$PR_REF"
    if ! git -C "$BUILD_DIR" checkout --quiet "$PR_COMMIT" 2>/dev/null; then
      echo "ERROR: PR commit $PR_COMMIT not present after fetching $PR_REF (force-pushed?)." >&2
      echo "       Set BORIS_PR_COMMIT to the current head and re-run." >&2
      exit 1
    fi
    rm -rf "$BUILD_DIR/zig-out"
    if ! (cd "$BUILD_DIR" && "$ZIG_CMD" build >&2); then
      echo "ERROR: boris PR #317 build failed." >&2
      exit 1
    fi
    cp "$BUILD_DIR/zig-out/bin/boris" "$TARGET_BIN"
    chmod +x "$TARGET_BIN"
    python3 - "$TARGET_BIN" "$PR_COMMIT" "$ZIG_VERSION" "$MANIFEST" "$BORIS_REPOSITORY" <<'EOF'
import json, sys, hashlib, datetime
binary, commit, zig, manifest, repo = sys.argv[1:6]
data = {
    "binary": binary,
    "source": "pr-317",
    "repository": repo,
    "ref": "refs/pull/317/head",
    "commit": commit,
    "zig_version": zig,
    "checksum": hashlib.sha256(open(binary, "rb").read()).hexdigest(),
    "built_at": datetime.datetime.now(datetime.timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ"),
}
with open(manifest, "w") as f:
    json.dump(data, f, indent=2)
EOF
    BORIS_BIN="$TARGET_BIN"
  fi
fi

echo "==> Boris (PR #317): $BORIS_BIN"

# --- 2. Scoped RAG exports, flattened per type --------------------------

if [[ -z "$OUT_DIR" || "$OUT_DIR" == "/" || "$OUT_DIR" == "$ROOT" ]]; then
  echo "ERROR: refusing to wipe $OUT_DIR" >&2
  exit 1
fi
rm -rf "$OUT_DIR"
mkdir -p "$OUT_DIR"

for t in $TYPES; do
  tmp="$OUT_DIR/.tmp-$t"
  rm -rf "$tmp"
  "$BORIS_BIN" --input "$CONTENT_DIR" --rag --scope "$t" --rag-dir "$tmp" --quiet
  mkdir -p "$OUT_DIR/$t"
  i=0
  for f in "$tmp"/working-*.md; do
    i=$((i+1))
    cp "$f" "$OUT_DIR/$t/$(printf '%s-%02d.md' "$t" "$i")"
  done
  cp "$tmp/manifest.json" "$OUT_DIR/$t/$t.manifest.json"
  # Rewrite manifest pack paths to the renamed filenames so the sidecar stays
  # consistent with the flat per-type layout.
  TYPE="$t" DIR="$OUT_DIR/$t" python3 - <<'EOF'
import json, os
t, d = os.environ['TYPE'], os.environ['DIR']
path = f"{d}/{t}.manifest.json"
with open(path) as f:
    m = json.load(f)
ren = {}
for idx, uf in enumerate(m.get('upload_files', []), start=1):
    ren[uf['path']] = f"{t}-{idx:02d}.md"
    uf['path'] = ren[uf['path']]
for doc in m.get('documents', []):
    if doc.get('pack') in ren:
        doc['pack'] = ren[doc['pack']]
with open(path, 'w') as f:
    json.dump(m, f, indent=2)
EOF
  rm -rf "$tmp"
done

# --- 3. Top-level INDEX -------------------------------------------------

OUT="$OUT_DIR" CONTENT_DIR="$CONTENT_DIR" python3 - <<'EOF'
import json, glob, os
out, content = os.environ['OUT'], os.environ['CONTENT_DIR']
rows = []
for mf in sorted(glob.glob(f'{out}/*/*.manifest.json')):
    t = os.path.basename(os.path.dirname(mf))
    m = json.load(open(mf))
    rows.append((t, len(m.get('upload_files', [])), m.get('selected_page_count', 0),
                 m.get('structural_parent_count', 0), m.get('semantic_neighbor_count', 0),
                 m.get('approximate_tokens', 0)))
lines = [
    '# Per-type RAG packs (boris PR #317 working-context)',
    '',
    f'Content: {os.path.abspath(content)}',
    'Each `<type>/` folder holds `<type>-NN.md` working-context packs plus a',
    '`<type>.manifest.json` provenance sidecar (not for upload). Packs may',
    'include a few parent pages and semantic neighbors of the type (counts below).',
    '',
    '| type      | packs | selected | parents | neighbors | tokens   |',
    '|-----------|------:|---------:|--------:|----------:|---------:|',
]
for t, pk, s, p, n, tok in rows:
    lines.append(f'| {t:<10} | {pk:>5} | {s:>8} | {p:>7} | {n:>9} | {tok:>8,} |')
with open(f'{out}/INDEX.md', 'w') as f:
    f.write('\n'.join(lines) + '\n')
EOF

echo "==> Per-type RAG packs written to $OUT_DIR"
echo "    Types: $(echo "$TYPES" | tr ' ' '\n' | sed 's/^/    - /')"
