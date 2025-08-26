<template>
  <nav class="bg-white border-b border-light-50 h-12">
    <div class="jonopath-container flex items-center mobcontainer">
      <!-- Hamburger for mobile -->
      <OffcanvasButton
        :offcanvas-is-open="offcanvasIsOpen"
        class="md:hidden"
        @toggle-offcanvas="toggleOffcanvas"
      />

      <!-- Desktop nav list -->
      <div class="scrollable-nav">
        <DesktopMenu
          :nav-items="navItems"
          :offcanvas-is-open="offcanvasIsOpen"
        />
      </div>
    </div>
  </nav>
</template>
<script setup lang="ts">
import OffcanvasButton from "@/components/global/offcanvas/OffcanvasButton.vue";
import DesktopMenu from "@/components/global/menus/DesktopMenu.vue";

// Props
const { navItems, offcanvasIsOpen } = defineProps<{
  navItems: Array<{ label: string; to: string }>;
  offcanvasIsOpen: boolean;
}>();

// Emits
const emit = defineEmits<{ (e: 'toggle-offcanvas'): void }>();

// Alias for cleaner usage
const toggleOffcanvas = () => emit('toggle-offcanvas');
</script>
