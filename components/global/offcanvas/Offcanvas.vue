<template>
  <div>
    <!-- Overlay -->
    <OffcanvasOverlay :is-open="isOpen" :on-click="close"/>

    <!-- Offcanvas Sidebar -->
    <transition name="slide">
      <OffcanvasSidebar v-show="isOpen" :is-open="isOpen" :nav-items="navItems" :close="close"/>
    </transition>
  </div>
</template>

<script setup lang="ts">
import OffcanvasSidebar from '@/components/global/offcanvas/OffcanvasSidebar.vue';
import OffcanvasOverlay from '@/components/global/offcanvas/OffcanvasOverlay.vue';

type NavItem = { label: string; to: string; };

const { isOpen, navItems, close } = defineProps<{
  isOpen: boolean;
  navItems: NavItem[];
  close: () => void;
}>();
</script>

<style scoped>
.slide-enter-from {
  transform: translateX(-100%);
}

.slide-enter-to {
  transform: translateX(0);
}

.slide-leave-from {
  transform: translateX(0);
}

.slide-leave-to {
  transform: translateX(-100%);
}

.slide-enter-active,
.slide-leave-active {
  transition: transform 0.3s ease;
}
</style>
