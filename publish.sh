#!/usr/bin/env bash
# 배포 - 빌드가 되는지 먼저 확인하고 올린다.
#   ./publish.sh            커밋 메시지를 물어본다
#   ./publish.sh "메시지"    바로 올린다
#   ./publish.sh -y "메시지" 확인 없이 올린다
set -e
cd "$(dirname "$0")"

HUGO="C:/Users/oaeoie/AppData/Local/hermes/tools/hugo.exe"
YES=0
if [ "$1" = "-y" ] || [ "$1" = "--yes" ]; then YES=1; shift; fi

echo "== 로컬 빌드 확인 =="
"$HUGO" --minify --gc --quiet
echo "빌드 성공"
echo

echo "== 초안이 아닌 글 =="
found=0
for f in content/posts/*.md; do
  [ -e "$f" ] || continue
  if ! grep -q "^draft: true" "$f"; then echo "  공개: $(basename "$f")"; found=1; fi
done
[ "$found" = 0 ] && echo "  (없다요 - 초안만 있다요)"
echo

echo "== 올릴 변경 =="
git add -A
if git diff --cached --quiet; then
  echo "  변경 없음. 끝."
  exit 0
fi
git status --short
echo

MSG="${1:-새 글}"
if [ "$YES" != "1" ]; then
  read -r -p "이대로 올릴까요? [y/N] " ans
  case "$ans" in
    y|Y) ;;
    *)   echo "취소했다요."; git reset -q; exit 0 ;;
  esac
fi

git commit -q -m "$MSG"
git push
echo
echo "올렸다요. 1~2분 뒤 https://oaeoie.github.io/blog/ 를 새로고침해라요."
