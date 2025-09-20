<template>
  <form
    @submit="onSubmit"
    class="flex flex-col gap-5 bg-white dark:bg-dark p-8 rounded-2xl shadow-md w-full"
  >
    <slot />
  </form>
</template>

<script setup lang="ts">
  const emit = defineEmits(['submit']);

  function onSubmit(event: Event) {
    event.preventDefault();
    emit('submit', event);
  }
</script>
