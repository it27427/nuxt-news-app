<template>
  <ClientOnly>
    <button type="button" @click="toggleTheme">
      <span
        v-if="lightMode"
        class="text-gray-100 text-3xl transition-color hover:text-white"
      >
        ☀︎
      </span>
      <span
        v-else
        class="text-gray-100 text-3xl inline-block -rotate-90 transition-color hover:text-white"
      >
        ⏾
      </span>
    </button>
  </ClientOnly>
</template>

<script setup lang="ts">
  import { useColorMode } from '#imports';
  import { computed, onMounted } from 'vue';

  type Theme = 'light' | 'dark';

  const colorMode = useColorMode();

  /* --- Initialize Theme --- */
  onMounted(() => {
    // 1. Check if a theme was saved
    const savedTheme = localStorage.getItem('theme') as Theme | null;

    if (savedTheme) {
      colorMode.preference = savedTheme;
    } else {
      // 2. Detect system preference if nothing is saved
      const prefersDark = window.matchMedia(
        '(prefers-color-scheme: dark)'
      ).matches;
      const systemTheme: Theme = prefersDark ? 'dark' : 'light';

      colorMode.preference = systemTheme;
      localStorage.setItem('theme', systemTheme);
    }
  });

  /* --- Set Theme & Save --- */
  const setColorTheme = (newTheme: Theme) => {
    colorMode.preference = newTheme;
    localStorage.setItem('theme', newTheme);
  };

  /* --- Toggle Theme --- */
  const toggleTheme = () =>
    setColorTheme(colorMode.preference === 'dark' ? 'light' : 'dark');

  /* --- Reactive Light Mode Check --- */
  const lightMode = computed(() => colorMode.preference === 'light');
</script>
