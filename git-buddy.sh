#!/usr/bin/env bash
# ==============================================================================
#   ██████╗ ██╗████████╗    ██████╗ ██╗   ██╗██████╗ ██████╗ ██╗   ██╗
#  ██╔════╝ ██║╚══██╔══╝    ██╔══██╗██║   ██║██╔══██╗██╔══██╗╚██╗ ██╔╝
#  ██║  ███╗██║   ██║       ██████╔╝██║   ██║██║  ██║██║  ██║ ╚████╔╝ 
#  ██║   ██║██║   ██║       ██╔══██╗██║   ██║██║  ██║██║  ██║  ╚██╔╝  
#  ╚██████╔╝██║   ██║       ██████╔╝╚██████╔╝██████╔╝██████╔╝   ██║   
#   ╚═════╝ ╚═╝   ╚═╝       ╚═════╝  ╚══════╝╚═════╝ ╚═════╝    ╚═╝   
#
#   your friendly git companion for filed.fyi
# ==============================================================================

set -euo pipefail

# Colors
GREEN='\033[0;32m'
CYAN='\033[0;36m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BOLD='\033[1m'
RESET='\033[0m'

log_info() { echo -e "${CYAN}[git-buddy]${RESET} $*"; }
log_ok()   { echo -e "${GREEN}[git-buddy]${RESET} $*"; }
log_warn() { echo -e "${YELLOW}[git-buddy]${RESET} $*"; }
log_err()  { echo -e "${RED}[git-buddy]${RESET} $*" >&2; }

# Funny default commit messages
SMARTASS_COMMITS=(
  "chore(content): another grain of sand in the hourglass of failure"
  "chore(content): added a little more administrative burden"
  "chore(content): system entities adjusted to prevent mutiny"
  "chore(content): filed, forgotten, and now slightly modified"
  "chore(content): standardizing the bureaucracy of mascots"
  "chore(content): jules made me do it"
  "chore(content): backing up the silence"
  "chore(content): minor tweaks for future archeologists"
  "chore(content): another drop in the compliance bucket"
  "chore(content): archiving residue from the void"
)

# 1. Check current branch
CURRENT_BRANCH=$(git branch --show-current)
if [ "$CURRENT_BRANCH" != "incubator" ]; then
  log_warn "You are on branch '${CURRENT_BRANCH}', not 'incubator'."
  read -p "Would you like to switch to 'incubator'? (y/N) " SWITCH_BRANCH
  if [[ "$SWITCH_BRANCH" =~ ^[Yy]$ ]]; then
    git checkout incubator
    CURRENT_BRANCH="incubator"
  else
    log_err "Aborting. Please run this script from the 'incubator' branch."
    exit 1
  fi
fi

# 2. Check if there are changes to commit
if git diff --quiet && git diff --cached --quiet && [ -z "$(git ls-files --others --exclude-standard)" ]; then
  log_info "No changes detected. Workspace is clean."
  log_info "Let's make sure we are pushed anyway."
  git push origin incubator
  exit 0
fi

# 3. Determine commit message
COMMIT_MSG=""
if [ $# -gt 0 ]; then
  COMMIT_MSG="$1"
else
  echo -e "\n${BOLD}Staging all changes...${RESET}"
  git status -s
  echo ""
  read -p "Enter commit message (leave blank for a random archival message): " USER_MSG
  if [ -n "$USER_MSG" ]; then
    COMMIT_MSG="$USER_MSG"
  else
    # Pick a random smartass commit message
    RAND_INDEX=$(( RANDOM % ${#SMARTASS_COMMITS[@]} ))
    COMMIT_MSG="${SMARTASS_COMMITS[$RAND_INDEX]}"
  fi
fi

# 4. Stage and commit
log_info "Staging all changes..."
git add -A

log_info "Committing with message: ${BOLD}'${COMMIT_MSG}'${RESET}"
git commit -m "$COMMIT_MSG"

# 5. Push incubator to origin
log_info "Pushing incubator to origin..."
git push origin incubator

# 6. Switch to main
log_info "Switching to main..."
git checkout main

# 7. Pull main
log_info "Pulling latest main..."
git pull origin main

# 8. Merge incubator
log_info "Merging incubator into main..."
git merge incubator --no-edit

# 9. Push main
log_info "Pushing main to origin..."
git push origin main

# 10. Switch back to incubator
log_info "Returning to incubator branch..."
git checkout incubator

log_ok "Workflow complete! Everything is synchronized. You are on the '${BOLD}incubator${RESET}' branch."
