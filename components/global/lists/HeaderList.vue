<template>
  <ul class="flex items-center gap-3 h-12">
    <li v-for="navItem in navItems" :key="navItem.label" class="h-12">
      <NuxtLink
        :to="navItem.to"
        class="header-link h-12 flex items-center justify-center py-3 px-2 md:px-1 border-b-4 border-transparent transition-border"
      >
        {{ navItem.label }}
      </NuxtLink>
    </li>
  </ul>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const nav = [
  { label: 'মূলপাতা', to: '/' },
  { label: 'রাজনীতি', to: '/topics/politics' },
  { label: 'সর্বাধিক পঠিত', to: '/popular/read' },
  { label: 'বিশ্ব', to: '/topics/world' },
  { label: 'অর্থনীতি', to: '/topics/economy' },
  { label: 'স্বাস্থ্য', to: '/topics/health' },
  { label: 'খেলা', to: '/topics/game' },
  { label: 'প্রযুক্তি', to: '/topics/technology' },
  { label: 'ভিডিও', to: '/topics/video' },
];

type NavItem = { label: string; to: string; };
const navItems = ref<NavItem[]>(nav);
</script>
