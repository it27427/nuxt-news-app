<template>
  <form
    @submit.prevent="$emit('submit')"
    class="flex flex-col gap-5 bg-white dark:bg-dark p-8 rounded-2xl shadow-md w-full max-w-md"
  >
    <slot />
  </form>
</template>

<script setup lang="ts">
  defineEmits(['submit']);
</script>
