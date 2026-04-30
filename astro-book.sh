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
# Purpose : Export an Astro project into segmented markdown files
#           for LLM review, archival weirdness, and source spelunking
# Output  : exports/content.md
#           exports/components.md
#           exports/layouts.md
#           exports/styles.md
#           exports/routes.md
#           exports/config.md
#           exports/system.md
#           exports/manifest.md
#           exports/mascots.md
#           exports/lorelog.md
# Usage   : ./astro-book.sh [project-path]
# Env     : ASTRO_BOOK_MAX_BYTES=200000
#           ASTRO_BOOK_PREVIEW_LINES=160
# Version : 2.6.0
# ===============================================================

set -euo pipefail
IFS=$'\n\t'

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
MAGENTA='\033[0;35m'
BOLD='\033[1m'
DIM='\033[2m'
RESET='\033[0m'

log_info()  { echo -e "${CYAN}[astro-book]${RESET} $*"; }
log_ok()    { echo -e "${GREEN}[astro-book]${RESET} $*"; }
log_warn()  { echo -e "${YELLOW}[astro-book]${RESET} $*"; }
log_err()   { echo -e "${RED}[astro-book]${RESET} $*" >&2; }

banner() {
  echo ""
  echo -e "${MAGENTA}${BOLD}╔══════════════════════════════════════════════════════════════╗${RESET}"
  echo -e "${MAGENTA}${BOLD}║                 FILED & FORGOTTEN :: EXPORT                 ║${RESET}"
  echo -e "${MAGENTA}${BOLD}║         “everything gets exported, nothing is alive”        ║${RESET}"
  echo -e "${MAGENTA}${BOLD}╚══════════════════════════════════════════════════════════════╝${RESET}"
  echo ""
}

usage() {
  cat <<'EOF'

astro-book.sh — Filed & Forgotten Astro exporter

Usage:
  ./astro-book.sh [project-path]
  ./astro-book.sh --help

Environment:
  ASTRO_BOOK_MAX_BYTES      Max file size to fully include (default: 102400)
  ASTRO_BOOK_PREVIEW_LINES  Preview lines for oversized files (default: 160)

Output:
  exports/
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

EOF
}

if [[ "${1:-}" == "--help" ]]; then
  usage
  exit 0
fi

MAX_BYTES="${ASTRO_BOOK_MAX_BYTES:-102400}"
PREVIEW_LINES="${ASTRO_BOOK_PREVIEW_LINES:-160}"

PROJECT_DIR="${1:-$PWD}"
PROJECT_DIR="$(cd "$PROJECT_DIR" && pwd)"

TIMESTAMP="$(date -u +"%Y-%m-%dT%H:%M:%SZ")"
PROJECT_NAME="$(basename "$PROJECT_DIR")"
EXPORT_DIR="$PROJECT_DIR/exports"

INCLUDED_COUNT=0
TRUNCATED_COUNT=0
SKIPPED_COUNT=0

file_bytes() {
  stat -f%z "$1" 2>/dev/null || stat -c%s "$1" 2>/dev/null || echo 0
}

has_cmd() {
  command -v "$1" >/dev/null 2>&1
}

fence_lang() {
  local f="$1"
  case "${f##*.}" in
    ts|tsx)         echo "typescript" ;;
    js|jsx|mjs|cjs) echo "javascript" ;;
    astro)          echo "astro" ;;
    md|mdx)         echo "markdown" ;;
    html|htm)       echo "html" ;;
    json)           echo "json" ;;
    css)            echo "css" ;;
    scss)           echo "scss" ;;
    sass)           echo "sass" ;;
    less)           echo "less" ;;
    yaml|yml)       echo "yaml" ;;
    toml)           echo "toml" ;;
    sh)             echo "bash" ;;
    svg)            echo "xml" ;;
    env)            echo "dotenv" ;;
    *)              echo "" ;;
  esac
}

ensure_exports_dir() {
  rm -rf "$EXPORT_DIR"
  mkdir -p "$EXPORT_DIR"
}

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
    done < <(find "$PROJECT_DIR/src/content/docs/mascots" -type f | sort)
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

    if [[ ! -d "$PROJECT_DIR/src/content/lorelog" ]]; then
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
    done < <(find "$PROJECT_DIR/src/content/lorelog" -type f | sort)
  } > "$output_file"
}

write_rules() {
  local output_file="$EXPORT_DIR/rules.md"
  {
    echo "# Rules"
    echo ""
    echo "Generated: $TIMESTAMP"
    echo "Project: $PROJECT_NAME"
    echo ""

    if [[ ! -f "$PROJECT_DIR/rules.md" ]]; then
      echo "_No rules.md found._"
      echo ""
      return
    fi

    echo "<!-- START RULES FILE -->"
    local relpath="${PROJECT_DIR#$PROJECT_DIR/}/rules.md"
    local bytes
    bytes="$(file_bytes "$PROJECT_DIR/rules.md")"
    emit_file_block "$PROJECT_DIR/rules.md" "rules.md" "$bytes"
    echo ""
    echo "<!-- STOP RULES FILE -->"
    echo ""
  } > "$output_file"
}

write_routes() {
  local output_file="$EXPORT_DIR/routes.md"
  {
    echo "# Routes"
    echo ""
    if [[ -d "$PROJECT_DIR/src/pages" ]]; then
      find "$PROJECT_DIR/src/pages" -type f | sort | while IFS= read -r f; do
        echo "- ${f#$PROJECT_DIR/} → $(basename "$f")"
      done
    else
      echo "_No src/pages directory found._"
    fi
    echo ""
  } > "$output_file"
}

write_config() {
  local output_file="$EXPORT_DIR/config.md"
  {
    echo "# Config"
    echo ""

    local found=0
    for f in astro.config.ts astro.config.mjs astro.config.js tsconfig.json package.json; do
      if [[ -f "$PROJECT_DIR/$f" ]]; then
        found=1
        local bytes
        local lang
        bytes="$(file_bytes "$PROJECT_DIR/$f")"
        lang="$(fence_lang "$f")"

        echo "## $f"
        echo ""
        echo "path: $f"
        echo "bytes: $bytes"
        echo '```'"$lang"
        cat "$PROJECT_DIR/$f"
        echo '```'
        echo ""
      fi
    done

    if [[ "$found" -eq 0 ]]; then
      echo "_No config files found._"
      echo ""
    fi
  } > "$output_file"
}

write_system() {
  local output_file="$EXPORT_DIR/system.md"
  {
    echo "# System"
    echo ""
    echo "- Generated: $TIMESTAMP"
    echo "- Project: $PROJECT_NAME"
    echo "- Root: $PROJECT_DIR"
    echo "- Max bytes: $MAX_BYTES"
    echo "- Preview lines: $PREVIEW_LINES"
    echo ""

    echo "## Astro config presence"
    echo ""
    if [[ -f "$PROJECT_DIR/astro.config.ts" || -f "$PROJECT_DIR/astro.config.mjs" || -f "$PROJECT_DIR/astro.config.js" ]]; then
      echo "- Found astro config."
    else
      echo "- No astro config found."
    fi
    echo ""

    echo "## Dependencies"
    echo ""
    if [[ -f "$PROJECT_DIR/package.json" ]]; then
      if has_cmd jq; then
        jq '.dependencies // {}' "$PROJECT_DIR/package.json"
      else
        python3 - <<PY
import json, pathlib
p = pathlib.Path(r"$PROJECT_DIR/package.json")
try:
    data = json.loads(p.read_text())
    print(json.dumps(data.get("dependencies", {}), indent=2))
except Exception:
    print("{}")
PY
      fi
    else
      echo "_No package.json found._"
    fi
    echo ""
  } > "$output_file"
}

write_manifest() {
  local output_file="$EXPORT_DIR/manifest.md"
  {
    echo "# Manifest"
    echo ""
    echo "- Generated: $TIMESTAMP"
    echo "- Project: $PROJECT_NAME"
    echo "- Root: $PROJECT_DIR"
    echo "- Max bytes: $MAX_BYTES"
    echo "- Preview lines: $PREVIEW_LINES"
    echo "- Included files: $INCLUDED_COUNT"
    echo "- Truncated files: $TRUNCATED_COUNT"
    echo "- Skipped files: $SKIPPED_COUNT"
    echo ""

    echo "## Export files"
    echo ""
    find "$EXPORT_DIR" -maxdepth 1 -type f | sort | while IFS= read -r f; do
      echo "- $(basename "$f")"
    done
    echo ""
  } > "$output_file"
}

main() {
  banner

  echo -e "${BOLD}astro-book.sh — archival export engine${RESET}"
  echo -e "Project : ${CYAN}${PROJECT_DIR}${RESET}"
  echo -e "Max file: ${CYAN}${MAX_BYTES} bytes${RESET}"
  echo -e "Preview : ${CYAN}${PREVIEW_LINES} lines${RESET}"
  echo ""

  if [[ ! -f "$PROJECT_DIR/astro.config.ts" && ! -f "$PROJECT_DIR/astro.config.mjs" && ! -f "$PROJECT_DIR/astro.config.js" ]]; then
    log_warn "No astro.config.* found in $PROJECT_DIR — proceeding anyway."
  fi

  log_info "Sweeping the premises..."
  ensure_exports_dir

  log_info "Cataloguing content relics..."
  write_content

  log_info "Excavating mascot graveyard..."
  write_mascots

  log_info "Replaying lorelog fragments..."
  write_lorelog

  log_info "Interrogating components..."
  write_section_from_dir "Components" "$PROJECT_DIR/src/components" "COMPONENT" "$EXPORT_DIR/components.md"

  log_info "Searching dormant layouts..."
  write_section_from_dir "Layouts" "$PROJECT_DIR/src/layouts" "LAYOUT" "$EXPORT_DIR/layouts.md"

  log_info "Scraping styles off the walls..."
  write_section_from_dir "Styles" "$PROJECT_DIR/src/styles" "STYLES" "$EXPORT_DIR/styles.md"

  log_info "Mapping routes..."
  write_routes

  log_info "Confiscating config..."
  write_config
  log_info "Seizing rules..."
  write_rules

  log_info "Recording system state..."
  write_system

  log_info "Stamping manifest..."
  write_manifest

  echo ""
  log_ok "Archive sealed."
  echo ""
  echo -e "${DIM}Filed & Forgotten :: last known good state preserved${RESET}"
  echo -e "${DIM}---------------------------------------------------${RESET}"
  echo ""
  echo -e "  ${GREEN}✓${RESET} exports/content.md"
  echo -e "  ${GREEN}✓${RESET} exports/mascots.md"
  echo -e "  ${GREEN}✓${RESET} exports/lorelog.md"
  echo -e "  ${GREEN}✓${RESET} exports/components.md"
  echo -e "  ${GREEN}✓${RESET} exports/layouts.md"
  echo -e "  ${GREEN}✓${RESET} exports/styles.md"
  echo -e "  ${GREEN}✓${RESET} exports/routes.md"
  echo -e "  ${GREEN}✓${RESET} exports/config.md"
  echo -e "  ${GREEN}✓${RESET} exports/system.md"
  echo -e "  ${GREEN}✓${RESET} exports/manifest.md"
  echo ""
}

main "$@"