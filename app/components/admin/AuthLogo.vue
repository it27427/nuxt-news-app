<template>
  <client-only>
    <BasePicture class="logo">
      <BaseImage v-bind="brand" />
    </BasePicture>
  </client-only>
</template>

<script setup lang="ts">
  import BaseImage from '@/components/base/BaseImage.vue';
  import BasePicture from '@/components/base/BasePicture.vue';
  import { ref } from 'vue';

  const brand = ref({
    src: '/images/logo/logo.svg',
    alt: 'JONOPATH-BRAND-LOGO',
  });
</script>
