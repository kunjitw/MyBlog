// @ts-check
import { defineConfig } from 'astro/config';

import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

// Custom domain — the site is served at https://kunji.tw via GitHub
// Pages (with public/CNAME pointing the deploy at the same domain and
// the apex DNS records pointed at GitHub's Pages IPs).
export default defineConfig({
  site: 'https://kunji.tw',
  base: '/',
  integrations: [mdx(), sitemap()],
  markdown: {
    shikiConfig: {
      // Pick any built-in theme: https://shiki.style/themes
      theme: 'github-dark-dimmed',
      wrap: true,
    },
  },
});
