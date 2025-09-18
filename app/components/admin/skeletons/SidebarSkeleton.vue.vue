<template>
  <aside
    class="bg-light text-dark dark:bg-gray-900 dark:text-white flex-col transition-all duration-300"
    :class="[open ? 'w-64' : 'w-20']"
  >
    <!-- HEADER SKELETON -->
    <header
      class="flex flex-col items-center justify-center gap-2 p-4 border-b border-gray-200 dark:border-slate-800 relative"
      :class="[open ? 'h-dash-head-xl' : 'h-dash-head-sm']"
    >
      <!-- Collapse Button Placeholder -->
      <div
        class="flex items-center justify-center rounded-full absolute top-full animate-pulse"
        :class="[
          open
            ? 'w-10 h-10 -mt-5 -right-5 bg-gray-300 dark:bg-slate-700'
            : 'w-8 h-8 -mt-4 -right-4 bg-gray-300 dark:bg-slate-700',
        ]"
      ></div>

      <!-- Avatar Placeholder -->
      <div
        class="flex items-center justify-center font-bold rounded-full animate-pulse"
        :class="[
          open
            ? 'w-20 h-20 text-5xl bg-gray-300 dark:bg-slate-700'
            : 'w-12 h-12 text-3xl bg-gray-300 dark:bg-slate-700',
        ]"
      ></div>

      <!-- Name & Email Placeholder -->
      <ul v-show="open" class="flex flex-col items-center justify-center gap-1">
        <li
          class="h-6 w-32 bg-gray-300 dark:bg-slate-700 rounded animate-pulse"
        ></li>
        <li
          class="h-4 w-48 bg-gray-300 dark:bg-slate-700 rounded animate-pulse"
        ></li>
      </ul>
    </header>

    <!-- MENU SKELETON -->
    <nav
      class="flex flex-col gap-2 p-2 overflow-y-auto scrollbar-none"
      :class="[open ? 'max-h-screen-minus-xl' : 'max-h-screen-minus-sm']"
    >
      <ul class="flex flex-col gap-2">
        <li
          v-for="i in itemCount"
          :key="i"
          class="flex items-center gap-2 p-2 border-b border-gray-200 dark:border-gray-700 animate-pulse"
        >
          <!-- Icon Placeholder -->
          <div
            :class="
              open
                ? 'w-8 h-8 rounded bg-gray-300 dark:bg-slate-700'
                : 'w-8 h-8 rounded bg-gray-300 dark:bg-slate-700 mx-auto'
            "
          ></div>
          <!-- Label Placeholder -->
          <div
            v-if="open"
            class="h-4 bg-gray-300 dark:bg-slate-700 rounded flex-1"
          ></div>
        </li>
      </ul>
    </nav>
  </aside>
</template>

<script setup lang="ts">
  const props = defineProps<{
    open: boolean; // Sidebar expanded or collapsed
    itemCount?: number; // Number of menu skeleton items
  }>();

  const open = props.open;
  const itemCount = props.itemCount ?? 12;
</script>

<style scoped lang="scss">
  /* Optional shimmer effect */
  .animate-pulse {
    @apply relative overflow-hidden;
  }

  .animate-pulse::before {
    content: '';
    @apply absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-slate-700 dark:via-slate-600 dark:to-slate-700;
    animation: pulseShimmer 1.5s infinite;
  }

  @keyframes pulseShimmer {
    0% {
      transform: translateX(-100%);
    }
    100% {
      transform: translateX(100%);
    }
  }
</style>
