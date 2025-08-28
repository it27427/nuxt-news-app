<template>
  <Header
    :class="[
      'fixed bottom-0 left-0 w-full z-50 bg-white dark:bg-dark-bg shadow-lg transition-transform duration-500 ease-in-out',
      show ? 'translate-y-0' : 'translate-y-full',
    ]"
  >
    <NavBar
      :nav-items="navItems"
      :offcanvas-is-open="offcanvasIsOpen"
      @toggle-offcanvas="toggleOffcanvas"
    />
  </Header>
</template>

<script setup lang="ts">
  import Header from '@/components/global/layouts/Header.vue';
  import NavBar from '@/components/global/NavBar.vue';

  // Props
  const { navItems, offcanvasIsOpen, toggleOffcanvas, show } = defineProps<{
    navItems: Array<{ label: string; to: string }>;
    offcanvasIsOpen: boolean;
    toggleOffcanvas: () => void;
    show: boolean;
  }>();
</script>
