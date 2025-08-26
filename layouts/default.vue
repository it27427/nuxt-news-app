<template>
  <div class="relative">
    <Topbar />

    <!-- First Header -->
    <div
      :class="[
        showFirstHeader === null ? '' : 'w-full transition-transform duration-500 ease-in-out',
        showFirstHeader === true ? 'translate-y-0 fixed top-0 left-0' : showFirstHeader === false ? '-translate-y-full' : ''
      ]"
    >
      <Header>
        <Navigation
          :nav-items="navItems"
          :offcanvas-is-open="offcanvasIsOpen"
          @toggle-offcanvas="toggleOffcanvas"
        />
      </Header>
    </div>

    <!-- Second Header -->
    <Header
      :class="[
        'fixed bottom-0 left-0 w-full z-50 bg-white shadow-lg transition-transform duration-500 ease-in-out',
        showSecondHeader ? 'translate-y-0' : 'translate-y-full'
      ]"
    >
      <Navigation
        :nav-items="navItems"
        :offcanvas-is-open="offcanvasIsOpen"
        @toggle-offcanvas="toggleOffcanvas"
      />
    </Header>

    <!-- OFFCANVAS MENU -->
    <Offcanvas
      :is-open="offcanvasIsOpen"
      :nav-items="navItems"
      :close="() => (offcanvasIsOpen = false)"
    />

    <main class="min-h-screen mb-96">
      <slot />
    </main>

    <Footer />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import Topbar from '@/components/global/layouts/TopBar.vue';
import Header from '@/components/global/layouts/Header.vue';
import Navigation from '@/components/global/Navigation.vue';
import Footer from '@/components/global/layouts/Footer.vue';

/**
 * OFFCANVAS MENU
 * NAV ITEMS
 * 
*/
const offcanvasIsOpen = ref<boolean>(false);

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

function toggleOffcanvas() {
  offcanvasIsOpen.value = !offcanvasIsOpen.value;
}

/**
 * HEADER SCROOLING BEHAVIOR
 * BOTH SIDE SCROLLING
*/
const showFirstHeader = ref<boolean | null>(null);
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