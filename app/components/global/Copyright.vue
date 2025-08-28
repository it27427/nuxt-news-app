<template>
  <p class="font-normal">
    কপিরাইট &copy; {{ currentYear }} <span class="font-bold">জনপথ.কম</span> &mdash; 
    সর্বস্বত্ব সংরক্ষিত।
  </p>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const getCurrentFullYear = new Date().getFullYear();
const currentYear = ref(getCurrentFullYear);
</script>
