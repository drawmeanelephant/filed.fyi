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

echo "🚀 Starting deployment from: $TARGET_DIR"

# 1. Load environment variables from .env in the project directory
if [ -f "$TARGET_DIR/.env" ]; then
  echo "🔑 Loading environment variables from $TARGET_DIR/.env"
  # Export variables, ignoring comments
  export $(grep -v '^#' "$TARGET_DIR/.env" | xargs)
fi

# Ensure required deployment variables are set
if [ -z "$DEPLOY_USER" ] || [ -z "$DEPLOY_HOST" ] || [ -z "$DEPLOY_PATH" ]; then
  echo "❌ Error: Deployment environment variables are not set!"
  echo "Please define DEPLOY_USER, DEPLOY_HOST, and DEPLOY_PATH in your .env file."
  exit 1
fi

SSH_KEY="${DEPLOY_SSH_KEY:-~/.ssh/id_ed25519}"

# 2. Build the project inside the target directory
echo "📦 Building Astro project..."
(cd "$TARGET_DIR" && npm run build)

# 3. Rsync the dist folder to the server
echo "📤 Syncing build output via rsync to $DEPLOY_USER@$DEPLOY_HOST:$DEPLOY_PATH..."
rsync -avz --delete --exclude ".DS_Store" -e "ssh -i $SSH_KEY" "$TARGET_DIR/dist/" "$DEPLOY_USER@$DEPLOY_HOST:$DEPLOY_PATH"

echo "✅ Deploy completed successfully!"