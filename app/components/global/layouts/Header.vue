<template>
  <header :class="headerClass">
    <slot />
  </header>
</template>

<script setup lang="ts">
  const props = defineProps<{
    headerClass?: string | string[] | Record<string, boolean>;
  }>();
  const headerClass = props.headerClass;
</script>
