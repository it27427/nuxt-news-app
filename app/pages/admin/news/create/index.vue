<template>
  <section>
    <client-only>
      <QuillEditor v-model:content="body" />
    </client-only>
  </section>
</template>

<script lang="ts" setup>
  import QuillEditor from '@/components/admin/QuillEditor.vue';
  import { ref } from 'vue';

  definePageMeta({
    layout: 'admin',
  });

  const body = ref('');
</script>

<style lang="scss" scoped>
  :deep(.ql-editor) {
    min-height: 12.5rem;
  }

  :deep(.ql-toolbar.ql-snow) {
    border-top-left-radius: 0.3125rem;
    border-top-right-radius: 0.3125rem;
  }

  :deep(.ql-container.ql-snow) {
    border-bottom-left-radius: 0.3125rem;
    border-bottom-right-radius: 0.3125rem;
  }
</style>
