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

  type Theme = 'light' | 'dark';

  const colorMode = useColorMode();

  /* --- Restore theme from localStorage on mount --- */
  onMounted(() => {
    const savedTheme = localStorage.getItem('theme') as Theme | null;
    if (savedTheme) {
      colorMode.preference = savedTheme;
    } else {
      // save the default theme on first load
      localStorage.setItem('theme', colorMode.preference);
    }
  });

  /* --- Set Theme & Save --- */
  const setColorTheme = (newTheme: Theme) => {
    colorMode.preference = newTheme;
    localStorage.setItem('theme', newTheme); // save choice
  };

  /* --- Toggle Theme --- */
  const toggleTheme = () =>
    setColorTheme(colorMode.preference === 'dark' ? 'light' : 'dark');

  /* --- Reactive Light Mode Check --- */
  const lightMode = computed(() => colorMode.preference === 'light');
</script>
