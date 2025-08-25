<template>
  <div class="jonopath-container">
    <h1>Video Details {{ id }} Page</h1>
  </div>
</template>

<script setup>
const { id } = useRoute().params;
</script>
