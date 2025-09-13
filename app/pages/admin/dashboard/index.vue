<template>
  <div
    class="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-100 dark:bg-gray-900"
  >
    <div
      class="w-full max-w-2xl p-8 bg-white rounded-xl shadow-lg dark:bg-gray-800"
    >
      <h1
        class="text-4xl font-extrabold text-center text-gray-900 dark:text-white"
      >
        Welcome to Dashboard 🎉
      </h1>
      <p class="text-center text-gray-600 dark:text-gray-300">
        স্বাগতম,
        <span class="font-bold">{{ user?.email || 'ব্যবহারকারী' }}</span>
        !
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { useAuth } from '#imports';
  import { computed } from 'vue';

  definePageMeta({
    auth: true,
    middleware: ['auth-admin'],
    layout: 'admin',
  });

  const { data: sessionData } = useAuth();
  const user = computed(() => sessionData.value?.user);
</script>
