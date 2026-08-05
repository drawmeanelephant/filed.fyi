#!/usr/bin/env bash
set -Eeuo pipefail

export PATH="/usr/bin:/bin:$PATH"

ROOT=$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)
cd "$ROOT"

echo "==> Resolving Boris compiler binary..."
BORIS_BIN=$(./scripts/ensure-boris.sh)
export BORIS_BIN

echo "==> Running Filed graph validation gate..."
./bin/validate_graph.sh

echo "==> Building static site output..."
./scripts/filed-build.sh

echo "✅ Cloudflare build succeeded."
