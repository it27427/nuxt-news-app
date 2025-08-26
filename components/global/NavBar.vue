<template>
  <nav class="bg-white border-b border-light-50 h-12">
    <div class="jonopath-container flex items-center mobcontainer">
      <!-- Hamburger (Mobile) -->
      <div class="md:hidden">
        <Hamburger
          :is-open="collapseMenuIsOpen"
          @toggle="toggleCollapseMenu"
        />
      </div>

      <!-- Hamburger Menu -->
      <HamburgerMenu
        v-if="collapseMenuIsOpen"
        :is-open="collapseMenuIsOpen"
        :nav-items="navItems"
        :close="toggleCollapseMenu"
        class="md:hidden"
      />

      <!-- Offcanvas (Mobile) -->
      <OffcanvasButton
        :offcanvas-is-open="offcanvasIsOpen"
        class="md:hidden"
        @toggle-offcanvas="toggleOffcanvas"
      />

      <!-- Desktop Menu -->
      <div class="scrollable-nav">
        <DesktopMenu
          :nav-items="navItems"
        />
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import Hamburger from "@/components/global/hamburger/Hamburger.vue";
import HamburgerMenu from "@/components/global/hamburger/HamburgerMenu.vue";
import OffcanvasButton from "@/components/global/offcanvas/OffcanvasButton.vue";
import DesktopMenu from "@/components/global/menus/DesktopMenu.vue";

// Props
const { navItems, collapseMenuIsOpen, offcanvasIsOpen, toggleCollapseMenu } = defineProps<{
  navItems: Array<{ label: string; to: string }>;
  collapseMenuIsOpen: boolean;
  offcanvasIsOpen: boolean;
  toggleCollapseMenu: () => void;
}>();

// Emits
const emit = defineEmits<{ (e: 'toggle-offcanvas'): void }>();

// Toggle Offcanvas
const toggleOffcanvas = () => emit('toggle-offcanvas');
</script>
