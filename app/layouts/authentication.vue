<template>
  <div :name="layout">
    <main>
      <slot />
    </main>
  </div>
</template>

<script setup lang="ts">
  const layout = 'authentication';
</script>
