// Join a path onto Astro's BASE_URL safely, regardless of whether
// BASE_URL has a trailing slash. Always returns a path starting with `/`.
const BASE = import.meta.env.BASE_URL.replace(/\/$/, '');

export function withBase(path: string): string {
  if (!path.startsWith('/')) path = '/' + path;
  return BASE + path;
}
