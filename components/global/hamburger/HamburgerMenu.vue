<template>
  <transition name="slide-down">
    <aside v-show="isOpen" class="w-full bg-white px-1 hamburger">
      <!-- Mobile Menu -->
      <MobileMenu :nav-items="navItems" :close="close"/>
    </aside>
  </transition>
</template>

<script setup lang="ts">
import MobileMenu from "@/components/global/menus/MobileMenu.vue";

const { isOpen, navItems, close } = defineProps<{
  navItems: Array<{ label: string; to: string }>;
  isOpen: boolean;
  close: () => void;
}>();
</script>

<style scoped>
/* Slide Down Animation */
.collapse-enter-from,
.collapse-leave-to {
  max-height: 0;
}

.collapse-enter-to,
.collapse-leave-from {
  max-height: 36.5rem;
}

.collapse-enter-active,
.collapse-leave-active {
  transition: max-height 0.3s ease;
  overflow: hidden;
}
</style>