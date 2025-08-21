<template>
  <div>
    <Topbar />
    <HeaderComponent />

    <main>
      <slot />
    </main>

    <FooterComponent />
  </div>
</template>

<script setup lang="ts">
import Topbar from '@/components/global/TopBar.vue';
import HeaderComponent from '@/components/global/layouts/HeaderComponent.vue';
import FooterComponent from '@/components/global/layouts/FooterComponent.vue';
</script>
