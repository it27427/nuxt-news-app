<template>
  <div v-if="jsonContent" class="tiptap-renderer-content">
    <ClientOnly>
      <EditorContent :editor="readOnlyEditor" />
    </ClientOnly>
  </div>
  <div v-else>{{ fallbackText }}</div>
</template>

<script setup lang="ts">
  import { EditorContent, useEditor, type JSONContent } from '@tiptap/vue-3';

  import { FontFamily } from '@tiptap/extension-font-family';
  import { Highlight } from '@tiptap/extension-highlight';
  import { Link } from '@tiptap/extension-link';
  import { TextStyle } from '@tiptap/extension-text-style';
  import { Underline } from '@tiptap/extension-underline';
  import StarterKit from '@tiptap/starter-kit';

  const props = defineProps<{
    jsonContent: JSONContent;
    fallbackText?: string;
  }>();

  const readOnlyEditor = useEditor({
    content: props.jsonContent,
    extensions: [
      StarterKit.configure({ link: false, underline: false }),
      TextStyle,
      FontFamily,
      Underline,
      Highlight,
      Link.configure({ openOnClick: false }),
    ],
    editable: false,
  });
</script>

<style lang="scss" scoped>
  .tiptap-renderer-content :deep(.ProseMirror) {
    @apply text-base text-gray-700 dark:text-gray-300;
    p {
      @apply m-0 line-clamp-2;
    }
    h1,
    h2,
    h3,
    h4,
    h5,
    h6 {
      @apply m-0 font-normal;
    }
  }
</style>
