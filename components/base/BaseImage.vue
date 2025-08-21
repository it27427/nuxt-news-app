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

<script setup>
  defineProps({
    src: {
      type: String,
      required: true,
    },
    alt: {
      type: String,
      default: 'JONOPATH-IMAGE',
    },
    width: {
      type: [String, Number],
      default: null,
    },
    height: {
      type: [String, Number],
      default: null,
    },
    format: {
      type: String,
      default: 'webp',
    },
    quality: {
      type: [String, Number],
      default: '',
    },
    sizes: {
      type: String,
      default: '',
    },
    imgClass: {
      type: [String, Array, Object],
      default: '',
    },
  });
</script>
