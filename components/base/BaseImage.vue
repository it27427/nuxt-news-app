<template>
  <NuxtImg
    :src="src"
    :alt="alt"
    :width="width"
    :height="height"
    :class="imgClass"
    :format="format"
    :quality="quality"
    :sizes="sizes"
    loading="lazy"
  />
</template>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    src: string
    alt?: string
    width?: string | number
    height?: string | number
    format?: string
    quality?: string | number
    sizes?: string
    imgClass?: string | string[] | Record<string, boolean>
  }>(),
  {
    alt: 'JONOPATH-IMAGE',
    width: 150,
    height: 32,
    format: 'webp',
    quality: '',
    sizes: '',
    imgClass: '',
  }
)
</script>
