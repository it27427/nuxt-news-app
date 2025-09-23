<template>
  <HeaderSkeleton v-if="loading" />
  <Header
    v-else
    class="sticky top-0 left-0 w-full bg-green-900 flex flex-col px-6 z-50"
  >
    <nav class="flex items-center justify-between w-full h-20">
      <AdminLogo />
      <div class="flex items-center gap-4">
        <Notifications />
        <DarkMode />
      </div>
    </nav>
  </Header>
</template>

<script lang="ts" setup>
  const loading = ref(true);

  onMounted(async () => {
    // simulate fetch
    setTimeout(() => (loading.value = false), 1200);
  });
</script>
