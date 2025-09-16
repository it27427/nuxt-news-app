<!-- layouts/admin.vue -->
<template>
  <div :name="layout">
    <Header />

    <div class="lg:hidden">
      <Offcanvas :menus="adminMenus" />
    </div>

    <!-- Body -->
    <div class="flex">
      <!-- Sidebar -->
      <Sidebar
        :menus="adminMenus"
        :open="sidebarOpen"
        @toggle="toggleSidebar"
      />

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
  import Offcanvas from '@/components/admin/global/offcanvas/Offcanvas.vue';
  import { adminMenus } from '@/menus/adminMenus';

  const layout = 'admin';

  const sidebarOpen = ref(true);

  const toggleSidebar = () => {
    sidebarOpen.value = !sidebarOpen.value;
  };
</script>
