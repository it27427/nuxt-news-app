import { defineCollection, defineContentConfig, z } from '@nuxt/content';

const pageSchema = z.object({
  path: z.string(),
  title: z.string(),
  description: z.string(),
  seo: z
    .intersection(
      z.object({
        title: z.string().optional(),
        description: z.string().optional(),
        meta: z.array(z.record(z.string(), z.any())).optional(),
        link: z.array(z.record(z.string(), z.any())).optional(),
      }),
      z.record(z.string(), z.any())
    )
    .optional()
    .default({}),
  body: z.object({
    type: z.string(),
    children: z.any(),
    toc: z.any(),
  }),
  navigation: z
    .union([
      z.boolean(),
      z.object({
        items: z.array(
          z.object({
            name: z.string(),
            url: z.string().url(),
          })
        ),
      }),
    ])
    .default(true),
});

export default defineContentConfig({
  collections: {
    nav: defineCollection({
      type: 'data',
      source: 'nav/**.json',
      schema: z.object({
        items: z.array(
          z.object({
            name: z.string(),
            url: z.string().url(),
          })
        ),
      }),
    }),

    /**HOME-PAGE */
    home: defineCollection({
      source: 'home/**.json',
      type: 'page',
      schema: pageSchema,
    }),

    /**TOPICS-PAGE */
    topics: defineCollection({
      type: 'page',
      source: 'topics/**.json',
      schema: pageSchema,
    }),

    /**INSTITUTIONAL-PAGE */
    institutional: defineCollection({
      type: 'page',
      source: 'institutional/**.json',
      schema: pageSchema,
    }),

    /**ARTICLE-DETAILS-PAGE */
    article: defineCollection({
      type: 'page',
      source: 'article/**.json',
      schema: pageSchema,
    }),

    /**VIDEO-DETAILS-PAGE */
    video: defineCollection({
      type: 'page',
      source: 'video/**.json',
      schema: pageSchema,
    }),
  },
});
