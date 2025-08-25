<template>
  <button
    @click="toggleTheme"
    class="p-2 transition-colors"
  >
    <span v-if="isDark">🌙</span>
    <span v-else>☀️</span>
  </button>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';

const isDark = ref(false);

const setTheme = (dark: boolean) => {
  const body = document.body
  if (dark) {
    body.classList.add('dark');
    localStorage.setItem('theme', 'dark');
    isDark.value = true;
  } else {
    body.classList.remove('dark');
    localStorage.setItem('theme', 'light');
    isDark.value = false;
  }
}

const toggleTheme = () => {
  setTheme(!isDark.value);
}

onMounted(() => {
  const saved = localStorage.getItem('theme');
  if (saved === 'dark' || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    setTheme(true);
  } else {
    setTheme(false);
  }
});
</script>
