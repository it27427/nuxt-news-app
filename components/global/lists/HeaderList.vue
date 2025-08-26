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
  { label: 'মূলপাতা', to: '/', active: false },
  { label: 'রাজনীতি', to: '/topics/politics', active: false },
  { label: 'সর্বাধিক পঠিত', to: '/popular/read', active: false },
  { label: 'বিশ্ব', to: '/topics/world', active: false },
  { label: 'অর্থনীতি', to: '/topics/economy', active: false },
  { label: 'স্বাস্থ্য', to: '/topics/health', active: false },
  { label: 'খেলা', to: '/topics/game', active: false },
  { label: 'প্রযুক্তি', to: '/topics/technology', active: false },
  { label: 'ভিডিও', to: '/topics/video', active: false },
];

type NavItem = { label: string; to: string; active: boolean };
const navItems = ref<NavItem[]>(nav);
</script>
