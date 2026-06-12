#!/usr/bin/env bash
# ===============================================================
#   ███████╗██╗██╗     ███████╗██████╗     ██████╗
#   ██╔════╝██║██║     ██╔════╝██╔══██╗   ██╔══██╗
#   █████╗  ██║██║     █████╗  ██║  ██║   ██║  ██║
#   ██╔══╝  ██║██║     ██╔══╝  ██║  ██║   ██║  ██║
#   ██║     ██║███████╗███████╗██████╔╝██╗██████╔╝
#   ╚═╝     ╚═╝╚══════╝╚══════╝╚═════╝ ╚═╝╚═════╝
#
#   ███████╗ ██████╗ ██████╗  ██████╗  ██████╗ ████████╗
#   ██╔════╝██╔═══██╗██╔══██╗██╔════╝ ██╔═══██╗╚══██╔══╝
#   █████╗  ██║   ██║██████╔╝██║  ███╗██║   ██║   ██║
#   ██╔══╝  ██║   ██║██╔══██╗██║   ██║██║   ██║   ██║
#   ██║     ╚██████╔╝██║  ██║╚██████╔╝╚██████╔╝   ██║
#   ╚═╝      ╚═════╝ ╚═╝  ╚═╝ ╚═════╝  ╚═════╝    ╚═╝
#
#   everything gets exported, nothing is alive
# ===============================================================
# Script  : astro-book.sh
# Purpose : Three-stage archival pipeline for Astro projects.
#           Stage 1 → INDEX (manifest, no content)
#           Stage 2 → CLUSTER (targeted bundle by ID)
#           Stage 3 → FULL EXPORT (archival dumps only)
# Output  : exports/index.json
#           exports/clusters/<ID>.md
#           exports/content.md
#           exports/components.md
#           exports/layouts.md
#           exports/styles.md
#           exports/routes.md
#           exports/config.md
#           exports/system.md
#           exports/manifest.md
#           exports/mascots.md
#           exports/lorelog.md
#           exports/limericks.md
# Usage   : ./astro-book.sh [project-path]
#           ./astro-book.sh --mode=index [project-path]
#           ./astro-book.sh --mode=cluster --target=<ID> [project-path]
#           ./astro-book.sh --mode=export [project-path]
# Env     : ASTRO_BOOK_MAX_BYTES=102400
#           ASTRO_BOOK_PREVIEW_LINES=160
# Version : 3.0.0
# ===============================================================

set -euo pipefail
IFS=$'\n\t'

# ── colours ────────────────────────────────────────────────────
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
MAGENTA='\033[0;35m'
BLUE='\033[0;34m'
BOLD='\033[1m'
DIM='\033[2m'
RESET='\033[0m'

# ── logging ────────────────────────────────────────────────────
log_info()  { echo -e "${CYAN}[astro-book]${RESET} $*"; }
log_ok()    { echo -e "${GREEN}[astro-book]${RESET} $*"; }
log_warn()  { echo -e "${YELLOW}[astro-book]${RESET} $*"; }
log_err()   { echo -e "${RED}[astro-book]${RESET} $*" >&2; }
log_stage() { echo -e "\n${MAGENTA}${BOLD}▶ STAGE $*${RESET}\n"; }
log_skip()  { echo -e "${DIM}[astro-book] skipped: $*${RESET}"; }

# ── banner ─────────────────────────────────────────────────────
banner() {
  echo ""
  echo -e "${MAGENTA}${BOLD}╔══════════════════════════════════════════════════════════════╗${RESET}"
  echo -e "${MAGENTA}${BOLD}║                 FILED & FORGOTTEN :: EXPORT                 ║${RESET}"
  echo -e "${MAGENTA}${BOLD}║         "everything gets exported, nothing is alive"        ║${RESET}"
  echo -e "${MAGENTA}${BOLD}║              three stages. hard walls. no ghosts.           ║${RESET}"
  echo -e "${MAGENTA}${BOLD}╚══════════════════════════════════════════════════════════════╝${RESET}"
  echo ""
}

# ── usage ──────────────────────────────────────────────────────
usage() {
  cat <<'EOF'

astro-book.sh — Filed & Forgotten Archival Pipeline

Usage:
  ./astro-book.sh [project-path]                          # full export (default)
  ./astro-book.sh --mode=index [project-path]             # index stage only
  ./astro-book.sh --mode=cluster --target=<ID> [path]     # cluster by ID
  ./astro-book.sh --mode=export [project-path]            # archival dumps only
  ./astro-book.sh --mode=mega [project-path]              # single-file LLM context
  ./astro-book.sh --help

Modes:
  index    Builds exports/index.json — lightweight manifest, NO file content.
           This is the ONLY entry point for any analysis or cross-referencing.

  cluster  Reads exports/index.json, bundles a single lorelog entry + its
           linked mascots, limericks, and directly referenced files into
           exports/clusters/<ID>.md

  export   Runs the full archival dump (mascots.md, lorelog.md, limericks.md,
           etc.) — for archival use only, NOT for analysis workflows.

  mega     Bundles EVERY tracked file into a single exports/mega-bundle.md
           using XML-style tags, optimized for Gemini Pro and Claude contexts.

Environment:
  ASTRO_BOOK_MAX_BYTES      Max file size to fully include (default: 102400)
  ASTRO_BOOK_PREVIEW_LINES  Preview lines for oversized files (default: 160)

Output:
  exports/
    index.json
    clusters/
      <ID>.md
    content.md
    components.md
    layouts.md
    styles.md
    routes.md
    config.md
    system.md
    manifest.md
    mascots.md
    lorelog.md
    limericks.md

EOF
}

# ── arg parsing ────────────────────────────────────────────────
MODE="export"
CLUSTER_TARGET=""
POSITIONAL_ARGS=()

for arg in "$@"; do
  case "$arg" in
    --help)           usage; exit 0 ;;
    --mode=index)     MODE="index" ;;
    --mode=cluster)   MODE="cluster" ;;
    --mode=export)    MODE="export" ;;
    --mode=mega)      MODE="mega" ;;
    --target=*)       CLUSTER_TARGET="${arg#--target=}" ;;
    -*)               log_err "Unknown flag: $arg"; usage; exit 1 ;;
    *)                POSITIONAL_ARGS+=("$arg") ;;
  esac
done

# default mode: if no --mode flag was passed, run all three stages
[[ "$MODE" == "export" && ${#POSITIONAL_ARGS[@]} -eq 0 ]] && MODE="all"
[[ "$MODE" == "export" && ${#POSITIONAL_ARGS[@]} -gt 0 ]] && MODE="export"

# re-evaluate: if the user just ran `./astro-book.sh /path` with no --mode, run all
if [[ ${#POSITIONAL_ARGS[@]} -gt 0 && "$MODE" == "all" ]]; then
  MODE="all"
fi

# ── paths ──────────────────────────────────────────────────────
MAX_BYTES="${ASTRO_BOOK_MAX_BYTES:-102400}"
PREVIEW_LINES="${ASTRO_BOOK_PREVIEW_LINES:-160}"

PROJECT_DIR="${POSITIONAL_ARGS[0]:-$PWD}"
PROJECT_DIR="$(cd "$PROJECT_DIR" && pwd)"

TIMESTAMP="$(date -u +"%Y-%m-%dT%H:%M:%SZ")"
PROJECT_NAME="$(basename "$PROJECT_DIR")"
EXPORT_DIR="$PROJECT_DIR/exports"
CLUSTER_DIR="$EXPORT_DIR/clusters"

INCLUDED_COUNT=0
TRUNCATED_COUNT=0
SKIPPED_COUNT=0

# ── utils ──────────────────────────────────────────────────────
file_bytes() {
  stat -f%z "$1" 2>/dev/null || stat -c%s "$1" 2>/dev/null || echo 0
}

has_cmd() {
  command -v "$1" >/dev/null 2>&1
}

fence_lang() {
  local f="$1"
  case "${f##*.}" in
    ts|tsx)           echo "typescript" ;;
    js|jsx|mjs|cjs)  echo "javascript" ;;
    astro)            echo "astro" ;;
    md|mdx)           echo "markdown" ;;
    html|htm)         echo "html" ;;
    json)             echo "json" ;;
    css)              echo "css" ;;
    scss)             echo "scss" ;;
    sass)             echo "sass" ;;
    less)             echo "less" ;;
    yaml|yml)         echo "yaml" ;;
    toml)             echo "toml" ;;
    sh)               echo "bash" ;;
    svg)              echo "xml" ;;
    env)              echo "dotenv" ;;
    *)                echo "" ;;
  esac
}

# Derive a slug from a filepath: last path component minus extension
derive_slug() {
  local f="$1"
  basename "$f" | sed 's/\.[^.]*$//'
}

# Classify a file path into a type string
classify_type() {
  local p="$1"
  case "$p" in
    */content/docs/mascots/*)  echo "mascot" ;;
    */content/docs/lorelog/*)  echo "lorelog" ;;
    */content/docs/limericks/*) echo "limerick" ;;
    */content/docs/haikus/*) echo "haiku" ;;
    */content/docs/posts/*) echo "post" ;;
    */content/docs/changelog/*) echo "changelog" ;;
    */content/docs/releases/*) echo "release" ;;
    */src/content/*)           echo "content" ;;
    */src/layouts/*)           echo "layout" ;;
    */src/components/*)        echo "component" ;;
    */src/styles/*)            echo "style" ;;
    */src/pages/*)             echo "route" ;;
    */src/lib/*)               echo "lib" ;;
    *.config.*|tsconfig*|package.json) echo "config" ;;
    .env*|rules.md)            echo "system" ;;
    *)                         echo "other" ;;
  esac
}

# Extract shallow tags from a markdown file's frontmatter (tags: [...] only)
extract_tags() {
  local f="$1"
  [[ "${f##*.}" != "md" && "${f##*.}" != "mdx" ]] && echo "[]" && return
  python3 - "$f" <<'PY' 2>/dev/null || echo "[]"
import sys, re, json
path = sys.argv[1]
try:
    content = open(path).read()
    m = re.search(r'^---\s*\n(.*?)\n---', content, re.DOTALL)
    if not m:
        print("[]"); sys.exit()
    fm = m.group(1)
    # only shallow: grab tags line
    tm = re.search(r'^tags\s*:\s*\[([^\]]*)\]', fm, re.MULTILINE)
    if not tm:
        print("[]"); sys.exit()
    raw = [x.strip().strip('"\'') for x in tm.group(1).split(',') if x.strip()]
    print(json.dumps(raw))
except Exception:
    print("[]")
PY
}

# Extract direct link references (no inference) from markdown frontmatter only
extract_relationships() {
  local f="$1"
  [[ "${f##*.}" != "md" && "${f##*.}" != "mdx" ]] && echo "[]" && return
  python3 - "$f" <<'PY' 2>/dev/null || echo "[]"
import sys, re, json
path = sys.argv[1]
try:
    content = open(path).read()
    m = re.search(r'^---\s*\n(.*?)\n---', content, re.DOTALL)
    if not m:
        print("[]"); sys.exit()
    fm = m.group(1)
    rels = []
    for field in ("mascot", "mascots", "limerick", "limericks", "related", "linked"):
        pat = re.search(rf'^{field}\s*:\s*\[([^\]]*)\]', fm, re.MULTILINE)
        if pat:
            vals = [x.strip().strip('"\'') for x in pat.group(1).split(',') if x.strip()]
            rels.extend(vals)
        # scalar form
        spat = re.search(rf'^{field}\s*:\s*(.+)$', fm, re.MULTILINE)
        if spat and not pat:
            val = spat.group(1).strip().strip('"\'')
            if val and not val.startswith('['):
                rels.append(val)
    print(json.dumps(list(set(rels))))
except Exception:
    print("[]")
PY
}

# ── file emit ──────────────────────────────────────────────────
emit_file_block() {
  local filepath="$1"
  local relpath="$2"
  local bytes="$3"
  local lang
  lang="$(fence_lang "$filepath")"

  if (( bytes <= MAX_BYTES )); then
    INCLUDED_COUNT=$((INCLUDED_COUNT + 1))
    echo "path: $relpath"
    echo "bytes: $bytes"
    echo "status: INCLUDED"
    echo '```'"$lang"
    cat "$filepath"
    echo '```'
    return 0
  fi

  TRUNCATED_COUNT=$((TRUNCATED_COUNT + 1))
  echo "path: $relpath"
  echo "bytes: $bytes"
  echo "status: TRUNCATED"
  echo "reason: file exceeds ASTRO_BOOK_MAX_BYTES=$MAX_BYTES"
  echo "preview_lines: $PREVIEW_LINES"
  echo '```'"$lang"
  head -n "$PREVIEW_LINES" "$filepath"
  echo '```'
  echo ""
  echo "> ARCHIVE NOTE: this file was too large for full preservation in the default export."
  echo "> Raise ASTRO_BOOK_MAX_BYTES if you want the whole haunted slab."
}

# ── collect ────────────────────────────────────────────────────
collect_files() {
  find "$PROJECT_DIR" \
    -path "$PROJECT_DIR/node_modules" -prune -o \
    -path "$PROJECT_DIR/public" -prune -o \
    -path "$PROJECT_DIR/dist" -prune -o \
    -path "$PROJECT_DIR/.git" -prune -o \
    -path "$PROJECT_DIR/.astro" -prune -o \
    -path "$PROJECT_DIR/.cache" -prune -o \
    -path "$PROJECT_DIR/.turbo" -prune -o \
    -path "$PROJECT_DIR/.vercel" -prune -o \
    -path "$PROJECT_DIR/.netlify" -prune -o \
    -path "$PROJECT_DIR/.output" -prune -o \
    -path "$PROJECT_DIR/coverage" -prune -o \
    -path "$PROJECT_DIR/exports" -prune -o \
    -type f \( \
      -name "*.ts" -o -name "*.tsx" -o \
      -name "*.js" -o -name "*.jsx" -o -name "*.mjs" -o -name "*.cjs" -o \
      -name "*.astro" -o \
      -name "*.md" -o -name "*.mdx" -o \
      -name "*.html" -o -name "*.htm" -o \
      -name "*.json" -o \
      -name "*.css" -o -name "*.scss" -o -name "*.sass" -o -name "*.less" -o \
      -name "*.yaml" -o -name "*.yml" -o -name "*.toml" -o \
      -name "*.sh" -o \
      -name ".env" -o -name ".env.example" -o -name ".env.local" \
    \) -print | sort
}

ensure_exports_dir() {
  mkdir -p "$EXPORT_DIR"
  mkdir -p "$CLUSTER_DIR"
}

# ══════════════════════════════════════════════════════════════
# STAGE 1 — INDEX
# Builds exports/index.json.
# NO file content. NO markdown. NO inference loops.
# This is the ONLY entry point for analysis.
# ══════════════════════════════════════════════════════════════
build_index() {
  log_stage "1 — INDEX  →  exports/index.json"
  log_info "Cataloguing the haunted filing cabinet..."

  local index_file="$EXPORT_DIR/index.json"
  local tmp_entries=()

  while IFS= read -r f; do
    [[ -z "$f" ]] && continue
    local relpath="${f#$PROJECT_DIR/}"
    local bytes
    bytes="$(file_bytes "$f")"
    local ftype
    ftype="$(classify_type "$relpath")"
    local slug
    slug="$(derive_slug "$f")"
    local tags
    tags="$(extract_tags "$f")"
    local rels
    rels="$(extract_relationships "$f")"

    # emit a json object per file; we'll wrap in array below
    printf '  {\n'
    printf '    "path": "%s",\n' "$relpath"
    printf '    "type": "%s",\n' "$ftype"
    printf '    "slug": "%s",\n' "$slug"
    printf '    "bytes": %s,\n' "$bytes"
    printf '    "tags": %s,\n' "$tags"
    printf '    "relationships": %s\n' "$rels"
    printf '  }'
  done < <(collect_files) \
  | paste -sd ',' - \
  | awk 'BEGIN{print "["} {print} END{print "]"}' \
  > "$index_file"

  # validate it parsed
  if has_cmd jq; then
    local count
    count="$(jq 'length' "$index_file" 2>/dev/null || echo "?")"
    log_ok "Index built. ${CYAN}${count}${RESET} entries → ${BOLD}exports/index.json${RESET}"
  else
    log_ok "Index built → ${BOLD}exports/index.json${RESET}"
  fi
}

# ══════════════════════════════════════════════════════════════
# STAGE 2 — CLUSTER
# Reads index.json. Bundles ONE lorelog entry + its linked
# artifacts into exports/clusters/<ID>.md
# Does NOT traverse the filesystem directly.
# Does NOT perform cross-file reasoning.
# ══════════════════════════════════════════════════════════════
build_cluster() {
  local target="$1"
  log_stage "2 — CLUSTER  →  exports/clusters/${target}.md"

  local index_file="$EXPORT_DIR/index.json"

  if [[ ! -f "$index_file" ]]; then
    log_err "No index.json found. Run --mode=index first."
    log_err "Cluster stage aborted. Nothing escalated. Nothing suggested."
    return 1
  fi

  if ! has_cmd jq; then
    log_err "jq is required for cluster mode. brew install jq"
    return 1
  fi

  # find lorelog entry matching target slug — from index only
  local lorelog_path
  lorelog_path="$(jq -r \
    --arg t "$target" \
    '.[] | select(.type == "lorelog" and .slug == $t) | .path' \
    "$index_file")"

  if [[ -z "$lorelog_path" ]]; then
    log_warn "No lorelog entry found for slug '${target}' in index. Logged. Not escalated."
    return 0
  fi

  # get direct relationships from index — no inference
  local linked_ids
  linked_ids="$(jq -r \
    --arg t "$target" \
    '.[] | select(.type == "lorelog" and .slug == $t) | .relationships[]' \
    "$index_file" 2>/dev/null || true)"

  local output_file="$CLUSTER_DIR/${target}.md"

  {
    echo "# Cluster: $target"
    echo ""
    echo "Generated: $TIMESTAMP"
    echo "Project: $PROJECT_NAME"
    echo "Source: $lorelog_path"
    echo ""
    echo "---"
    echo ""

    # primary lorelog entry
    echo "## Lorelog Entry"
    echo ""
    local full_path="$PROJECT_DIR/$lorelog_path"
    if [[ -f "$full_path" ]]; then
      local bytes
      bytes="$(file_bytes "$full_path")"
      echo "<!-- START LORELOG $target -->"
      emit_file_block "$full_path" "$lorelog_path" "$bytes"
      echo "<!-- STOP LORELOG $target -->"
    else
      log_warn "Lorelog file not found on disk: $lorelog_path — logged, skipping."
    fi
    echo ""

    # linked artifacts — resolved from index, not from filesystem scan
    if [[ -n "$linked_ids" ]]; then
      echo "## Linked Artifacts"
      echo ""
      while IFS= read -r linked_slug; do
        [[ -z "$linked_slug" ]] && continue

        # resolve linked_slug to path via index — mascots and limericks only
        local linked_path
        linked_path="$(jq -r \
          --arg s "$linked_slug" \
          '.[] | select((.type == "mascot" or .type == "limerick") and .slug == $s) | .path' \
          "$index_file" | head -1)"

        if [[ -z "$linked_path" ]]; then
          log_skip "linked slug '$linked_slug' not found in index"
          echo "<!-- LINKED $linked_slug: not found in index, skipped -->"
          continue
        fi

        local linked_type
        linked_type="$(jq -r \
          --arg s "$linked_slug" \
          '.[] | select((.type == "mascot" or .type == "limerick") and .slug == $s) | .type' \
          "$index_file" | head -1)"

        local lf="$PROJECT_DIR/$linked_path"
        if [[ -f "$lf" ]]; then
          local lbytes
          lbytes="$(file_bytes "$lf")"
          echo "### $linked_type: $linked_slug"
          echo ""
          echo "<!-- START LINKED $linked_type $linked_slug -->"
          emit_file_block "$lf" "$linked_path" "$lbytes"
          echo "<!-- STOP LINKED $linked_type $linked_slug -->"
          echo ""
        else
          log_skip "$linked_path on disk — logged"
          echo "<!-- LINKED $linked_slug: on-disk file missing, skipped -->"
        fi
      done <<< "$linked_ids"
    fi

    echo "---"
    echo ""
    echo "_Cluster scope: lorelog entry + direct links only. No traversal. No inference._"
    echo ""
  } > "$output_file"

  log_ok "Cluster sealed → ${BOLD}exports/clusters/${target}.md${RESET}"
}

# ══════════════════════════════════════════════════════════════
# STAGE 3 — FULL EXPORT
# Archival dumps. These are for storage, not analysis.
# No cross-file reasoning inside these functions.
# INPUT → PROCESS → OUTPUT → STOP.
# ══════════════════════════════════════════════════════════════

write_section_from_dir() {
  local title="$1"
  local base_dir="$2"
  local marker="$3"
  local output_file="$4"

  {
    echo "# $title"
    echo ""
    if [[ ! -d "$base_dir" ]]; then
      echo "_No files found._"
      echo ""
      return
    fi

    while IFS= read -r f; do
      [[ -z "$f" ]] && continue
      local relpath="${f#$PROJECT_DIR/}"
      local bytes
      bytes="$(file_bytes "$f")"

      echo "<!-- START $marker -->"
      emit_file_block "$f" "$relpath" "$bytes"
      echo ""
      echo "<!-- STOP $marker -->"
      echo ""
    done < <(find "$base_dir" -type f | sort)
  } > "$output_file"
}

write_content() {
  local output_file="$EXPORT_DIR/content.md"
  {
    echo "# Content"
    echo ""
    echo "Generated: $TIMESTAMP"
    echo "Project: $PROJECT_NAME"
    echo ""

    while IFS= read -r f; do
      [[ -z "$f" ]] && continue
      local relpath="${f#$PROJECT_DIR/}"
      [[ "$relpath" != src/content/* ]] && continue

      local bytes
      bytes="$(file_bytes "$f")"

      echo "<!-- START CONTENT FILE -->"
      emit_file_block "$f" "$relpath" "$bytes"
      echo ""
      echo "<!-- STOP CONTENT FILE -->"
      echo ""
    done < <(collect_files)
  } > "$output_file"
}

write_mascots() {
  local output_file="$EXPORT_DIR/mascots.md"
  {
    echo "# Mascots"
    echo ""
    echo "Generated: $TIMESTAMP"
    echo "Project: $PROJECT_NAME"
    echo ""

    if [[ ! -d "$PROJECT_DIR/src/content/docs/mascots" ]]; then
      echo "_No mascot files found._"
      echo ""
      return
    fi

    while IFS= read -r f; do
      [[ -z "$f" ]] && continue
      local relpath="${f#$PROJECT_DIR/}"
      local bytes
      bytes="$(file_bytes "$f")"

      echo "<!-- START MASCOT FILE -->"
      emit_file_block "$f" "$relpath" "$bytes"
      echo ""
      echo "<!-- STOP MASCOT FILE -->"
      echo ""
    done < <(find "$PROJECT_DIR/src/content/docs/mascots" -type f \( -name "*.md" -o -name "*.mdx" \) | sort)
  } > "$output_file"
}

write_lorelog() {
  local output_file="$EXPORT_DIR/lorelog.md"
  {
    echo "# Lorelog"
    echo ""
    echo "Generated: $TIMESTAMP"
    echo "Project: $PROJECT_NAME"
    echo ""

    if [[ ! -d "$PROJECT_DIR/src/content/docs/lorelog" ]]; then
      echo "_No lorelog files found._"
      echo ""
      return
    fi

    while IFS= read -r f; do
      [[ -z "$f" ]] && continue
      local relpath="${f#$PROJECT_DIR/}"
      local bytes
      bytes="$(file_bytes "$f")"

      echo "<!-- START LORELOG FILE -->"
      emit_file_block "$f" "$relpath" "$bytes"
      echo ""
      echo "<!-- STOP LORELOG FILE -->"
      echo ""
    done < <(find "$PROJECT_DIR/src/content/docs/lorelog" -type f \( -name "*.md" -o -name "*.mdx" \) | sort)
  } > "$output_file"
}

write_limericks() {
  local output_file="$EXPORT_DIR/limericks.md"
  {
    echo "# Limericks"
    echo ""
    echo "Generated: $TIMESTAMP"
    echo "Project: $PROJECT_NAME"
    echo ""

    if [[ ! -d "$PROJECT_DIR/src/content/docs/limericks" ]]; then
      echo "_No limerick files found._"
      echo ""
      return
    fi

    while IFS= read -r f; do
      [[ -z "$f" ]] && continue
      local relpath="${f#$PROJECT_DIR/}"
      local bytes
      bytes="$(file_bytes "$f")"

      echo "<!-- START LIMERICK FILE -->"
      emit_file_block "$f" "$relpath" "$bytes"
      echo ""
      echo "<!-- STOP LIMERICK FILE -->"
      echo ""
    done < <(find "$PROJECT_DIR/src/content/docs/limericks" -type f \( -name "*.md" -o -name "*.mdx" \) | sort)
  } > "$output_file"
}

write_haikus() {
  local output_file="$EXPORT_DIR/haikus.md"
  {
    echo "# Haikus"
    echo ""
    echo "Generated: $TIMESTAMP"
    echo "Project: $PROJECT_NAME"
    echo ""

    if [[ ! -d "$PROJECT_DIR/src/content/docs/haikus" ]]; then
      echo "_No haiku files found._"
      echo ""
      return
    fi

    while IFS= read -r f; do
      [[ -z "$f" ]] && continue
      local relpath="${f#$PROJECT_DIR/}"
      local bytes
      bytes="$(file_bytes "$f")"

      echo "<!-- START HAIKU FILE -->"
      emit_file_block "$f" "$relpath" "$bytes"
      echo ""
      echo "<!-- STOP HAIKU FILE -->"
      echo ""
    done < <(find "$PROJECT_DIR/src/content/docs/haikus" -type f \( -name "*.md" -o -name "*.mdx" \) | sort)
  } > "$output_file"
}

write_aphorisms() {
  local output_file="$EXPORT_DIR/aphorisms.md"
  {
    echo "# Aphorisms"
    echo ""
    echo "Generated: $TIMESTAMP"
    echo "Project: $PROJECT_NAME"
    echo ""

    if [[ ! -d "$PROJECT_DIR/src/content/docs/aphorisms" ]]; then
      echo "_No aphorism files found._"
      echo ""
      return
    fi

    while IFS= read -r f; do
      [[ -z "$f" ]] && continue
      local relpath="${f#$PROJECT_DIR/}"
      local bytes
      bytes="$(file_bytes "$f")"

      echo "<!-- START APHORISM FILE -->"
      emit_file_block "$f" "$relpath" "$bytes"
      echo ""
      echo "<!-- STOP APHORISM FILE -->"
      echo ""
    done < <(find "$PROJECT_DIR/src/content/docs/aphorisms" -type f \( -name "*.md" -o -name "*.mdx" \) | sort)
  } > "$output_file"
}

write_posts() {
  local output_file="$EXPORT_DIR/posts.md"
  {
    echo "# Posts"
    echo ""
    echo "Generated: $TIMESTAMP"
    echo "Project: $PROJECT_NAME"
    echo ""

    if [[ ! -d "$PROJECT_DIR/src/content/docs/posts" ]]; then
      echo "_No post files found._"
      echo ""
      return
    fi

    while IFS= read -r f; do
      [[ -z "$f" ]] && continue
      local relpath="${f#$PROJECT_DIR/}"
      local bytes
      bytes="$(file_bytes "$f")"

      echo "<!-- START POST FILE -->"
      emit_file_block "$f" "$relpath" "$bytes"
      echo ""
      echo "<!-- STOP POST FILE -->"
      echo ""
    done < <(find "$PROJECT_DIR/src/content/docs/posts" -type f \( -name "*.md" -o -name "*.mdx" \) | sort)
  } > "$output_file"
}

write_changelog() {
  local output_file="$EXPORT_DIR/changelog.md"
  {
    echo "# Changelog"
    echo ""
    echo "Generated: $TIMESTAMP"
    echo "Project: $PROJECT_NAME"
    echo ""

    if [[ ! -d "$PROJECT_DIR/src/content/docs/changelog" ]]; then
      echo "_No changelog files found._"
      echo ""
      return
    fi

    while IFS= read -r f; do
      [[ -z "$f" ]] && continue
      local relpath="${f#$PROJECT_DIR/}"
      local bytes
      bytes="$(file_bytes "$f")"

      echo "<!-- START CHANGELOG FILE -->"
      emit_file_block "$f" "$relpath" "$bytes"
      echo ""
      echo "<!-- STOP CHANGELOG FILE -->"
      echo ""
    done < <(find "$PROJECT_DIR/src/content/docs/changelog" -type f \( -name "*.md" -o -name "*.mdx" \) | sort)
  } > "$output_file"
}

write_releases() {
  local output_file="$EXPORT_DIR/releases.md"
  {
    echo "# Releases"
    echo ""
    echo "Generated: $TIMESTAMP"
    echo "Project: $PROJECT_NAME"
    echo ""

    if [[ ! -d "$PROJECT_DIR/src/content/docs/releases" ]]; then
      echo "_No release files found._"
      echo ""
      return
    fi

    while IFS= read -r f; do
      [[ -z "$f" ]] && continue
      local relpath="${f#$PROJECT_DIR/}"
      local bytes
      bytes="$(file_bytes "$f")"

      echo "<!-- START RELEASE FILE -->"
      emit_file_block "$f" "$relpath" "$bytes"
      echo ""
      echo "<!-- STOP RELEASE FILE -->"
      echo ""
    done < <(find "$PROJECT_DIR/src/content/docs/releases" -type f \( -name "*.md" -o -name "*.mdx" \) | sort)
  } > "$output_file"
}

write_reference_tome() {
  local output_file="$EXPORT_DIR/reference-tome.md"

  {
    echo "# Reference Tome"
    echo ""
    echo "Generated: $TIMESTAMP"
    echo "Project: $PROJECT_NAME"
    echo ""

    local base="$PROJECT_DIR/src/content/docs/reference"

    [[ ! -d "$base" ]] && echo "_No reference directory found._" && return

    find "$base" -type f -name "*.md" -o -name "*.mdx" | sort | while IFS= read -r f; do
      [[ -z "$f" ]] && continue

      local relpath="${f#$PROJECT_DIR/}"
      local bytes
      bytes="$(file_bytes "$f")"

      local stem
      stem="$(basename "$f" | sed 's/\.[^.]*$//')"

      echo "## $stem"
      echo ""
      echo "_path: $relpath"
      echo ""

      echo "<!-- START REFERENCE FILE -->"
      emit_file_block "$f" "$relpath" "$bytes"
      echo ""
      echo "<!-- STOP REFERENCE FILE -->"
      echo ""
    done

  } > "$output_file"
}

write_empathegy_tome() {
  local output_file="$EXPORT_DIR/empathegy-tome.md"

  {
    echo "# Empathegy Tome"
    echo ""
    echo "Generated: $TIMESTAMP"
    echo "Project: $PROJECT_NAME"
    echo ""
    echo "_Scope: reference/empathegy only_"
    echo ""

    local base="$PROJECT_DIR/src/content/docs/reference/empathegy"

    [[ ! -d "$base" ]] && echo "_No empathegy directory found._" && return

    find "$base" -type f -name "*.md" -o -name "*.mdx" | sort | while IFS= read -r f; do
      [[ -z "$f" ]] && continue

      local relpath="${f#$PROJECT_DIR/}"
      local bytes
      bytes="$(file_bytes "$f")"

      local stem
      stem="$(basename "$f" | sed 's/\.[^.]*$//')"

      echo "## $stem"
      echo ""
      echo "_path: $relpath"
      echo ""

      echo "<!-- START EMPATHEGY FILE -->"
      emit_file_block "$f" "$relpath" "$bytes"
      echo ""
      echo "<!-- STOP EMPATHEGY FILE -->"
      echo ""
    done

  } > "$output_file"
}

build_mega() {
  log_stage "MEGA  →  exports/mega-bundle.md"
  local output_file="$EXPORT_DIR/mega-bundle.md"
  
  {
    echo "<!-- FILED & FORGOTTEN MEGA BUNDLE -->"
    echo "<!-- Generated: $TIMESTAMP -->"
    echo "<!-- Project: $PROJECT_NAME -->"
    echo ""
    
    while IFS= read -r f; do
      [[ -z "$f" ]] && continue
      local relpath="${f#$PROJECT_DIR/}"
      local bytes
      bytes="$(file_bytes "$f")"
      local lang
      lang="$(fence_lang "$f")"

      echo "<file path=\"$relpath\" bytes=\"$bytes\">"
      if (( bytes > MAX_BYTES )); then
        echo "<!-- TRUNCATED: file exceeds ASTRO_BOOK_MAX_BYTES=$MAX_BYTES. Showing first $PREVIEW_LINES lines. -->"
        if [[ -n "$lang" ]]; then
          echo '```'"$lang"
          head -n "$PREVIEW_LINES" "$f"
          echo '```'
        else
          head -n "$PREVIEW_LINES" "$f"
        fi
      else
        if [[ -n "$lang" ]]; then
          echo '```'"$lang"
          cat "$f"
          echo '```'
        else
          cat "$f"
        fi
      fi
      echo "</file>"
      echo ""
    done < <(collect_files)
  } > "$output_file"
  
  log_ok "Mega bundle built → ${BOLD}exports/mega-bundle.md${RESET}"
}

# ── main execution ─────────────────────────────────────────────

main() {
  ensure_exports_dir
  banner

  case "$MODE" in
    index)
      build_index
      ;;
    cluster)
      if [[ -z "${CLUSTER_TARGET}" ]]; then
        log_err "Cluster mode requires --target=<ID>"
        exit 1
      fi
      build_index
      build_cluster "$CLUSTER_TARGET"
      ;;
    export|all)
      log_stage "FULL EXPORT"
      write_content
      write_mascots
      write_lorelog
      write_limericks
      write_haikus
      write_aphorisms
      write_posts
      write_changelog
      write_releases
      write_reference_tome
      write_empathegy_tome

      log_info "Exporting components..."
      write_section_from_dir "Components" "$PROJECT_DIR/src/components" "COMPONENT" "$EXPORT_DIR/components.md"

      log_info "Exporting layouts..."
      write_section_from_dir "Layouts" "$PROJECT_DIR/src/layouts" "LAYOUT" "$EXPORT_DIR/layouts.md"

      log_info "Exporting styles..."
      write_section_from_dir "Styles" "$PROJECT_DIR/src/styles" "STYLE" "$EXPORT_DIR/styles.md"

      log_info "Exporting routes..."
      write_section_from_dir "Routes" "$PROJECT_DIR/src/pages" "ROUTE" "$EXPORT_DIR/routes.md"

      ;;
    mega)
      build_mega
      ;;
    *)
      log_err "Unknown mode: $MODE"
      exit 1
      ;;
  esac

  log_ok "All stages complete. Nothing is alive. Everything is filed."
}

main "$@"