<template>
  <footer class="bg-dark text-white">
    <div class="jonopath-container">
      <h1>Footer Component</h1>

      <!-- COPYRIGHT -->
      <div class="flex items-center justify-center border-t border-dark-border h-12">
        <Copyright />
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import Copyright from "@/components/global/Copyright.vue";
</script>
