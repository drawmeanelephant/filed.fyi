#!/usr/bin/env bash
set -Eeuo pipefail

ROOT=$(CDPATH= cd -- "$(dirname -- "${BASH_SOURCE[0]}")/.." && pwd)
BIN_DIR="${ROOT}/bin"

if [[ ! -d "${BIN_DIR}" ]]; then
  echo "No bin directory found at ${BIN_DIR}"
  exit 0
fi

echo "==> Cleaning local compiler binaries in bin/..."
count=0
for item in "${BIN_DIR}"/*; do
  if [[ -f "${item}" ]]; then
    filename=$(basename "${item}")
    # Preserve shell scripts (such as validate_graph.sh)
    if [[ "${filename}" == *.sh ]]; then
      continue
    fi
    rm -f "${item}"
    echo "  Removed: ${filename}"
    count=$((count + 1))
  fi
done

echo "✅ Removed ${count} local binary artifact(s)."
