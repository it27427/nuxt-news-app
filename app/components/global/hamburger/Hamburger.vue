<template>
  <button
    type="button"
    class="btn-hamburger group w-12 h-12 flex flex-col items-center justify-center relative focus:outline-none"
    :aria-expanded="isOpen"
    aria-label="Toggle menu"
    @click="emitToggle"
  >
    <!-- Hamburger Icon -->
    <template v-if="!isOpen">
      <span
        class="block w-6 h-0.5 mx-auto mb-1 transition-all bg-dark dark:bg-light group-hover:bg-primary group-focus:bg-primary"
      />
      <span
        class="block w-6 h-0.5 mx-auto mb-1 transition-all bg-dark dark:bg-light group-hover:bg-primary group-focus:bg-primary"
      />
      <span
        class="block w-6 h-0.5 mx-auto transition-all bg-dark dark:bg-light group-hover:bg-primary group-focus:bg-primary"
      />
    </template>

    <!-- Close Icon -->
    <template v-else>
      <span
        class="block w-6 h-0.5 mx-auto absolute rotate-45 transition-all bg-dark dark:bg-light group-hover:bg-primary group-focus:bg-primary"
      />
      <span
        class="block w-6 h-0.5 mx-auto absolute -rotate-45 transition-all bg-dark dark:bg-light group-hover:bg-primary group-focus:bg-primary"
      />
    </template>
  </button>
</template>

<script setup lang="ts">
  const { isOpen } = defineProps<{
    isOpen: boolean;
  }>();

  const emit = defineEmits<{ (e: 'toggle'): void }>();

  const emitToggle = () => emit('toggle');
</script>
