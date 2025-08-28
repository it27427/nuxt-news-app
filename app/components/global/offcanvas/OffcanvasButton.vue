<template>
  <button
    class="w-12 h-12 flex flex-col items-center justify-center outline-none rounded-md focus:outline-none focus:ring-0"
    @click="emitToggle"
  >
    <span :class="['block w-6 h-0.5 mx-auto bg-dark mb-1 transition-transform duration-300', offcanvasIsOpen ? 'rotate-45 translate-y-2' : '']"/>
    <span :class="['block w-6 h-0.5 mx-auto bg-dark mb-1 transition-opacity duration-300', offcanvasIsOpen ? 'opacity-0' : 'opacity-100']"/>
    <span :class="['block w-6 h-0.5 mx-auto bg-black transition-transform duration-300', offcanvasIsOpen ? '-rotate-45 -translate-y-2' : '']"/>
  </button>
</template>

<script setup lang="ts">
const { offcanvasIsOpen } = defineProps<{ offcanvasIsOpen: boolean }>();
const emit = defineEmits<{ (e: 'toggle-offcanvas'): void }>();

function emitToggle() {
  emit('toggle-offcanvas');
}
</script>
