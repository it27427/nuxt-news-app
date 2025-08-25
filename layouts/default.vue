<template>
  <div>
    <Topbar />
    <Header />

    <main>
      <slot />
    </main>

    <Footer />
  </div>
</template>

<script setup lang="ts">
import Topbar from '@/components/global/layouts/TopBar.vue';
import Header from '@/components/global/layouts/Header.vue';
import Footer from '@/components/global/layouts/Footer.vue';
</script>
