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
  import BaseImage from '@/components/base/BaseImage.vue';
  import BaseLink from '@/components/base/BaseLink.vue';
  import BasePicture from '@/components/base/BasePicture.vue';
  import { ref } from 'vue';

  const brand = ref({
    src: '/images/logo/logo-v1.svg',
    alt: 'JONOPATH-BRAND-LOGO',
    // height: '32',
  });
</script>
