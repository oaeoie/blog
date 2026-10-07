# verbum (정적 블로그)

Ghost에서 넘어온 개인 블로그. Hugo + GitHub Pages.

- 주소: https://oaeoie.github.io/blog/
- 테마: retro-paper (2000년대 감성 종이 질감 · 픽셀 폰트 · 공사중 도장 · 키리반 카운터 · 박수)
- 폰트: Galmuri11 (자체 호스팅, `static/fonts/`)
- 배포: `main` 브랜치에 push하면 GitHub Actions가 빌드해서 Pages에 올린다.

## 로컬 빌드

```bash
hugo server -D
hugo --minify          # public/ 에 결과물
```

## 글 쓰기

```bash
hugo new content posts/새-글.md
```
