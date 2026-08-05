#!/bin/bash
set -Eeuo pipefail

export PATH="${PATH:+$PATH:}/usr/bin:/bin"

PORT=${1:-8000}
THEME=${2:-themes/cantilever}
DIST_DIR=${DIST_DIR:-dist/preview}

if [[ -z "${BORIS_BIN:-}" || ! -x "${BORIS_BIN}" ]]; then
  BORIS_BIN=$("./scripts/ensure-boris.sh")
  export BORIS_BIN
fi

THEME="$THEME" DIST_DIR="$DIST_DIR" ./scripts/filed-build.sh

echo "✅ Site build complete: ./${DIST_DIR}"
echo "🚀 Serving http://localhost:${PORT}"
python3 -m http.server "$PORT" --directory "$DIST_DIR"
