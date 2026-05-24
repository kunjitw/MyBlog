# blog

紅隊雜記 — Astro + GitHub Pages.

## 寫文章

把 `.md` (或 `.mdx`) 丟到 `src/content/blog/`,frontmatter 用:

```yaml
---
title: "標題"
description: "可選的摘要"
pubDate: 2026-05-22
updatedDate: 2026-05-23   # 可選
tags: [ad, privesc]
draft: false              # true 的話 build 時會被排除
---
```

檔名就是網址 slug,例如 `ad-cs-esc1.md` → `/blog/ad-cs-esc1/`。

## 本地開發

```powershell
npm run dev      # http://localhost:4321
npm run build    # 產生 ./dist
npm run preview  # 預覽 build 結果
```

## 部署到 GitHub Pages

1. 在 GitHub 開一個 repo (預設叫 `blog`)。
2. 推上去:
   ```powershell
   git remote add origin https://github.com/kunjitw/blog.git
   git push -u origin main
   ```
3. 到 repo **Settings → Pages → Source** 選 **GitHub Actions**。
4. 每次 push 到 `main`,`.github/workflows/deploy.yml` 會自動 build + 部署。

部署網址:`https://kunjitw.github.io/blog/`

## 綁自訂網域

買到網域後:

1. 在 DNS 商加紀錄:
   - **apex (例: `kunji.tw`)**: 4 個 A records 指到
     `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
   - **www / subdomain (例: `blog.kunji.tw`)**: CNAME 指到 `kunjitw.github.io`
2. 在 GitHub repo **Settings → Pages → Custom domain** 填網域,勾 **Enforce HTTPS**
   (這會自動建立 `public/CNAME`,也可以手動建)。
3. 修 `astro.config.mjs`:
   ```js
   site: 'https://kunji.tw',
   base: '/',
   ```
4. push,完工。

## 結構速覽

```
src/
├── consts.ts              # 站名、作者、社群連結 — 改這個就好
├── content.config.ts      # 文章 frontmatter schema
├── content/blog/*.md      # 你的文章
├── styles/global.css      # 全站樣式 + CSS 變數(改色用)
├── components/            # Header / Footer / FormattedDate
├── layouts/
│   ├── BaseLayout.astro   # 全站 HTML 骨架
│   └── PostLayout.astro   # 文章專用
└── pages/
    ├── index.astro        # 首頁 (文章列表)
    ├── about.astro
    ├── rss.xml.ts         # RSS feed
    └── blog/[...slug].astro
```
