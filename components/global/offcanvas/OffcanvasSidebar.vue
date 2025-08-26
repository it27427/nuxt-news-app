<template>
  <aside v-show="isOpen" class="fixed top-15 left-0 w-full bg-white shadow-lg z-50 px-1 offcanvas">
    <!-- Close Button -->
    <div class="flex items-center justify-start w-full h-12 sticky top-0 bg-white">
      <OffcanvasCloseButton :on-click="close"/>
    </div>

    <!-- Mobile Menu -->
    <MobileMenu :nav-items="navItems" :close="close"/>
  </aside>
</template>

<script setup lang="ts">
import OffcanvasCloseButton from "@/components/global/offcanvas/OffcanvasCloseButton.vue";
import MobileMenu from "@/components/global/menus/MobileMenu.vue";

type NavItem = { label: string; to: string };

const { isOpen, navItems, close } = defineProps<{
  isOpen: boolean;
  navItems: NavItem[];
  close: () => void;
}>();
</script>