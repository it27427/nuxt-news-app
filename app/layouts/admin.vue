<!-- layouts/admin.vue -->
<template>
  <div :name="layout">
    <Header />
    <Button
      @click="toggleSidebar"
      class="flex items-center justify-end w-full px-4 py-2 border-b border-gray-200 dark:border-gray-700"
    >
      <Icon
        :class="[
          open ? 'rotate-180' : 'rotate-0',
          'text-sizeXXl transition-transform',
        ]"
        name="guidance:left-arrow"
        width="28"
        height="28"
      />
    </Button>

    <Offcanvas />

    <!-- Body -->
    <div class="flex">
      <!-- Sidebar with prop -->
      <Sidebar :open="open" />

      <!-- Main Content -->
      <div class="flex-1 flex flex-col transition-transform duration-300">
        <main class="p-6 min-h-screen">
          <slot />
        </main>
        <Footer class="flex-1" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue';

  import Footer from '@/components/admin/Footer.vue';
  import Header from '@/components/admin/Header.vue';
  import Sidebar from '@/components/admin/Sidebar.vue';
  import Button from '@/components/admin/global/Button.vue';
  import Offcanvas from '@/components/admin/global/offcanvas/Offcanvas.vue';

  const layout = 'admin';
  const open = ref(false);

  const toggleSidebar = () => (open.value = !open.value);
</script>
