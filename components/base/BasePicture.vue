<template>
  <picture :class="pictureClass">
    <slot />
  </picture>
</template>

<script setup lang="ts">
const props = defineProps<{
  pictureClass?: string | string[] | Record<string, boolean>
  srcset?: string
  caption?: string
}>();
</script>
