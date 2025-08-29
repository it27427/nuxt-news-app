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

  let colorModePreference = colorMode.preference;

  /* --- Restore theme from localStorage on mount --- */
  onMounted(() => {
    const savedTheme = localStorage.getItem('theme') as Theme | null;
    if (savedTheme) {
      colorModePreference = savedTheme;
    } else {
      // save the default theme on first load
      localStorage.setItem('theme', colorModePreference);
    }
  });

  /* --- Set Theme & Save --- */
  const setColorTheme = (newTheme: Theme) => {
    colorModePreference = newTheme;
    localStorage.setItem('theme', newTheme);
  };

  /* --- Toggle Theme --- */
  const toggleTheme = () =>
    setColorTheme(colorModePreference === 'dark' ? 'light' : 'dark');

  /* --- Reactive Light Mode Check --- */
  const lightMode = computed(() => colorModePreference === 'light');
</script>
