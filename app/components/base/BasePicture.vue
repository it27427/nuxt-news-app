<template>
  <picture :class="pictureClass">
    <slot />
  </picture>
</template>

<script setup lang="ts">
const {
  pictureClass = ''
} = defineProps<{
  pictureClass?: string | string[] | Record<string, boolean>
}>()
</script>
