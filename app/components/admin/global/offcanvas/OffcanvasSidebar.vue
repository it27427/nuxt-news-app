<template>
  <Teleport to="body">
    <transition name="slide">
      <aside
        v-show="isOpen"
        class="bg-light dark:bg-gray-900 dark:text-white h-screen fixed top-20 left-0 transition-transform duration-300 z-60"
        :class="[isOpen ? 'translate-x-0 w-64' : 'translate-x-full w-20']"
      >
        <slot />
      </aside>
    </transition>
  </Teleport>
</template>

<script setup lang="ts">
  const props = defineProps<{
    isOpen: boolean;
  }>();

  const emit = defineEmits<{
    (e: 'close'): void;
  }>();
</script>

<style scoped>
  .slide-enter-from,
  .slide-leave-to {
    transform: translateX(-100%);
  }
  .slide-enter-to,
  .slide-leave-from {
    transform: translateX(0);
  }
  .slide-enter-active,
  .slide-leave-active {
    transition: transform 0.3s ease;
  }
</style>
