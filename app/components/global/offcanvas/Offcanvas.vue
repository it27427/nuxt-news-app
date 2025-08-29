<template>
  <!-- Offcanvas Sidebar -->
  <transition name="slide">
    <OffcanvasSidebar
      v-show="isOpen"
      :is-open="isOpen"
      :nav-items="navItems"
      :close="close"
    />
  </transition>
</template>

<script setup lang="ts">
  import OffcanvasSidebar from '@/components/global/offcanvas/OffcanvasSidebar.vue';

  type NavItem = { label: string; to: string };

  const { isOpen, navItems, close } = defineProps<{
    isOpen: boolean;
    navItems: NavItem[];
    close: () => void;
  }>();
</script>
