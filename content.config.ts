import { defineCollection, defineContentConfig, z } from '@nuxt/content';

export default defineContentConfig({
  collections: {
    nav: defineCollection({
      type: 'data',
      schema: z.object({
        name: z.string(),
        url: z.string().url()
      })
    }),

    docs: defineCollection({
      source: '**/*.md',
      type: 'page'
    }),

    blog: defineCollection({
      type: 'page',
      source: 'blog/*.md',
      schema: z.object({
        tags: z.array(z.string()),
        image: z.string(),
        date: z.date()
      })
    }),

    data: defineCollection({
      type: 'page',
      source: {
        repository: 'https://github.com/bbc/simorgh/blob/latest/data/bengali/homePage/index.json',
        include: '*.json',
      },
    }),

    articles: defineCollection({
      type: 'page',
      source: {
        repository: 'https://github.com/bbc/simorgh/blob/latest/data/bengali/articles/c6p3yp5zzmeo.json',
        include: '*.json',
      },
    }),

    live: defineCollection({
      type: 'page',
      source: {
        repository: 'https://github.com/bbc/simorgh/blob/latest/data/bengali/bbc_bangla_radio/liveradio.json',
        include: '*.json',
      },
    }),

    mostRead: defineCollection({
      type: 'page',
      source: {
        repository: 'https://github.com/bbc/simorgh/blob/latest/data/bengali/mostRead/index.json',
        include: '*.json',
      },
    }),

    secondaryColumn: defineCollection({
      type: 'page',
      source: {
        repository: 'https://github.com/bbc/simorgh/blob/latest/data/bengali/secondaryColumn/index.json',
        include: '*.json',
      },
    }),
  }
});
