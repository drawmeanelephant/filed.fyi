#!/usr/bin/env bash
set -Eeuo pipefail

ROOT=$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)
cd "$ROOT"

BORIS_REPOSITORY="https://github.com/drawmeanelephant/boris.git"
BORIS_BRANCH="${BORIS_BRANCH:-afterparty}"
ZIG_VERSION="0.16.0"

# 1. Ensure Zig is available
if ! command -v zig >/dev/null 2>&1; then
  echo "==> Downloading Zig ${ZIG_VERSION}..."
  mkdir -p .tools/zig
  # Detect OS architecture for Zig download
  OS=$(uname -s | tr '[:upper:]' '[:lower:]')
  ARCH=$(uname -m)
  if [[ "$ARCH" == "x86_64" ]]; then
    ARCH="x86_64"
  elif [[ "$ARCH" == "arm64" || "$ARCH" == "aarch64" ]]; then
    ARCH="aarch64"
  fi
  ZIG_URL="https://ziglang.org/download/${ZIG_VERSION}/zig-${OS}-${ARCH}-${ZIG_VERSION}.tar.xz"
  curl -L -s "$ZIG_URL" | tar -xJ -C .tools/zig --strip-components=1
  export PATH="$ROOT/.tools/zig:$PATH"
fi

# 2. Obtain Boris compiler source (afterparty branch)
BUILD_DIR="${TMPDIR:-/tmp}/boris-build"
rm -rf "$BUILD_DIR"
echo "==> Cloning Boris compiler source (${BORIS_BRANCH} branch)..."
git clone --branch "$BORIS_BRANCH" --single-branch --depth=1 "$BORIS_REPOSITORY" "$BUILD_DIR"

# 3. Build Boris executable
echo "==> Compiling Boris compiler..."
(cd "$BUILD_DIR" && zig build)
mkdir -p "$ROOT/bin"
cp "$BUILD_DIR/zig-out/bin/boris" "$ROOT/bin/boris"
chmod +x "$ROOT/bin/boris"

# 4. Run validation gate and site build
echo "==> Running Filed graph validation gate..."
BORIS_BIN="$ROOT/bin/boris" ./bin/validate_graph.sh

echo "==> Building static site output..."
BORIS_BIN="$ROOT/bin/boris" ./scripts/filed-build.sh

echo "✅ Cloudflare build succeeded."
