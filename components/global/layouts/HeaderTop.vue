<template>
  <Header v-if="clientShow">
    <nav class="bg-white border-b border-light-50 h-12">
      <div class="jonopath-container flex items-center mobcontainer">
        <!-- Hamburger (Mobile) -->
        <div class="md:hidden">
          <Hamburger :is-open="collapseMenuIsOpen" @toggle="toggleCollapseMenu" />
        </div>

        <!-- Mobile Menu -->
        <HamburgerMenu
          v-if="collapseMenuIsOpen"
          :is-open="collapseMenuIsOpen"
          :nav-items="navItems"
          :close="toggleCollapseMenu"
          class="md:hidden"
        />

        <!-- Desktop Menu -->
        <div class="scrollable-nav">
          <DesktopMenu
            :nav-items="navItems"
          />
        </div>
      </div>
    </nav>
  </Header>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import Header from "@/components/global/layouts/Header.vue";
import Hamburger from "@/components/global/hamburger/Hamburger.vue";
import HamburgerMenu from "@/components/global/hamburger/HamburgerMenu.vue";
import DesktopMenu from "@/components/global/menus/DesktopMenu.vue";

// Props from parent
const {
  navItems,
  collapseMenuIsOpen,
  toggleCollapseMenu,
  show
} = defineProps<{
  navItems: Array<{ label: string; to: string }>;
  collapseMenuIsOpen: boolean;
  toggleCollapseMenu: () => void;
  show?: boolean;
}>();

// SSR-safe client rendering
const clientShow = ref(false);
onMounted(() => {
  clientShow.value = show ?? false;
});
</script>
