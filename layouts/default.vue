<template>
  <!-- Root-Layout => (DEFAULT) -->
  <div class="relative">
    <!-- Topbar -->
    <Topbar />

    <!-- Header Top (collapsible menu control) -->
    <HeaderTop
      :nav-items="navItems"
      :collapse-menu-is-open="collapseMenuIsOpen"
      :offcanvas-is-open="offcanvasIsOpen"
      :toggle-collapse-menu="toggleCollapseMenu"
      :show="showFirstHeader"
    />

    <!-- HeaderBottom -->
    <HeaderBottom
      :nav-items="navItems"
      :collapse-menu-is-open="collapseMenuIsOpen"
      :offcanvas-is-open="offcanvasIsOpen"
      :toggle-collapse-menu="toggleCollapseMenu"
      :toggle-offcanvas="toggleOffcanvas"
      :show="showSecondHeader"
    />

    <!-- OFFCANVAS (rendered at layout level so it overlays entire page) -->
    <Offcanvas
      :is-open="offcanvasIsOpen"
      :nav-items="navItems"
      :close="() => (offcanvasIsOpen = false)"
    />

    <!-- Main-Section => Page Content -->
    <main class="min-h-screen">
      <slot />
    </main>

    <!-- Footer -->
    <Footer />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import Topbar from '@/components/global/layouts/TopBar.vue';
import HeaderTop from '@/components/global/layouts/HeaderTop.vue';
import HeaderBottom from '@/components/global/layouts/HeaderBottom.vue';
import Footer from '@/components/global/layouts/Footer.vue';

/* COLLAPSE and OFFCANVAS STATE */
const collapseMenuIsOpen = ref<boolean>(false);
const offcanvasIsOpen = ref<boolean>(false);

/* TOGGLE-COLLAPSE */
function toggleCollapseMenu() {
  collapseMenuIsOpen.value = !collapseMenuIsOpen.value;
}

/* TOGGLE-OFFCANVAS */
function toggleOffcanvas() {
  offcanvasIsOpen.value = !offcanvasIsOpen.value;
}

/* NAV ITEMS (single source of truth) */
const navItems = ref([
  { label: 'মূলপাতা', to: '/' },
  { label: 'রাজনীতি', to: '/topics/politics' },
  { label: 'সর্বাধিক পঠিত', to: '/popular/read' },
  { label: 'বিশ্ব', to: '/topics/world' },
  { label: 'অর্থনীতি', to: '/topics/economy' },
  { label: 'স্বাস্থ্য', to: '/topics/health' },
  { label: 'খেলা', to: '/topics/game' },
  { label: 'প্রযুক্তি', to: '/topics/technology' },
  { label: 'ভিডিও', to: '/topics/video' },
]);

/* HEADER SCROLL BEHAVIOR (kept here and passed down as show flags) */
const showFirstHeader = ref<boolean | null>(null); // null => default (no translate classes)
const showSecondHeader = ref<boolean>(false);

let lastScrollY = 0;

const handleScroll = (): void => {
  const currentScrollY = window.scrollY;
  const scrollingUp = currentScrollY < lastScrollY;
  const scrollingDown = currentScrollY > lastScrollY;

  if (scrollingDown) {
    showSecondHeader.value = true;
    showFirstHeader.value = false;
  } else if (scrollingUp) {
    showSecondHeader.value = false;
    showFirstHeader.value = true;
  }

  // IF (SCREEN === 100VH)
  if (currentScrollY === 0) showFirstHeader.value = null;

  lastScrollY = currentScrollY;
};

onMounted((): void => {
  lastScrollY = window.scrollY;
  window.addEventListener('scroll', handleScroll, { passive: true });
});

onUnmounted((): void => {
  window.removeEventListener('scroll', handleScroll);
});
</script>