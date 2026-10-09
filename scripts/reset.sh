#!/usr/bin/env bash
# Puts this repository back to the state of the template (uyoolabs/uyoopack-tutorial). Run it once after each demo.
#
# - Resets main to the template's main and force-pushes it (every commit and change is lost)
# - Closes open PRs and deletes every remote branch other than main
# - Moves this clone back to main and deletes local branches
#
# The UyooPack project is not reset here. "Recreate tutorial" in the project settings does that.
# Recreating keeps the address and the repository link, so you do not need to connect this repository again.
set -euo pipefail

TEMPLATE="${TEMPLATE_REPO:-https://github.com/uyoolabs/uyoopack-tutorial.git}"
cd "$(git rev-parse --show-toplevel)"

if [ "$(git remote get-url origin)" = "$TEMPLATE" ]; then
  echo "This does not run in the template repository itself. Run it in the repository you made from the template." >&2
  exit 1
fi

if [ -n "$(git status --porcelain)" ]; then
  echo "You have uncommitted changes. Commit or discard them, then run this again." >&2
  exit 1
fi

if ! git remote get-url template >/dev/null 2>&1; then
  git remote add template "$TEMPLATE"
fi
git fetch --quiet template main
git fetch --quiet --prune origin

git checkout --quiet -B main template/main
git push --force origin main

if command -v gh >/dev/null 2>&1; then
  for n in $(gh pr list --state open --json number --jq '.[].number'); do
    gh pr close "$n" || true
  done
fi

for b in $(git for-each-ref --format='%(refname:strip=3)' refs/remotes/origin); do
  case "$b" in
    main | HEAD) ;;
    *) git push --quiet origin --delete "$b" || true ;;
  esac
done
for b in $(git for-each-ref --format='%(refname:short)' refs/heads); do
  [ "$b" = main ] || git branch -D "$b" >/dev/null || true
done
git branch --quiet --set-upstream-to=origin/main main

echo "Reset to the template."
echo "Stock and orders in the app live in the browser. Reset them with \"Start over\" at the bottom of the app."
echo "Reset the UyooPack project with \"Recreate tutorial\" in its settings."
