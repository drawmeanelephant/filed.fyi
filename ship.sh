#!/bin/bash

set -e

SCRIPT_DIR=$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)

# Determine the target project directory
DEFAULT_TARGET="$SCRIPT_DIR/../office-of-continuous-assurance/projects/filed.fyi"
if [ ! -d "$DEFAULT_TARGET" ]; then
  DEFAULT_TARGET="$SCRIPT_DIR"
fi
TARGET_DIR="${1:-$DEFAULT_TARGET}"
TARGET_DIR=$(cd "$TARGET_DIR" && pwd)

echo "🚢 Shipping project at: $TARGET_DIR"

# 1. Run astro-book.sh in the target directory
if [ -f "$TARGET_DIR/astro-book.sh" ]; then
  echo "📖 Generating Astro book..."
  (cd "$TARGET_DIR" && ./astro-book.sh)
else
  echo "⚠️  astro-book.sh not found in $TARGET_DIR"
fi

# 2. Call deploy.sh with the target directory
"$SCRIPT_DIR/deploy.sh" "$TARGET_DIR"