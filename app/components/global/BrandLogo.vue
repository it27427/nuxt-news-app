<template>
  <client-only>
    <BaseLink to="/" class="topbar-link">
      <BasePicture class="logo">
        <BaseImage v-bind="brand" />
      </BasePicture>
    </BaseLink>
  </client-only>
</template>

<script setup lang="ts">
  const brand = ref({
    src: '/images/logo/logo.svg',
    alt: 'JONOPATH-BRAND-LOGO',
  });
</script>
