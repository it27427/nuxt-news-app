<template>
  <form
    @submit.prevent="$emit('submit')"
    class="flex flex-col gap-5 bg-white dark:bg-dark p-8 rounded-2xl shadow-md w-full max-w-md"
  >
    <h2 v-if="title" class="text-2xl font-bold text-center mb-4">
      {{ title }}
    </h2>

    <slot />

    <button
      type="submit"
      class="w-full py-2 px-4 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700"
    >
      {{ submitText }}
    </button>
  </form>
</template>

<script setup lang="ts">
  interface Props {
    title?: string;
    submitText?: string;
  }

  defineProps<Props>();
  defineEmits(['submit']);
</script>
