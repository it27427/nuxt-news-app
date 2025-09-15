<template>
  <Header
    class="sticky top-0 left-0 w-full bg-green-900 flex flex-col px-6 z-50"
  >
    <nav class="flex items-center justify-between w-full h-20">
      <!-- <Icon name="mdi:home" width="32" height="32" /> -->
      <h2 class="text-white cursor-pointer font-bold">
        ড্যাশবোর্ডে স্বাগতম 🎉
      </h2>
      <div class="flex items-center gap-4">
        <Notifications />
        <DarkMode />
      </div>
    </nav>
  </Header>
</template>

<script lang="ts" setup>
  import Notifications from '@/components/admin/Notifications.vue';
  import DarkMode from '@/components/global/DarkMode.vue';
  import Header from '@/components/global/layouts/Header.vue';
</script>
