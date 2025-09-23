<template>
  <SocialMenuSkeleton v-if="loading" />

  <div v-else class="flex flex-col gap-5">
    <h2 class="font-bold text-size2Xl md:text-2xl">{{ title }}</h2>
    <SocialMenu :socialMenu="socialMenu" />
  </div>
</template>

<script lang="ts" setup>
  import type { SocialItem } from '~~/types/news';

  const loading = ref(true);

  const title = ref('সামাজিক মাধ্যমে জনপথ');

  const socialMenu = ref<SocialItem[]>([
    { label: 'WhatsApp', to: '#', icon: '/images/social/whatsapp.svg' },
    { label: 'Facebook', to: '#', icon: '/images/social/facebook.svg' },
    { label: 'YouTube', to: '#', icon: '/images/social/youtube.svg' },
    { label: 'X', to: '#', icon: '/images/social/x.svg' },
    { label: 'Instagram', to: '#', icon: '/images/social/instagram.svg' },
    { label: 'TikTok', to: '#', icon: '/images/social/tiktok.svg' },
  ]);

  onMounted(() => {
    setTimeout(() => {
      loading.value = false;
    }, 2000);
  });
</script>
