<template>
  <div :class="bodyClass">
    <slot />
  </div>
</template>

<script lang="ts" setup>
  const props = defineProps<{
    bodyClass?: string | string[] | Record<string, boolean>;
  }>();
  const bodyClass = props.bodyClass;
</script>
