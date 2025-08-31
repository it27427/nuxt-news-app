<template>
  <div class="flex flex-col gap-5">
    <h2>{{ title }}</h2>
  </div>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';

  const title = ref('জনপথের বিজ্ঞাপন');
</script>
