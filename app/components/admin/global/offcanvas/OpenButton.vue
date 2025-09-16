<template>
  <Button type="button" @click="$emit('open')">Open</Button>
</template>

<script lang="ts" setup>
  import Button from '@/components/admin/global/Button.vue';

  defineEmits<{
    (e: 'open'): void;
  }>();
</script>
