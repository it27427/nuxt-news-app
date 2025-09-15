<template>
  <Button type="button" @click="$emit('open')">✕ Close</Button>
</template>

<script lang="ts" setup>
  import Button from '@/components/admin/global/Button.vue';

  defineEmits<{
    (e: 'open'): void;
  }>();
</script>
