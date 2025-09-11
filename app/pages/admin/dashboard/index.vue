<template>
  <div
    class="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-100 dark:bg-gray-900"
  >
    <div
      class="w-full max-w-2xl p-8 space-y-6 bg-white rounded-xl shadow-lg dark:bg-gray-800"
    >
      <h1
        class="text-4xl font-extrabold text-center text-gray-900 dark:text-white"
      >
        ড্যাশবোর্ড
      </h1>
      <p class="text-center text-gray-600 dark:text-gray-300">
        স্বাগতম! আপনি সফলভাবে লগইন করেছেন।
      </p>
      <div class="mt-8 text-center">…</div>
    </div>
  </div>
</template>

<script setup lang="ts">
  definePageMeta({
    middleware: ['auth-admin'],
    layout: 'admin',
  });
</script>
