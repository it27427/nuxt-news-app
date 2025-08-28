<template>
  <div class="topbar">
    <div class="jonopath-container">
      <div class="w-full h-full flex items-center justify-between">
        <BrandLogo />
        <DarkModeToggle />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import BrandLogo from "@/components/global/BrandLogo.vue";
import DarkModeToggle from "@/components/global/DarkModeToggle.vue";
</script>
