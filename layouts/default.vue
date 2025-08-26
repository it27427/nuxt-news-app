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
      <Header />
    </div>

    <!-- Second Header -->
    <Header
      :class="[
        'fixed bottom-0 left-0 w-full z-50 bg-white shadow-lg transition-transform duration-500 ease-in-out',
        showSecondHeader ? 'translate-y-0' : 'translate-y-full'
      ]"
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
import Footer from '@/components/global/layouts/Footer.vue';

const showFirstHeader = ref < boolean | null > (null); // null = default, no class;
const showSecondHeader = ref < boolean > (false);

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

  // যদি screen top-এ পৌঁছায়, ১ম হেডারের div থেকে class সরানো
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
