# verbum

개인 블로그. Hugo + GitHub Pages.

- 주소: **https://oaeoie.github.io/blog/**
- 테마: retro-paper (2000년대 종이 질감 · Galmuri11 픽셀 폰트 · 공사중 도장 · 전광판)
- 폰트: Galmuri11, `static/fonts/` 에 자체 호스팅 (외부 CDN 의존 없음)
- 프로필 사진: `static/img/avatar.png`
- 배포: `main` 브랜치에 push 하면 GitHub Actions 가 빌드해서 Pages 에 올린다

## 글 쓰기

```bash
./new-post.sh "글 제목"          # content/posts/글-제목.md 생성 (draft: true)
./new-post.sh "글 제목" 내-주소   # 주소를 직접 정하고 싶을 때
./publish.sh                    # 빌드 확인 -> 커밋 -> 푸시
./publish.sh -y "커밋 메시지"     # 확인 없이 바로
```

1. `./new-post.sh "제목"` 으로 파일을 만든다
2. 글을 쓰고, 맨 위 `draft: true` 를 **`draft: false`** 로 바꾼다 (이때 공개된다)
3. `./publish.sh` 로 올린다. 1~2분 뒤 사이트에 뜬다

## 미리보기

```bash
C:/Users/oaeoie/AppData/Local/hermes/tools/hugo.exe server -D
```

`http://localhost:1313/blog/` 에서 확인한다. `-D` 를 붙이면 초안도 보인다.

## front matter

```yaml
---
title: "글 제목"          # 제목 (목록·브라우저 탭에 나온다)
date: 2026-10-07T19:00:00+0900
draft: true               # true = 비공개, false = 공개
tags: ["잡담"]             # 태그. 사이드바 카테고리와 태그 페이지에 쓰인다
description: "한 줄 요약"  # 카드와 검색 결과에 나온다
---
```

## 전광판 문구 바꾸기

`data/marquee.yaml` 의 목록에서 매번 무작위로 하나를 뽑아 흘려보낸다.
한 줄에 하나씩 `- "문구"` 형식으로 넣으면 된다.

## 사이트 설정

`hugo.toml` — 제목, 소개 문구, 프로필 항목, 도장 글자, 푸터 문구가 전부 여기 있다.

## 손대면 안 되는 것

- `static/` 안의 폰트·이미지는 빌드 없이 그대로 올라간다
- `public/` 은 빌드 결과물이다. 커밋하지 않는다 (`.gitignore` 에 있다)
