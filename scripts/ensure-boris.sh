#!/usr/bin/env bash
set -Eeuo pipefail

# Ensure standard environment PATH
export PATH="/usr/bin:/bin:$PATH"

ROOT=$(CDPATH= cd -- "$(dirname -- "${BASH_SOURCE[0]}")/.." && pwd)
TARGET_BIN="${ROOT}/bin/boris"
MANIFEST="${ROOT}/bin/boris.json"
BORIS_REPOSITORY="${BORIS_REPOSITORY:-https://github.com/drawmeanelephant/boris.git}"
BORIS_BRANCH="${BORIS_BRANCH:-afterparty}"
ZIG_VERSION="0.16.0"

# 1. Respect explicit BORIS_BIN if already set and executable
if [[ -n "${BORIS_BIN:-}" && -x "${BORIS_BIN}" ]]; then
  echo "${BORIS_BIN}"
  exit 0
fi

# 2. Return existing binary if present and executable
if [[ -x "${TARGET_BIN}" ]]; then
  echo "${TARGET_BIN}"
  exit 0
fi

mkdir -p "${ROOT}/bin"
mkdir -p "${ROOT}/.tools/cache/global" "${ROOT}/.tools/cache/local"
export ZIG_GLOBAL_CACHE_DIR="${ROOT}/.tools/cache/global"
export ZIG_LOCAL_CACHE_DIR="${ROOT}/.tools/cache/local"

write_manifest() {
  local source_type="$1"
  local branch="$2"
  local commit="$3"
  local built_at
  built_at=$(date -u +"%Y-%m-%dT%H:%M:%SZ")

  python3 -c '
import json, sys
data = {
    "binary": sys.argv[1],
    "source": sys.argv[2],
    "branch": sys.argv[3],
    "commit": sys.argv[4],
    "built_at": sys.argv[5],
    "zig_version": sys.argv[6]
}
with open(sys.argv[7], "w") as f:
    json.dump(data, f, indent=2)
' "${TARGET_BIN}" "${source_type}" "${branch}" "${commit}" "${built_at}" "${ZIG_VERSION}" "${MANIFEST}"
}

# 3. Check for local sibling repository (pre-built executable or build from source)
SIBLING_CANDIDATES=(
  "${ROOT}/../boris"
  "${ROOT}/../boris/main"
)

for sibling in "${SIBLING_CANDIDATES[@]}"; do
  if [[ -d "${sibling}" ]]; then
    if [[ -x "${sibling}/zig-out/bin/boris" ]]; then
      echo "==> Attempting pre-built Boris binary from sibling repository (${sibling})..." >&2
      if cp "${sibling}/zig-out/bin/boris" "${TARGET_BIN}" 2>/dev/null; then
        chmod +x "${TARGET_BIN}"
        commit=$(git -C "${sibling}" rev-parse HEAD 2>/dev/null || echo "unknown")
        branch=$(git -C "${sibling}" branch --show-current 2>/dev/null || echo "${BORIS_BRANCH}")
        write_manifest "sibling" "${branch}" "${commit}"
        echo "${TARGET_BIN}"
        exit 0
      fi
    fi
    if [[ -f "${sibling}/build.zig" ]]; then
      echo "==> Attempting Boris build from local sibling repository (${sibling})..." >&2
      if (cd "${sibling}" && zig build 2>/dev/null) && [[ -x "${sibling}/zig-out/bin/boris" ]]; then
        if cp "${sibling}/zig-out/bin/boris" "${TARGET_BIN}" 2>/dev/null; then
          chmod +x "${TARGET_BIN}"
          commit=$(git -C "${sibling}" rev-parse HEAD 2>/dev/null || echo "unknown")
          branch=$(git -C "${sibling}" branch --show-current 2>/dev/null || echo "${BORIS_BRANCH}")
          write_manifest "sibling" "${branch}" "${commit}"
          echo "${TARGET_BIN}"
          exit 0
        fi
      fi
    fi
  fi
done

# 4. Fall back to downloading Zig (if missing) and cloning Boris from source
if ! command -v zig >/dev/null 2>&1; then
  ZIG_DIR="${ROOT}/.tools/zig"
  if [[ ! -x "${ZIG_DIR}/zig" ]]; then
    echo "==> Downloading Zig ${ZIG_VERSION}..." >&2
    mkdir -p "${ZIG_DIR}"
    OS=$(uname -s | tr '[:upper:]' '[:lower:]')
    ARCH=$(uname -m)
    if [[ "${ARCH}" == "x86_64" ]]; then
      ARCH="x86_64"
    elif [[ "${ARCH}" == "arm64" || "${ARCH}" == "aarch64" ]]; then
      ARCH="aarch64"
    fi
    ZIG_URL="https://ziglang.org/download/${ZIG_VERSION}/zig-${OS}-${ARCH}-${ZIG_VERSION}.tar.xz"
    curl -L -s "${ZIG_URL}" | tar -xJ -C "${ZIG_DIR}" --strip-components=1
  fi
  export PATH="${ZIG_DIR}:${PATH}"
fi

BUILD_DIR="${ROOT}/.tools/boris-build"
rm -rf "${BUILD_DIR}"
echo "==> Cloning Boris compiler source (${BORIS_BRANCH} branch)..." >&2
git clone --branch "${BORIS_BRANCH}" --single-branch --depth=1 "${BORIS_REPOSITORY}" "${BUILD_DIR}" >&2

echo "==> Compiling Boris executable..." >&2
(cd "${BUILD_DIR}" && zig build)

if [[ ! -x "${BUILD_DIR}/zig-out/bin/boris" ]]; then
  echo "ERROR: Boris build failed to produce executable" >&2
  exit 1
fi

cp "${BUILD_DIR}/zig-out/bin/boris" "${TARGET_BIN}"
chmod +x "${TARGET_BIN}"
commit=$(git -C "${BUILD_DIR}" rev-parse HEAD 2>/dev/null || echo "unknown")
write_manifest "remote" "${BORIS_BRANCH}" "${commit}"
rm -rf "${BUILD_DIR}"

echo "${TARGET_BIN}"
