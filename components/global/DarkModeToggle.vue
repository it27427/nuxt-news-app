<template>
  <ClientOnly>
    <button
      @click="toggleTheme"
      class="p-2 transition-colors text-white text-2xl"
    >
      <span v-if="!isDark">
        <i class="fa-solid fa-moon"></i>
      </span>
      <span v-else>
        <i class="fa-solid fa-sun"></i>
      </span>
    </button>
  </ClientOnly>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';

const isDark = ref(false);

const setTheme = (dark: boolean) => {
  const body = document.body;
  if (dark) {
    body.classList.add('dark');
    localStorage.setItem('theme', 'dark');
    isDark.value = true;
  } else {
    body.classList.remove('dark');
    localStorage.setItem('theme', '');
    isDark.value = false;
  }
};

const toggleTheme = () => {
  setTheme(!isDark.value);
};

onMounted(() => {
  const saved = localStorage.getItem('theme');
  if (saved === 'dark') {
    setTheme(true);
  } else {
    setTheme(false);
  }
});
</script>
