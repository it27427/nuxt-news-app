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

    <!-- Mobile Menu -->
    <HamburgerMenu
      v-if="collapseMenuIsOpen"
      :is-open="collapseMenuIsOpen"
      :nav-items="navItems"
      :close="toggleCollapseMenu"
      class="md:hidden"
    />

    <!-- Main Content -->
    <main
      :class="[
        'transition-all duration-300 min-h-screen',
        collapseMenuIsOpen ? 'mt-5' : 'mt-0'
      ]">
      <slot />
    </main>

    <!-- Footer -->
    <Footer :nav-items="footerNavItems" />
  </div>
</template>

<script setup lang="ts">
import HamburgerMenu from "@/components/global/hamburger/HamburgerMenu.vue";
import Footer from '@/components/global/layouts/Footer.vue';
import HeaderBottom from '@/components/global/layouts/HeaderBottom.vue';
import HeaderTop from '@/components/global/layouts/HeaderTop.vue';
import Topbar from '@/components/global/layouts/TopBar.vue';
import Offcanvas from '@/components/global/offcanvas/Offcanvas.vue';
import { onMounted, onUnmounted, ref } from 'vue';

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

/* FOOTER-NAV-ITEMS */
const footerNavItems = ref([
  { label: 'জনপথের ওপর কেন আপনি আস্থা রাখতে পারেন', to: '/institutional/trust-and-transparency' },
  { label: 'ব্যবহারের শর্তাবলী', to: '/institutional/terms-of-use' },
  { label: 'জনপথ সম্পর্কে', to: '/institutional/about' },
  { label: 'প্রিভেসি নীতি', to: '/institutional/privacy-policy' },
  { label: 'কুকিজ', to: '/institutional/' },
  { label: 'জনপথের সাথে যোগাযোগ করুন', to: '/institutional/contact' },
  { label: 'অন্যান্য ভাষায় জনপথের সংবাদ', to: '#' }
]);

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
