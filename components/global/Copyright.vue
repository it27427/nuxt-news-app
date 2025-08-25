<template>
  <p class="font-semibold">
    কপিরাইট &copy; {{ currentYear }} জনপথ.কম &ndash; সর্বস্বত্ব সংরক্ষিত।
  </p>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const getCurrentFullYear = new Date().getFullYear();
const currentYear = ref(getCurrentFullYear);
</script>
