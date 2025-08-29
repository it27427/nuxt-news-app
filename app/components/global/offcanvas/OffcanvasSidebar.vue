<template>
  <aside
    v-show="isOpen"
    class="fixed top-0 left-0 w-full bg-white dark:bg-dark-knight shadow-lg z-40 offcanvas"
  >
    <!-- Close Button -->
    <div
      class="flex items-center justify-start w-full h-12 sticky top-0 bg-white dark:bg-dark-knight px-1"
    >
      <OffcanvasCloseButton :is-open="isOpen" :on-click="close" />
    </div>

    <!-- Mobile Menu -->
    <div class="px-1">
      <MobileMenu :nav-items="navItems" :close="close" />
    </div>
  </aside>
</template>

<script setup lang="ts">
  import MobileMenu from '@/components/global/menus/MobileMenu.vue';
  import OffcanvasCloseButton from '@/components/global/offcanvas/OffcanvasCloseButton.vue';

  type NavItem = { label: string; to: string };

  const { isOpen, navItems, close } = defineProps<{
    isOpen: boolean;
    navItems: NavItem[];
    close: () => void;
  }>();
</script>
