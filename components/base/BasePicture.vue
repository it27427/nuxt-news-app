<template>
  <picture :class="pictureClass">
    <slot />
  </picture>
</template>

<script setup>
  defineProps({
    pictureClass: {
      type: [String, Array, Object],
      default: '',
    },
  });
</script>
