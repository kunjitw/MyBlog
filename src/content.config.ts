import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
  loader: glob({ base: './src/content/blog', pattern: '**/*.{md,mdx}' }),
  // Accepts BOTH formats:
  //   native  — pubDate / category / tags: [a, b]
  //   Jekyll  — date / categories / tags: "a b c"  (space-separated)
  // The transform normalises everything to: pubDate, category, tags[].
  schema: z
    .object({
      title: z.string(),
      description: z.string().optional(),
      pubDate: z.coerce.date().optional(),
      date: z.coerce.date().optional(),
      updatedDate: z.coerce.date().optional(),
      category: z.string().optional(),
      categories: z.string().optional(),
      tags: z.union([z.array(z.string()), z.string()]).optional(),
      draft: z.boolean().default(false),
      layout: z.string().optional(),
    })
    .transform((d) => ({
      title: d.title,
      description: d.description,
      pubDate: d.pubDate ?? d.date ?? new Date(),
      updatedDate: d.updatedDate,
      category:
        d.category ??
        (d.categories ? d.categories.trim().split(/\s+/)[0] : undefined),
      tags: Array.isArray(d.tags)
        ? d.tags
        : typeof d.tags === 'string'
          ? d.tags.trim().split(/\s+/).filter(Boolean)
          : [],
      draft: d.draft,
    })),
});

export const collections = { blog };
