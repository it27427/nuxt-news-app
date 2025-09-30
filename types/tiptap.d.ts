// types/tiptap.d.ts

import type { SetImageOptions } from '@tiptap/extension-image';
import type { SetYoutubeVideoOptions } from '@tiptap/extension-youtube';
import type { DefineComponent } from 'vue';

export interface CustomImageOptions extends SetImageOptions {
  caption?: string | null;
  source?: string | null;
}

export interface CustomYoutubeOptions extends SetYoutubeVideoOptions {
  caption?: string | null;
  source?: string | null;
  videoLength?: string | null;
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    image: {
      setImage: (options: CustomImageOptions) => ReturnType;
    };
    youtube: {
      setYoutubeVideo: (options: CustomYoutubeOptions) => ReturnType;
    };
  }
}

declare module '@tiptap/vue-3' {
  export const BubbleMenu: DefineComponent<any, any, any>;
  export const FloatingMenu: DefineComponent<any, any, any>;
}
