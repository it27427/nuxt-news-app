<template>
  <header
    class="sticky top-0 left-0 w-full bg-green-900 flex items-center justify-between px-6 h-20"
  >
    <nav class="flex items-center justify-between w-full">
      <!-- <Icon name="mdi:home" width="32" height="32" /> -->
      <h2 class="text-white cursor-pointer font-bold">
        ড্যাসবোর্ডে স্বাগতম 🎉
      </h2>
      <div class="flex items-center gap-4">
        <Notifications />
        <DarkMode />
      </div>
    </nav>
  </header>
</template>

<script lang="ts" setup>
  import Notifications from '@/components/admin/Notifications.vue';
  import DarkMode from '@/components/global/DarkMode.vue';
</script>
