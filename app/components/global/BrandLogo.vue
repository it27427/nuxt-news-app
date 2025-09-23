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
  import { ref } from 'vue';
  import BaseImage from '~/components/base/BaseImage.vue';
  import BaseLink from '~/components/base/BaseLink.vue';
  import BasePicture from '~/components/base/BasePicture.vue';

  const brand = ref({
    src: '/images/logo/logo.svg',
    alt: 'JONOPATH-BRAND-LOGO',
  });
</script>
