<template>
  <button
    type="button"
    class="w-10 h-10 flex items-center justify-center relative focus:outline-none"
    :aria-expanded="isOpen"
    aria-label="Toggle menu"
    @click="emitToggle"
  >
    <!-- Hamburger Icon -->
    <template v-if="!isOpen">
      <span class="block w-6 h-0.5 bg-dark mb-1"/>
      <span class="block w-6 h-0.5 bg-dark mb-1"/>
      <span class="block w-6 h-0.5 bg-dark"/>
    </template>

    <!-- Close Icon -->
    <template v-else>
      <span class="block w-6 h-0.5 bg-dark rotate-45 absolute"/>
      <span class="block w-6 h-0.5 bg-dark -rotate-45 absolute"/>
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

<style scoped>
button {
  position: relative;
}
</style>
