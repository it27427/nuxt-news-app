<template>
  <div class="relative">
    <!-- Header -->
    <AdminHeader />

    <div class="flex">
      <!-- Desktop Sidebar -->
      <Sidebar
        :menus="menus"
        :open="sidebarOpen"
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
            <AdminOffcanvas :menus="menus" />
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

    <!-- ScrollToTop -->
    <ScrollToTop class="bottom-1" />
  </div>
</template>

<script setup lang="ts">
  const menus = ref<AdminMenu[]>(adminMenus);

  // Sidebar collapse state
  const sidebarOpen = ref(true);

  // Toggle sidebar
  const toggleSidebar = () => {
    sidebarOpen.value = !sidebarOpen.value;
  };

  // Screen width reactive ref
  const screenWidth = ref(0);

  const updateWidth = () => {
    screenWidth.value = window.innerWidth;
  };

  onMounted(() => {
    // Initialize screen width on client
    screenWidth.value = window.innerWidth;
    window.addEventListener('resize', updateWidth);
  });

  onBeforeUnmount(() => {
    window.removeEventListener('resize', updateWidth);
  });
</script>
