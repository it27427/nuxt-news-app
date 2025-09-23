<template>
  <ul class="flex items-center gap-3 h-12">
    <li v-for="navItem in navItems" :key="navItem.label" class="h-12">
      <client-only>
        <BaseLink
          :to="navItem.to"
          class="header-link h-12 flex items-center justify-center py-3 px-2 md:px-1 border-b-4 border-transparent transition-border"
        >
          {{ navItem.label }}
        </BaseLink>
      </client-only>
    </li>
  </ul>
</template>

<script setup lang="ts">
  import BaseLink from '~/components/base/BaseLink.vue';
  const { navItems } = defineProps<{
    navItems: Array<{ label: string; to: string }>;
  }>();
</script>
