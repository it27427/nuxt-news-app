<template>
  <Header :class="[show ? 'translate-y-0 fixed top-0 left-0 w-full z-50' : '-translate-y-full']">
    <NavBar
      :nav-items="navItems"
      :collapse-menu-is-open="collapseMenuIsOpen"
      :offcanvas-is-open="offcanvasIsOpen"
      :toggle-collapse-menu="toggleCollapseMenu"
      :show="show"
    />
  </Header>
</template>

<script setup lang="ts">
import NavBar from '@/components/global/NavBar.vue';

import type { PropType } from 'vue';

interface NavItem {
  label: string;
  to: string;
}

const { navItems, collapseMenuIsOpen, offcanvasIsOpen, toggleCollapseMenu, show } = defineProps(
  {
    navItems: {
      type: Array as PropType<NavItem[]>,
      required: true
    },
    collapseMenuIsOpen: {
      type: Boolean,
      required: true
    },
    offcanvasIsOpen: {
      type: Boolean,
      required: true
    },
    toggleCollapseMenu: {
      type: Function as PropType<() => void>,
      required: true
    },
    show: {
      type: Boolean as PropType<boolean | null>,
      required: true
    }
  }
)
</script>

