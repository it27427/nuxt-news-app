<template>
  <picture :class="pictureClass">
    <slot />
  </picture>
</template>

<script setup lang="ts">
defineProps({
  pictureClass: {
    type: [String, Array, Object],
    default: '',
  },
});
</script>
