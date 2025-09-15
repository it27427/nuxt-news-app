<template>
  <footer :class="footerClass">
    <h1>Admin Footer</h1>
  </footer>
</template>

<script lang="ts" setup>
  const props = defineProps<{
    footerClass?: string | string[] | Record<string, boolean>;
  }>();
  const footerClass = props.footerClass;
</script>
