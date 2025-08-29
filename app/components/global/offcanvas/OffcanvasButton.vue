<template>
  <button
    class="btn-offcanvas group w-12 h-12 flex flex-col items-center justify-center outline-none rounded-md focus:outline-none focus:ring-0"
    @click="emitToggle"
  >
    <!-- Top Line -->
    <span
      :class="[
        'block w-6 h-0.5 mx-auto mb-1 transition-all duration-300',
        'bg-dark dark:bg-light group-hover:bg-primary group-focus:bg-primary',
        offcanvasIsOpen ? 'rotate-45 translate-y-2' : '',
      ]"
    />

    <!-- Middle Line -->
    <span
      :class="[
        'block w-6 h-0.5 mx-auto mb-1 transition-all duration-300',
        'bg-dark dark:bg-light group-hover:bg-primary group-focus:bg-primary',
        offcanvasIsOpen ? 'opacity-0' : 'opacity-100',
      ]"
    />

    <!-- Bottom Line -->
    <span
      :class="[
        'block w-6 h-0.5 mx-auto transition-all duration-300',
        'bg-dark dark:bg-light group-hover:bg-primary group-focus:bg-primary',
        offcanvasIsOpen ? '-rotate-45 -translate-y-2' : '',
      ]"
    />
  </button>
</template>

<script setup lang="ts">
  const { offcanvasIsOpen } = defineProps<{ offcanvasIsOpen: boolean }>();
  const emit = defineEmits<{ (e: 'toggle-offcanvas'): void }>();

  function emitToggle() {
    emit('toggle-offcanvas');
  }
</script>
