<template>
  <figure :class="figureClass">
    <picture :class="pictureClass">
      <slot />
    </picture>
    <!-- Only render figcaption if a slot or prop is provided -->
    <figcaption v-if="caption">{{ caption }}</figcaption>
  </figure>
</template>

<script setup lang="ts">
defineProps({
  pictureClass: {
    type: [String, Array, Object],
    default: '',
  },
  figureClass: {
    type: [String, Array, Object],
    default: '',
  },
  caption: {
    type: String,
    default: '',
  },
});
</script>
