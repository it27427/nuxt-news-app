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
    fetchpriority="high"
    loading="lazy"
  />
</template>

<script setup lang="ts">
  const {
    src,
    alt = 'JONOPATH-IMAGE',
    width = 'width',
    height = 'height',
    format = 'webp',
    quality = '',
    sizes = '',
    imgClass = '',
  } = defineProps<{
    src: string;
    alt?: string;
    width?: string | number;
    height?: string | number;
    format?: string;
    quality?: string | number;
    sizes?: string;
    imgClass?: string | string[] | Record<string, boolean>;
  }>();
</script>
