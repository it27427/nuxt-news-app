<template>
  <NuxtLink :to="to" :class="linkClass">
    <slot />
  </NuxtLink>
</template>

<script setup lang="ts">
const props = defineProps<{
  to: string
  linkClass?: string | string[] | Record<string, boolean>
}>();
</script>
