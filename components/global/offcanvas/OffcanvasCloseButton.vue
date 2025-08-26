<template>
  <button
    class="text-dark w-12 h-12 flex items-center justify-center focus:outline-none"
    @click="onClick"
  >
    <i class="fa-solid fa-xmark"/>
  </button>
</template>

<script setup lang="ts">
const { onClick } = defineProps<{ onClick: () => void }>();
</script>
