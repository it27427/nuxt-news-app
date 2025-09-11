<template>
  <div :name="layout">
    <main class="min-h-screen flex items-center justify-center">
      <slot />
    </main>
  </div>
</template>

<script setup lang="ts">
  const layout = 'authentication';
</script>
