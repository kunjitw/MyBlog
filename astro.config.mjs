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
      // Dual themes — token colours follow the site theme. Shiki emits
      // both palettes as CSS variables (--shiki-dark etc.); global.css
      // switches them under [data-theme="dark"]. Without this, dark-theme
      // pastel tokens would sit on the light --code-bg and be unreadable.
      themes: {
        light: 'github-light',
        dark: 'github-dark-dimmed',
      },
      defaultColor: 'light',
      wrap: true,
    },
  },
});
