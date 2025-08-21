<template>
  <ul>
    <li v-for="item in navItems" :key="item.id">
      <NuxtLink to="item.href">{{ item.text }}</NuxtLink>
    </li>
  </ul>
</template>

<script setup>
  import { ref } from 'vue';
  import { v4 as uuidv4 } from 'uuid';

  const nav = [
    { id: uuidv4(), label: 'মূলপাতা', to: '/' },
    { id: uuidv4(), label: 'রাজনীতি', to: '/topics/politics' },
    { id: uuidv4(), label: 'সর্বাধিক পঠিত', to: '/popular/read' },
    { id: uuidv4(), label: 'বিশ্ব', to: '/topics/world' },
    { id: uuidv4(), label: 'অর্থনীতি', to: '/topics/economy' },
    { id: uuidv4(), label: 'স্বাস্থ্য', to: '/topics/health' },
    { id: uuidv4(), label: 'খেলা', to: '/topics/game' },
    { id: uuidv4(), label: 'প্রযুক্তি', to: '/topics/technology' },
    { id: uuidv4(), label: 'ভিডিও', to: '/topics/videe' },
  ];

  const navItems = ref(nav);
</script>
