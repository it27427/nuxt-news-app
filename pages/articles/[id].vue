<template>
  <div>
    <h1>Article Details {{ id }} Page</h1>
  </div>
</template>

<script setup>
const { id } = useRoute().params;
</script>
