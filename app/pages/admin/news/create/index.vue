<template>
  <div>
    <client-only>
      <TiptapEditor />
    </client-only>
  </div>
</template>

<script setup lang="ts">
  import TiptapEditor from '@/components/admin/TiptapEditor.vue';

  definePageMeta({
    layout: 'admin',
  });
</script>
