#!/usr/bin/env bash
# 새 글 쓰기 - 파일을 만들고 편집기로 연다.
#   ./new-post.sh "글 제목"
#   ./new-post.sh "글 제목" 내가-정한-주소
set -e
cd "$(dirname "$0")"

if [ -z "$1" ]; then
  echo "제목을 달라요.   예: ./new-post.sh \"오늘의 잡담\""
  exit 1
fi

TITLE="$1"
# 주소(슬러그): 안 주면 제목에서 만든다. 띄어쓰기->하이픈, 위험한 문자 제거.
SLUG="${2:-$(printf '%s' "$TITLE" | tr ' ' '-' | tr -d ':/\\?*"<>|')}"
FILE="content/posts/${SLUG}.md"

if [ -e "$FILE" ]; then
  echo "이미 있다요: $FILE"
  exit 1
fi

mkdir -p content/posts
NOW=$(date +%Y-%m-%dT%H:%M:%S%z)

cat > "$FILE" <<EOF
---
title: "$TITLE"
date: $NOW
draft: true
tags: []
description: ""
---

여기부터 써라요. 마크다운이다요.

## 소제목을 쓰면

목차에 자동으로 들어간다요.
EOF

echo
echo "만들었다요: $FILE"
echo
echo "다음 순서"
echo "  1. 글을 쓴다요"
echo "  2. front matter 의 draft: true 를 false 로 바꾼다요 (이때 공개된다요)"
echo "  3. ./publish.sh - 빌드 확인하고 올린다요"
echo
echo "미리보기: C:/Users/oaeoie/AppData/Local/hermes/tools/hugo.exe server -D"

# 편집기가 있으면 백그라운드로 띄운다. 붙잡고 기다리면 터미널이 멈춘다.
EDITOR="${EDITOR:-}"
if [ -z "$EDITOR" ] && command -v code >/dev/null 2>&1; then EDITOR=code; fi
if [ -n "$EDITOR" ]; then ( "$EDITOR" "$FILE" >/dev/null 2>&1 & ) || true; fi
