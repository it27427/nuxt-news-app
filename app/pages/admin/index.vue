<template>
  <div>
    <h1>Admin Dashboard</h1>
    <p>Welcome,</p>
  </div>
</template>

<script setup lang="ts">
  definePageMeta({
    middleware: 'sidebase-auth',
  });
</script>
