<template>
  <nav
    class="bg-white border-b border-light-50 dark:bg-dark-surface dark:border-dark-divider h-12"
  >
    <div class="jonopath-container flex items-center mobcontainer">
      <!-- Offcanvas (Mobile) -->
      <div class="md:hidden">
        <OffcanvasButton
          :offcanvas-is-open="offcanvasIsOpen"
          @toggle-offcanvas="toggleOffcanvas"
        />
      </div>

      <!-- Desktop Menu -->
      <div class="scrollable-nav">
        <DesktopMenu :nav-items="navItems" />
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
  import DesktopMenu from '@/components/global/menus/DesktopMenu.vue';
  import OffcanvasButton from '@/components/global/offcanvas/OffcanvasButton.vue';

  // Props (collapseMenu optional for bottom header)
  const { navItems, offcanvasIsOpen } = defineProps<{
    navItems: { label: string; to: string }[];
    offcanvasIsOpen: boolean;
  }>();

  // Emits
  const emit = defineEmits<{
    (e: 'toggle-offcanvas'): void;
  }>();

  // Toggle Offcanvas
  const toggleOffcanvas = () => emit('toggle-offcanvas');
</script>
