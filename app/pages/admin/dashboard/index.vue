<template>
  <div class="flex flex-col items-center justify-center min-h-screen p-4">
    <div class="w-full max-w-2xl p-8 rounded-xl shadow-lg">
      <h1
        class="text-4xl font-extrabold text-center text-gray-900 dark:text-white"
      >
        ড্যাসবোর্ডে স্বাগতম 🎉
      </h1>
    </div>
  </div>
</template>

<script setup lang="ts">
  // import { useAuth } from '#imports';
  // import { computed } from 'vue';

  definePageMeta({
    // auth: true,
    // middleware: ['auth-admin'],
    layout: 'admin',
  });

  // const { data: sessionData } = useAuth();
  // const user = computed(() => sessionData.value?.user);
</script>
