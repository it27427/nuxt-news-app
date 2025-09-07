<template>
  <form
    @submit.prevent="$emit('submit')"
    class="flex flex-col gap-5 bg-white dark:bg-dark p-8 rounded-2xl shadow-md w-full max-w-md"
  >
    <h2 v-if="title" class="text-2xl font-bold text-center mb-4">
      {{ title }}
    </h2>

    <div class="flex flex-col gap-4">
      <slot />
    </div>
  </form>
</template>

<script setup lang="ts">
  interface Props {
    title?: string;
  }

  const props = defineProps<Props>();

  const title = props.title;

  defineEmits(['submit']);
</script>
