<template>
  <ul class="flex flex-col">
    <li v-for="navItem in navItems" :key="navItem.label" class="py-3 border-b border-light-50">
      <NuxtLink :to="navItem.to" class="text-dark mobile-link h-12 flex items-center" @click="close">
        <span class="mobile-link-text">{{ navItem.label }}</span>
      </NuxtLink>
    </li>
  </ul>
</template>
<script setup lang="ts">
type NavItem = { label: string; to: string };

const { navItems, close } = defineProps<{
  navItems: NavItem[];
  close: () => void;
}>();
</script>