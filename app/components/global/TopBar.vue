<template>
  <div class="topbar">
    <div class="jonopath-container">
      <div class="w-full h-full flex items-center justify-between">
        <BrandLogo />
        <!-- Slot for the right side (DarkMode) -->
        <slot name="right" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts"></script>
