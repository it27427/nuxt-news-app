<script setup lang="ts">
  const layout = 'admin';
</script>

<template>
  <div :name="layout">
    <main>
      <slot />
    </main>
  </div>
</template>
