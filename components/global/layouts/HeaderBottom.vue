<template>
  <Header
    :class="[
      'fixed bottom-0 left-0 w-full z-50 bg-white shadow-lg transition-transform duration-500 ease-in-out',
      show ? 'translate-y-0' : 'translate-y-full'
    ]"
  >
    <NavBar
      :nav-items="navItems"
      :collapse-menu-is-open="collapseMenuIsOpen"
      :offcanvas-is-open="offcanvasIsOpen"
      :toggle-collapse-menu="toggleCollapseMenu"
      :toggle-offcanvas="handleToggleOffcanvas"
      :show="show"
    />
  </Header>
</template>

<script setup lang="ts">
import NavBar from '@/components/global/NavBar.vue';

const { navItems, collapseMenuIsOpen, offcanvasIsOpen, toggleCollapseMenu, show } = defineProps<{
  navItems: { label: string; to: string }[];
  collapseMenuIsOpen: boolean;
  offcanvasIsOpen: boolean;
  toggleCollapseMenu: () => void;
  show: boolean | null;
}>()

const emit = defineEmits<{ (e: 'toggle-offcanvas'): void }>();

const handleToggleOffcanvas = () => emit('toggle-offcanvas');
</script>
