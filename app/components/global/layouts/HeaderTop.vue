<template>
  <Header
    :class="[
      'w-full backdrop-blur transition-transform duration-300',
      props.show
        ? 'sticky top-0 left-0 z-40 translate-y-0'
        : 'relative -translate-y-full',
    ]"
  >
    <nav
      class="bg-white border-b border-light-50 dark:bg-dark-knight dark:border-dark-divider h-12"
    >
      <div class="jonopath-container flex items-center mobcontainer">
        <!-- Hamburger (Mobile) -->
        <div class="md:hidden">
          <Hamburger
            :is-open="props.collapseMenuIsOpen"
            @toggle="props.toggleCollapseMenu"
          />
        </div>

        <!-- Desktop Menu -->
        <div class="scrollable-nav">
          <DesktopMenu :nav-items="navItems" />
        </div>
      </div>
    </nav>
  </Header>
</template>

<script setup lang="ts">
  import { onMounted, onUnmounted, ref } from 'vue';
  import Hamburger from '~/components/global/hamburger/Hamburger.vue';
  import Header from '~/components/global/layouts/Header.vue';
  import DesktopMenu from '~/components/global/menus/DesktopMenu.vue';

  import type { NavItem } from '~~/types/global';

  // Props
  const props = defineProps<{
    navItems: NavItem[];
    collapseMenuIsOpen: boolean;
    toggleCollapseMenu: () => void;
    show: boolean;
  }>();

  // Scroll tracking (if you want to use it for something else)
  const scrolledBeyondVH100 = ref(false);

  function getScrollY(): number {
    const el =
      (document.scrollingElement as HTMLElement | null) ||
      document.documentElement;
    return (el && el.scrollTop) || window.scrollY || 0;
  }

  function handleScroll() {
    const threshold = window.innerHeight || 0;
    scrolledBeyondVH100.value = getScrollY() > threshold;
  }

  onMounted(() => {
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
  });

  onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll);
  });
</script>
