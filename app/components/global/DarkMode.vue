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
  import { computed } from 'vue';

  type Theme = 'light' | 'dark';

  const colorMode = useColorMode();

  const setColorTheme = (newTheme: Theme) => (colorMode.preference = newTheme);

  const toggleTheme = () =>
    setColorTheme(colorMode.preference === 'dark' ? 'light' : 'dark');

  /* Light Mode Check (Reactive) */
  const lightMode = computed(() => colorMode.preference === 'light');
</script>
