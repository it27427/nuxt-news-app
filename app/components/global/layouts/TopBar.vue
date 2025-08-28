<template>
  <div class="topbar">
    <div class="jonopath-container">
      <div class="w-full h-full flex items-center justify-between">
        <BrandLogo />
        <DarkMode />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import BrandLogo from "@/components/global/BrandLogo.vue";
import DarkMode from "@/components/global/DarkMode.vue";
</script>
