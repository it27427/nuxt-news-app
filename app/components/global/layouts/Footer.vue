<template>
  <footer class="bg-dark text-white">
    <!-- FOOTER-TOPBAR -->
    <FooterTopBar />

    <!-- FOOTER-CONTAINER -->
    <div class="jonopath-container pt-2">
      <!-- FOOTER-MENU -->
      <FooterMenu :nav-items="navItems" />

      <!-- COPYRIGHT -->
      <div class="flex items-center justify-center border-t border-dark-border h-12">
        <Copyright />
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import Copyright from "@/components/global/Copyright.vue";
import FooterTopBar from "@/components/global/FooterTopBar.vue";
import FooterMenu from "@/components/global/menus/FooterMenu.vue";

type NavItem = { label: string; to: string };

// Define Props
const { navItems } = defineProps<{
  navItems: NavItem[];
}>();
</script>
