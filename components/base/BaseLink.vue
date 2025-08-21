<template>
  <NuxtLink :to="to" :class="linkClass">
    <slot />
  </NuxtLink>
</template>

<script setup>
defineProps({
  to: {
    type: String,
    required: true,
  },
  linkClass: {
    type: [String, Array, Object],
    default: "",
  },
});
</script>
