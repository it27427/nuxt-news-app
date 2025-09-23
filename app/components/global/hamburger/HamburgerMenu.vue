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
  import type { NavItem } from '~~/types/global';

  const { isOpen, navItems, close } = defineProps<{
    navItems: Array<NavItem>;
    isOpen: boolean;
    close: () => void;
  }>();
</script>
