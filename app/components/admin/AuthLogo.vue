<template>
  <client-only>
    <BasePicture class="logo">
      <BaseImage v-bind="brand" />
    </BasePicture>
  </client-only>
</template>

<script setup lang="ts">
  const brand = ref({
    src: '/images/logo/logo.svg',
    alt: 'JONOPATH-BRAND-LOGO',
  });
</script>
