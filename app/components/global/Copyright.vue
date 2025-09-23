<template>
  <p class="font-normal">
    কপিরাইট &copy;
    <span class="font-mono">{{ currentYear }}</span>
    <span class="font-bold">&nbsp;জনপথ.কম</span>
    &mdash; সর্বস্বত্ব সংরক্ষিত।
  </p>
</template>

<script setup lang="ts">
  const getCurrentFullYear = new Date().getFullYear();
  const currentYear = ref(getCurrentFullYear);
</script>
