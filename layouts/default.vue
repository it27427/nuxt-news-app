<template>
  <div class="relative">
    <!-- Topbar -->
    <Topbar />

    <!-- Header Top -->
    <HeaderTop
      :nav-items="navItems"
      :collapse-menu-is-open="collapseMenuIsOpen"
      :toggle-collapse-menu="toggleCollapseMenu"
      :show="showFirstHeader"
    />

    <!-- Header Bottom -->
    <HeaderBottom
      :nav-items="navItems"
      :offcanvas-is-open="offcanvasIsOpen"
      :toggle-offcanvas="toggleOffcanvas"
      :show="showSecondHeader"
    />

    <!-- Offcanvas Menu -->
    <Offcanvas
      :is-open="offcanvasIsOpen"
      :nav-items="navItems"
      :close="() => (offcanvasIsOpen = false)"
    />

    <!-- Main Content -->
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
import Offcanvas from '@/components/global/offcanvas/Offcanvas.vue';

/* COLLAPSE & OFFCANVAS STATE */
const collapseMenuIsOpen = ref(false);
const offcanvasIsOpen = ref(false);

/* TOGGLE FUNCTIONS */
const toggleCollapseMenu = () => {
  collapseMenuIsOpen.value = !collapseMenuIsOpen.value;
};
const toggleOffcanvas = () => {
  offcanvasIsOpen.value = !offcanvasIsOpen.value;
};

/* NAV ITEMS */
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

/* HEADER SCROLL BEHAVIOR */
const showFirstHeader = ref(true);
const showSecondHeader = ref(false);
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

  if (currentScrollY === 0) {
    showFirstHeader.value = true;
    showSecondHeader.value = false;
  }

  lastScrollY = currentScrollY;
};

onMounted(() => {
  lastScrollY = window.scrollY;
  window.addEventListener('scroll', handleScroll, { passive: true });
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});
</script>
