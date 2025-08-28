<template>
  <div v-if="loading" class="fixed inset-0 flex items-center justify-center bg-black text-white z-50">
    <div class="flex flex-col items-center">
      <div class="w-12 h-12 border-4 border-white/30 border-t-red-600 rounded-full animate-spin"/>
      <p class="mt-4 text-lg">Loading Jonopath...</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';

const loading = ref(true);

onMounted(() => {
  window.addEventListener('nuxt:ready', () => {
    loading.value = false;
  })
})
</script>
