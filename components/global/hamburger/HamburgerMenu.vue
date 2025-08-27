<template>
  <aside v-show="isOpen" class="fixed top-25 left-0 w-full bg-white shadow-lg z-40 px-1 hamburger">
    <!-- Mobile Menu -->
    <MobileMenu :nav-items="navItems" :close="close"/>
  </aside>
</template>

<script setup lang="ts">
import MobileMenu from "@/components/global/menus/MobileMenu.vue";

const { isOpen, navItems, close } = defineProps<{
  navItems: Array<{ label: string; to: string }>;
  isOpen: boolean;
  close: () => void;
}>();
</script>
