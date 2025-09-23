<template>
  <Button
    type="button"
    @click="$emit('open')"
    class="text-dark-surface hover:text-primary dark:text-light dark:hover:text-white transition-colors duration-500 mt-2.5"
  >
    <client-only>
      <Icon
        name="bitcoin-icons:menu-outline"
        width="28"
        height="28"
        class="text-3xl"
      />
    </client-only>
  </Button>
</template>

<script lang="ts" setup>
  defineEmits<{
    (e: 'open'): void;
  }>();
</script>
