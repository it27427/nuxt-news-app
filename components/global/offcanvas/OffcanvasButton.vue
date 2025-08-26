<template>
  <button
    class="p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
    @click="emitToggle"
  >
    <span :class="['block w-6 h-0.5 bg-black mb-1 transition-transform duration-300', offcanvasIsOpen ? 'rotate-45 translate-y-2' : '']"/>
    <span :class="['block w-6 h-0.5 bg-black mb-1 transition-opacity duration-300', offcanvasIsOpen ? 'opacity-0' : 'opacity-100']"/>
    <span :class="['block w-6 h-0.5 bg-black transition-transform duration-300', offcanvasIsOpen ? '-rotate-45 -translate-y-2' : '']"/>
  </button>
</template>

<script setup lang="ts">
const { offcanvasIsOpen } = defineProps<{ offcanvasIsOpen: boolean }>();
const emit = defineEmits<{ (e: 'toggle-offcanvas'): void }>();

function emitToggle() {
  emit('toggle-offcanvas');
}
</script>
