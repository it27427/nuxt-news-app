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
const props = withDefaults(
  defineProps<{
    pictureClass?: string | string[] | Record<string, boolean>
    figureClass?: string | string[] | Record<string, boolean>
    caption?: string
  }>(),
  {
    pictureClass: '',
    figureClass: '',
    caption: '',
  }
)
</script>
