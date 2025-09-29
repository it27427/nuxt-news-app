// types/tiptap.d.ts

import type { SetImageOptions } from '@tiptap/extension-image';
import type { SetYoutubeVideoOptions } from '@tiptap/extension-youtube';
import type { DefineComponent } from 'vue';

export interface CustomImageOptions extends SetImageOptions {
  src: string;
  caption?: string | null;
  source?: string | null;
}

export interface CustomYoutubeOptions extends SetYoutubeVideoOptions {
  src: string;
  caption?: string | null;
  source?: string | null;
  videoLength?: string | null;
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    setImage: (options: CustomImageOptions) => ReturnType;
    setYoutubeVideo: (options: CustomYoutubeOptions) => ReturnType;
  }

  interface NodeAttributes {
    image: CustomImageOptions;
    youtube: CustomYoutubeOptions;
  }
}

declare module '@tiptap/vue-3' {
  export const BubbleMenu: DefineComponent<any, any, any>;
  export const FloatingMenu: DefineComponent<any, any, any>;
}
