<template>
  <BaseLink to="/" class="topbar-link">
    <BasePicture class="logo">
      <BaseImage v-bind="brand" />
    </BasePicture>
  </BaseLink>
</template>

<script setup>
  import { ref } from 'vue';
  import BaseLink from '@/components/base/BaseLink.vue';
  import BasePicture from '@/components/base/BasePicture.vue';
  import BaseImage from '@/components/base/BaseImage.vue';

  const brand = ref({
    src: '/images/logo/logo-v1.webp',
    alt: 'JONOPATH-BRAND-LOGO',
    height: '32',
  });
</script>
