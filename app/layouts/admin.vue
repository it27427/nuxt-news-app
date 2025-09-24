<template>
  <div class="relative">
    <!-- Header -->
    <AdminHeader />

    <!-- Main Content wrapper -->
    <div v-if="!loading">
      <!-- Desktop Sidebar -->
      <Sidebar
        :menus="menus"
        :open="sidebarOpen"
        :user="user"
        @toggle="toggleSidebar"
        class="hidden lg:flex fixed top-20 left-0 h-screen flex-col transition-all duration-300"
      />

      <!-- Main Content -->
      <div
        class="flex-1 flex flex-col transition-all duration-300"
        :class="{
          'ml-64': sidebarOpen && screenWidth >= 1024,
          'ml-20': !sidebarOpen && screenWidth >= 1024,
          'ml-0': screenWidth < 1024,
        }"
      >
        <!-- Breadcrumbs -->
        <Breadcrumb class="flex items-center w-full h-12">
          <!-- Offcanvas for tablet/mobile -->
          <div class="lg:hidden">
            <AdminOffcanvas :menus="menus" :user="user" />
          </div>
        </Breadcrumb>

        <!-- DASHBOARD-BODY-CONTENT -->
        <main class="p-6 min-h-screen">
          <slot />
        </main>

        <!-- DASHBOARD-FOOTER -->
        <AdminFooter
          class="bg-white text-dark dark:bg-slate-800 dark:text-white w-full h-12 flex items-center justify-center"
        />
      </div>
    </div>

    <div v-else class="flex justify-center items-center h-screen w-full">
      Loading...
    </div>

    <!-- ScrollToTop -->
    <ScrollToTop class="bottom-1" />
  </div>
</template>

<script setup lang="ts">
  import { onBeforeUnmount, onMounted, ref } from 'vue';
  import { useAuth } from '~/composables/useAuth';
  import { adminMenus } from '~/menus/adminMenus';
  import type { AdminMenuType as MenuProps } from '~~/types/admin';

  const { user, initializeUser, loading } = useAuth();

  const menus = ref<MenuProps[]>(adminMenus);

  onMounted(() => {
    initializeUser();
  });

  const sidebarOpen = ref(true);

  const toggleSidebar = () => {
    sidebarOpen.value = !sidebarOpen.value;
  };

  const screenWidth = ref(0);
  const updateWidth = () => {
    if (import.meta.client) {
      screenWidth.value = window.innerWidth;
    }
  };

  onMounted(() => {
    if (import.meta.client) {
      screenWidth.value = window.innerWidth;
      window.addEventListener('resize', updateWidth);
    }
  });

  onBeforeUnmount(() => {
    if (import.meta.client) {
      window.removeEventListener('resize', updateWidth);
    }
  });
</script>
