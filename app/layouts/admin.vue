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
  import { ref, onMounted, onBeforeUnmount } from 'vue';
  import type { AdminMenuType } from '~~/types/admin';
  import { adminMenus } from '~/menus/adminMenus';
  import AdminHeader from '~/components/admin/AdminHeader.vue';
  import Sidebar from '~/components/admin/Sidebar.vue';
  import Breadcrumb from '~/components/admin/global/Breadcrumb.vue';
  import AdminOffcanvas from '~/components/admin/global/offcanvas/AdminOffcanvas.vue';
  import AdminFooter from '~/components/admin/AdminFooter.vue';
  import ScrollToTop from '~/components/global/ScrollToTop.vue';
  import { useCustomAuth } from '~/composables/useCustomAuth';

  const { user, initializeUser, loading } = useCustomAuth();

  const menus = ref<AdminMenuType[]>(adminMenus);

  onMounted(() => {
    initializeUser();
  });

  const sidebarOpen = ref(true);

  const toggleSidebar = () => {
    sidebarOpen.value = !sidebarOpen.value;
  };

  const screenWidth = ref(0);
  const updateWidth = () => {
    if (process.client) {
      screenWidth.value = window.innerWidth;
    }
  };

  onMounted(() => {
    if (process.client) {
      screenWidth.value = window.innerWidth;
      window.addEventListener('resize', updateWidth);
    }
  });

  onBeforeUnmount(() => {
    if (process.client) {
      window.removeEventListener('resize', updateWidth);
    }
  });
</script>
