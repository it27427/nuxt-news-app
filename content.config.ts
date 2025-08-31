import { defineCollection, defineContentConfig, z } from '@nuxt/content';

export default defineContentConfig({
  collections: {
    nav: defineCollection({
      type: 'data',
      source: 'nav/**.json',
      schema: z.object({
        navItems: z.array(
          z.object({
            label: z.string(),
            to: z.string().url(),
          })
        ),
        footerNavItems: z.array(
          z.object({
            label: z.string(),
            to: z.string(),
          })
        ),
      }),
    }),

    /**HOME-PAGE */
    home: defineCollection({
      source: 'home/**.json',
      type: 'page',
    }),

    /** MAIN NEWS DATA */
    mainNews: defineCollection({
      type: 'data',
      source: 'home/mainNews.json',
      schema: z.object({
        data: z.array(
          z.object({
            _id: z.string(),
            title: z.string(),
            description: z.string(),
            image_url: z.string(),
            post_time: z.string(),
          })
        ),
      }),
    }),

    /**TOPICS-PAGE */
    topics: defineCollection({
      type: 'page',
      source: 'topics/**.json',
    }),

    /**INSTITUTIONAL-PAGE */
    institutional: defineCollection({
      type: 'page',
      source: 'institutional/**.json',
    }),

    /**ARTICLE-DETAILS-PAGE */
    article: defineCollection({
      type: 'page',
      source: 'article/**.json',
    }),

    /**VIDEO-DETAILS-PAGE */
    video: defineCollection({
      type: 'page',
      source: 'video/**.json',
    }),
  },
});
