<template>
  <FooterSkeleton v-if="loading" />

  <footer v-else :class="footerClass">
    <SvgIcon />
    <Copyright />
  </footer>
</template>

<script lang="ts" setup>
  const props = defineProps<{
    footerClass?: string | string[] | Record<string, boolean>;
  }>();
  const footerClass = props.footerClass;

  const loading = ref(true);
  onMounted(() => {
    setTimeout(() => (loading.value = false), 1200);
  });
</script>
