<template>
  <Teleport to="body">
    <transition name="slide">
      <aside
        v-show="props.isOpen"
        class="bg-light dark:bg-gray-900 dark:text-white fixed top-20 left-0 z-60 flex flex-col transition-all duration-300"
        :class="[props.isCollapsed ? 'w-64 h-screen-fit' : 'w-20 h-screen-fit']"
      >
        <slot />
      </aside>
    </transition>
  </Teleport>
</template>

<script setup lang="ts">
  const props = defineProps<{
    isOpen: boolean;
    isCollapsed?: boolean;
  }>();

  const emit = defineEmits<{
    (e: 'close'): void;
  }>();
</script>

<style lang="scss" scoped>
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
