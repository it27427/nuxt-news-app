<template>
  <ul class="footer-list" role="list">
    <li
      v-for="navItem in navItems"
      :key="navItem.label"
      class="footer-list-item"
    >
      <client-only>
        <BaseLink :to="navItem.to" class="footer-list-link">
          {{ navItem.label }}
        </BaseLink>
      </client-only>
    </li>
  </ul>
</template>

<script setup lang="ts">
  import BaseLink from '@/components/base/BaseLink.vue';
  const { navItems } = defineProps<{
    navItems: Array<{ label: string; to: string }>;
  }>();
</script>
