<template>
  <div :name="layout">
    <Header />
    <Sidebar />
    <main>
      <slot />
    </main>
    <Footer />
  </div>
</template>

<script setup lang="ts">
  const layout = 'admin';

  import Footer from '@/components/admin/Footer.vue';
  import Header from '@/components/admin/Header.vue';
  import Sidebar from '@/components/admin/Sidebar.vue';
</script>
