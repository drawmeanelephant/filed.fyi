#!/usr/bin/env bash
set -Eeuo pipefail

export PATH="/usr/bin:/bin:$PATH"

PORT=${1:-8000}
THEME=${2:-themes/cantilever}
DIST_DIR=${DIST_DIR:-dist/preview}

BORIS_BIN=$("./scripts/ensure-boris.sh")
export BORIS_BIN

THEME="$THEME" DIST_DIR="$DIST_DIR" ./scripts/filed-build.sh

echo "✅ Site build complete: ./${DIST_DIR}"
echo "🚀 Serving http://localhost:${PORT}"
python3 -m http.server "$PORT" --directory "$DIST_DIR"
