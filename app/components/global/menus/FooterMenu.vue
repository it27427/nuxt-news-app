<template>
  <ul class="footer-list" role="list">
    <li v-for="navItem in navItems" :key="navItem.label" class="footer-list-item">
      <client-only>
        <NuxtLink :to="navItem.to" class="footer-list-link">
          {{ navItem.label }}
        </NuxtLink>
      </client-only>
    </li>
  </ul>
</template>

<script setup lang="ts">
const { navItems } = defineProps<{
  navItems: Array<{ label: string; to: string }>;
}>();
</script>
