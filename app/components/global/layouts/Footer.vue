<template>
  <footer class="bg-dark-knight text-white">
    <!-- FOOTER-TOPBAR (without DarkMode) -->
    <TopBar />

    <!-- FOOTER-CONTAINER -->
    <div class="jonopath-container pt-5 pb-1">
      <!-- FOOTER-MENU -->
      <FooterMenu :nav-items="navItems" />

      <!-- COPYRIGHT -->
      <div
        class="flex items-center justify-center border-t border-dark-divider h-12"
      >
        <Copyright />
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
  import Copyright from '@/components/global/Copyright.vue';
  import FooterMenu from '@/components/global/menus/FooterMenu.vue';
  import TopBar from '@/components/global/TopBar.vue';
  import type { NavItem } from '~~/types/global';

  // Define Props
  const { navItems } = defineProps<{
    navItems: NavItem[];
  }>();
</script>
