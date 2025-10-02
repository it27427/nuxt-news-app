<template>
  <div>
    <client-only>
      <editor-content :editor="editor" />
    </client-only>
  </div>
</template>

<script lang="ts" setup>
import StarterKit from '@tiptap/starter-kit';
import { useEditor } from '@tiptap/vue-3';

const editor = useEditor({
  content: `<p>I'm running Tiptap with Vue.js. 🎉</p>`,
  extensions: [StarterKit],
})
</script>
