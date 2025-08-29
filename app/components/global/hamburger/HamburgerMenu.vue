<template>
  <transition name="slide-down">
    <aside
      v-show="isOpen"
      class="w-full bg-white dark:bg-dark-knight px-1 hamburger"
    >
      <!-- Mobile Menu -->
      <MobileMenu :nav-items="navItems" :close="close" />
    </aside>
  </transition>
</template>

<script setup lang="ts">
  import MobileMenu from '@/components/global/menus/MobileMenu.vue';

  const { isOpen, navItems, close } = defineProps<{
    navItems: Array<{ label: string; to: string }>;
    isOpen: boolean;
    close: () => void;
  }>();
</script>
