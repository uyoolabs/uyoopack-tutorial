#!/usr/bin/env bash
# 이 저장소를 템플릿(uyoolabs/uyoopack-tutorial)의 상태로 되돌린다.
#
# - main 을 템플릿의 main 으로 맞추고 강제로 민다(커밋·어댑터 설치 파일·데이터가 전부 사라진다)
# - claude/ 로 시작하는 브랜치와 열린 PR 을 닫는다
#
# 우유팩 쪽 프로젝트는 여기서 되돌리지 않는다 — 프로젝트 설정의 `튜토리얼 다시 만들기` 가 그 일을 한다.
set -euo pipefail

TEMPLATE="${TEMPLATE_REPO:-https://github.com/uyoolabs/uyoopack-tutorial.git}"
cd "$(git rev-parse --show-toplevel)"

if [ -n "$(git status --porcelain)" ]; then
  echo "작업 중인 변경이 있습니다. 커밋하거나 버린 뒤 다시 실행하세요." >&2
  exit 1
fi

if ! git remote get-url template >/dev/null 2>&1; then
  git remote add template "$TEMPLATE"
fi
git fetch template main

git checkout -B main template/main
git push --force origin main

if command -v gh >/dev/null 2>&1; then
  for n in $(gh pr list --state open --json number --jq '.[].number'); do
    gh pr close "$n" --delete-branch || true
  done
fi

for b in $(git branch -r --list 'origin/claude/*' | sed 's#origin/##'); do
  git push origin --delete "$b" || true
done
for b in $(git branch --list 'claude/*'); do
  git branch -D "$b" || true
done

echo "템플릿 상태로 되돌렸습니다. 앱 안의 재고·주문은 브라우저에 있습니다 — 앱 바닥의 '처음 상태로' 로 되돌립니다."
