<template>
  <Header
    :class="[
      'fixed bottom-0 left-0 w-full z-50 bg-white dark:bg-dark-knight dark:border-dark-divider transition-transform duration-500 ease-in-out',
      show ? 'translate-y-0' : 'translate-y-full',
    ]"
  >
    <SvgIcon />

    <NavBar
      :nav-items="navItems"
      :offcanvas-is-open="offcanvasIsOpen"
      @toggle-offcanvas="toggleOffcanvas"
    />
  </Header>
</template>

<script setup lang="ts">
  import type { NavItem } from '~~/types/global';

  // Props
  const { navItems, offcanvasIsOpen, toggleOffcanvas, show } = defineProps<{
    navItems: Array<NavItem>;
    offcanvasIsOpen: boolean;
    toggleOffcanvas: () => void;
    show: boolean;
  }>();
</script>
