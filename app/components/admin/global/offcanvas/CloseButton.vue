<template>
  <Button
    class="group w-12 h-12 flex items-center justify-center relative focus:outline-none focus:ring-0"
    type="button"
    @click="$emit('close')"
  >
    <span
      class="block w-6 h-0.5 mx-auto absolute rotate-45 transition-colors duration-300 bg-dark dark:bg-light group-hover:bg-primary group-focus:bg-primary"
    />
    <span
      class="block w-6 h-0.5 mx-auto absolute -rotate-45 transition-colors duration-300 bg-dark dark:bg-light group-hover:bg-primary group-focus:bg-primary"
    />
  </Button>
</template>

<script lang="ts" setup>
  defineEmits<{
    (e: 'close'): void;
  }>();
</script>
