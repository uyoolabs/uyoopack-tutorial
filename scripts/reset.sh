#!/usr/bin/env bash
# 이 저장소를 템플릿(uyoolabs/uyoopack-tutorial)의 상태로 되돌린다. 데모를 마칠 때마다 한 번 돌린다.
#
# - main 을 템플릿의 main 으로 맞추고 강제로 민다(커밋·데이터가 전부 사라진다)
# - 열린 PR 을 닫고 main 밖의 원격 브랜치를 전부 지운다
# - 이 클론도 main 으로 돌려놓고 로컬 브랜치를 지운다
#
# 우유팩 쪽 프로젝트는 여기서 되돌리지 않는다 — 프로젝트 설정의 `튜토리얼 다시 만들기` 가 그 일을 한다.
# 다시 만들어도 주소와 저장소 연결은 그대로라 이 저장소를 다시 붙일 필요는 없다.
set -euo pipefail

TEMPLATE="${TEMPLATE_REPO:-https://github.com/uyoolabs/uyoopack-tutorial.git}"
cd "$(git rev-parse --show-toplevel)"

if [ "$(git remote get-url origin)" = "$TEMPLATE" ]; then
  echo "템플릿 저장소 자신에서는 돌리지 않습니다. 템플릿으로 만든 내 저장소에서 돌려 주세요." >&2
  exit 1
fi

if [ -n "$(git status --porcelain)" ]; then
  echo "작업 중인 변경이 있습니다. 커밋하거나 버린 뒤 다시 실행하세요." >&2
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

echo "템플릿 상태로 되돌렸습니다."
echo "앱 안의 재고·주문은 브라우저에 있습니다 — 앱 바닥의 '처음 상태로' 로 되돌립니다."
echo "우유팩 프로젝트는 설정의 '튜토리얼 다시 만들기' 로 되돌립니다."
