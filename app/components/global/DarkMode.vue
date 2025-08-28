<template>
  <ClientOnly>
    <button
      type="button"
      @click="toggleTheme"
      class="transition-colors text-white text-2xl"
    >
      <span v-if="lightMode">
        <i class="fa-solid fa-moon"></i>
      </span>
      <span v-else>
        <i class="fa-solid fa-sun"></i>
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

  /**
   *  🌙 Dark Mode Toggle Component (DOCUMENTATIONS)
   *
   *  ✍️ This component provides a button to switch between light and dark themes.
   *  ✍️ It uses Nuxt's `useColorMode()` composable to manage theme preferences.
   *
   * ⚡Functions:
   *  🎨 setColorTheme(newTheme: 'light' | 'dark'):
   *  👉 Sets the color theme to the given value ('light' or 'dark').
   *
   *  🔄 toggleTheme():
   *  👉 Toggles the color theme.
   *  👉 If current theme is 'dark', it switches to 'light'.
   *  👉 If current theme is 'light', it switches to 'dark'.
   *
   *  🔢 Computed:
   *  💡 lightMode (boolean):
   *  👉 Returns true if the current theme is 'light'.
   *  👉 Updates reactively when the theme changes.
   *
   *  🗂️ Template:
   *  👉 Shows a moon icon when in light mode (to allow switching to dark mode).
   *  👉 Shows a sun icon when in dark mode (to allow switching to light mode).
   *  👉 Uses <ClientOnly> to ensure rendering happens only on the client,
   *     avoiding SSR hydration mismatch errors.
   *
   *  ✍️ Developer Notes:
   *  👉 Use `setColorTheme` if you want to explicitly set the theme from outside.
   *  👉 Use `toggleTheme` for simple user interactions like a button click.
   *  👉 Use `lightMode` for conditionally rendering UI elements depending on theme.
   *  👉 The component is fully reactive and will always reflect the current theme.
   */
</script>
