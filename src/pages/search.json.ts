import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';

export const GET: APIRoute = async () => {
  const posts = (await getCollection('blog', ({ data }) => !data.draft))
    .sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());

  const index = posts.map((p) => ({
    id: p.id,
    title: p.data.title,
    description: p.data.description ?? '',
    category: p.data.category ?? '',
    tags: p.data.tags,
    pubDate: p.data.pubDate.toISOString(),
  }));

  return new Response(JSON.stringify(index), {
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });
};
