<template>
  <div class="jonopath-container">
    <h1>Home Page</h1>
  </div>
</template>

<script setup lang="ts">
  const { data: homeData } = await useAsyncData('data', () => {
    return queryCollection('data').order('name', 'DESC').all();
  });
</script>
