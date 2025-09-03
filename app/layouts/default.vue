<template>
  <div class="relative">
    <!-- TopBar (with DarkMode) -->
    <TopBar>
      <template #right>
        <DarkMode />
      </template>
    </TopBar>

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
        'transition-all duration-300 relative',
        collapseMenuIsOpen ? 'mt-5' : 'mt-0',
      ]"
    >
      <svg
        viewBox="0 0 1440 181"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        class="pointer-events-none absolute w-full -top-[41px] transition-all text-primary shrink-0 -z-10 duration-[400ms]"
      >
        <mask id="path-1-inside-1_414_5526" fill="white">
          <path d="M0 0H1440V181H0V0Z"></path>
        </mask>
        <path
          d="M0 0H1440V181H0V0Z"
          fill="url(#paint0_linear_414_5526)"
          fill-opacity="0.22"
        ></path>
        <path
          d="M0 2H1440V-2H0V2Z"
          fill="url(#paint1_linear_414_5526)"
          mask="url(#path-1-inside-1_414_5526)"
        ></path>
        <defs>
          <linearGradient
            id="paint0_linear_414_5526"
            x1="720"
            y1="0"
            x2="720"
            y2="181"
            gradientUnits="userSpaceOnUse"
          >
            <stop stop-color="currentColor"></stop>
            <stop offset="1" stop-color="currentColor" stop-opacity="0"></stop>
          </linearGradient>
          <linearGradient
            id="paint1_linear_414_5526"
            x1="0"
            y1="90.5"
            x2="1440"
            y2="90.5"
            gradientUnits="userSpaceOnUse"
          >
            <stop stop-color="currentColor" stop-opacity="0"></stop>
            <stop offset="0.395" stop-color="currentColor"></stop>
            <stop offset="1" stop-color="currentColor" stop-opacity="0"></stop>
          </linearGradient>
        </defs>
      </svg>
      <slot />
    </main>

    <!-- Footer -->
    <Footer :nav-items="footerNavItems" />

    <!-- ScrollToTop -->
    <ScrollToTop />
  </div>
</template>

<script setup lang="ts">
  import DarkMode from '@/components/global/DarkMode.vue';
  import HamburgerMenu from '@/components/global/hamburger/HamburgerMenu.vue';
  import Footer from '@/components/global/layouts/Footer.vue';
  import HeaderBottom from '@/components/global/layouts/HeaderBottom.vue';
  import HeaderTop from '@/components/global/layouts/HeaderTop.vue';
  import Offcanvas from '@/components/global/offcanvas/Offcanvas.vue';
  import ScrollToTop from '@/components/global/ScrollToTop.vue';
  import TopBar from '@/components/global/TopBar.vue';
  import { onMounted, onUnmounted, ref } from 'vue';
  import type { NavItem } from '~~/types/global';

  const navItems = ref<NavItem[]>([
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
  const footerNavItems = ref<NavItem[]>([
    {
      label: 'জনপথের ওপর কেন আপনি আস্থা রাখতে পারেন',
      to: '/institutional/trust-and-transparency',
    },
    { label: 'ব্যবহারের শর্তাবলী', to: '/institutional/terms-of-use' },
    { label: 'জনপথ সম্পর্কে', to: '/institutional/about' },
    { label: 'প্রিভেসি নীতি', to: '/institutional/privacy-policy' },
    { label: 'কুকিজ', to: '#' },
    { label: 'জনপথের সাথে যোগাযোগ করুন', to: '/institutional/contact' },
    { label: 'অন্যান্য ভাষায় জনপথের সংবাদ', to: '#' },
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
