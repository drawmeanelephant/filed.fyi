#!/usr/bin/env bash
set -Eeuo pipefail

# Build the Boris worktree in place. This script never fetches, checks out, or
# mutates the Boris branch; Afterparty is expected to be an active worktree.
FILED_ROOT=$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)
BORIS_ROOT=${BORIS_ROOT:-"$FILED_ROOT/../boris/main"}
BORIS_BRANCH=${BORIS_BRANCH:-afterparty}
ARTIFACT_ROOT=${ARTIFACT_ROOT:-publish/boris-afterparty}
SPLIT_SIZE=${SPLIT_SIZE:-262144}

BORIS_ROOT=$(cd "$BORIS_ROOT" && pwd)
cd "$FILED_ROOT"

current_branch=$(git -C "$BORIS_ROOT" branch --show-current)
if [[ "$current_branch" != "$BORIS_BRANCH" ]]; then
  echo "ERROR: Boris worktree is on '$current_branch', expected '$BORIS_BRANCH'." >&2
  echo "Set BORIS_BRANCH explicitly if the active Afterparty branch changed." >&2
  exit 2
fi

boris_sha=$(git -C "$BORIS_ROOT" rev-parse HEAD)
boris_short_sha=$(git -C "$BORIS_ROOT" rev-parse --short HEAD)
boris_status=$(git -C "$BORIS_ROOT" status --porcelain)
boris_dirty=false
if [[ -n "$boris_status" ]]; then
  boris_dirty=true
fi

echo "==> Building Boris Afterparty"
echo "    Root:   $BORIS_ROOT"
echo "    Branch: $current_branch"
echo "    Commit: $boris_short_sha"
echo "    Dirty:  $boris_dirty"

(cd "$BORIS_ROOT" && zig build)

BORIS_BIN="$BORIS_ROOT/zig-out/bin/boris"
if [[ ! -x "$BORIS_BIN" ]]; then
  echo "ERROR: Boris build did not produce an executable: $BORIS_BIN" >&2
  exit 1
fi

mkdir -p "$ARTIFACT_ROOT"
cp "$BORIS_BIN" "$ARTIFACT_ROOT/boris"
chmod +x "$ARTIFACT_ROOT/boris"

smoke_root="$ARTIFACT_ROOT/.smoke"
rm -rf "$smoke_root"
mkdir -p "$smoke_root"

echo "==> Smoke-testing scoped product RAG"
"$ARTIFACT_ROOT/boris" --input content \
  --rag-dir "$smoke_root/rag" \
  --scope mascots \
  --split-size "$SPLIT_SIZE" \
  --bundles-only \
  --quiet

echo "==> Smoke-testing scoped context"
"$ARTIFACT_ROOT/boris" --input content \
  --context-dir "$smoke_root/context" \
  --scope mascots/028.genny-compileheart \
  --split-size "$SPLIT_SIZE" \
  --quiet

status_json=$(printf '%s\n' "$boris_status" | jq -Rs .)
jq -n \
  --arg branch "$current_branch" \
  --arg commit "$boris_sha" \
  --arg short_commit "$boris_short_sha" \
  --arg split_size "$SPLIT_SIZE" \
  --argjson dirty "$boris_dirty" \
  --argjson status "$status_json" \
  '{source:{branch:$branch,commit:$commit,dirty:$dirty,status:$status},split_size:($split_size|tonumber),binary:"boris",smoke_tests:["scoped-rag","scoped-context"]}' \
  > "$ARTIFACT_ROOT/build-manifest.json"

echo "==> Exporting Filed publishing bundle"
BORIS_BIN="$ARTIFACT_ROOT/boris" \
  PUBLISH_DIR=publish \
  ./scripts/filed-publish.sh

echo "✅ Boris Afterparty build and Filed publishing bundle complete"
echo "   Binary:  $ARTIFACT_ROOT/boris"
echo "   Record:  $ARTIFACT_ROOT/build-manifest.json"
