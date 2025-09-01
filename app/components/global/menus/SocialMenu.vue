<template>
  <ul class="grid gap-4 lg:gap-6 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
    <li v-for="(menu, index) in socialMenu" :key="index">
      <client-only>
        <NuxtLink
          :to="menu.to"
          class="flex items-center gap-4 text-dark-surface transition-all hover:text-dark-hover dark:text-white dark:hover:text-light-50 hover:underline"
        >
          <BasePicture
            class="w-12 h-12 md:w-16 md:h-16 flex items-center justify-center overflow-hidden"
          >
            <BaseImage
              :src="menu.icon"
              :alt="menu.label"
              :srcset="menu.icon"
              class="object-contain w-full h-full"
              width="48"
              height="48"
            />
          </BasePicture>

          <span class="text-sizeBig font-sans font-bold">
            {{ menu.label }}
          </span>
        </NuxtLink>
      </client-only>
    </li>
  </ul>
</template>

<script lang="ts" setup>
  import type { SocialItem } from '@/types/news';
  import { ref } from 'vue';

  const socialMenu = ref<SocialItem[]>([
    {
      label: 'WhatsApp',
      to: '#',
      icon: '/images/social/whatsapp.svg',
    },
    { label: 'Facebook', to: '#', icon: '/images/social/facebook.svg' },
    { label: 'YouTube', to: '#', icon: '/images/social/youtube.svg' },
    { label: 'X', to: '#', icon: '/images/social/x.svg' },
    {
      label: 'Instagram',
      to: '#',
      icon: '/images/social/instagram.svg',
    },
    { label: 'TikTok', to: '#', icon: '/images/social/tiktok.svg' },
  ]);
</script>
