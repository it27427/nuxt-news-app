<template>
  <button
    type="button"
    class="group w-12 h-12 flex flex-col items-center justify-center relative focus:outline-none focus:ring-0"
    @click="onClick"
  >
    <!-- Hamburger Icon -->
    <template v-if="!isOpen">
      <span
        class="block w-6 h-0.5 mx-auto mb-1 transition-colors duration-300 bg-dark dark:bg-light group-hover:bg-primary group-focus:bg-primary"
      />
      <span
        class="block w-6 h-0.5 mx-auto mb-1 transition-colors duration-300 bg-dark dark:bg-light group-hover:bg-primary group-focus:bg-primary"
      />
      <span
        class="block w-6 h-0.5 mx-auto transition-colors duration-300 bg-dark dark:bg-light group-hover:bg-primary group-focus:bg-primary"
      />
    </template>

    <!-- Close Icon -->
    <template v-else>
      <span
        class="block w-6 h-0.5 mx-auto absolute rotate-45 transition-colors duration-300 bg-dark dark:bg-light group-hover:bg-primary group-focus:bg-primary"
      />
      <span
        class="block w-6 h-0.5 mx-auto absolute -rotate-45 transition-colors duration-300 bg-dark dark:bg-light group-hover:bg-primary group-focus:bg-primary"
      />
    </template>
  </button>
</template>

<script setup lang="ts">
  const { isOpen, onClick } = defineProps<{
    isOpen: boolean;
    onClick: () => void;
  }>();
</script>
