<template>
  <ul class="grid gap-4 lg:gap-6 grid-cols-2 lg:grid-cols-4">
    <li v-for="(menu, index) in socialMenu" :key="index">
      <client-only>
        <BaseLink
          :to="menu.to"
          class="flex items-center gap-4 text-dark-surface transition-all hover:text-dark-hover dark:text-white dark:hover:text-light-50 hover:underline"
        >
          <BasePicture
            class="w-12 h-12 md:w-16 md:h-16 flex items-center justify-center overflow-hidden"
          >
            <BaseImage
              :src="menu.icon"
              :alt="menu.label"
              class="object-contain w-full h-full"
              width="48"
              height="48"
            />
          </BasePicture>

          <span class="text-sizeBig font-sans font-bold">
            {{ menu.label }}
          </span>
        </BaseLink>
      </client-only>
    </li>
  </ul>
</template>

<script lang="ts" setup>
  import type { SocialItem } from '~~/types/news';

  defineProps<{
    socialMenu: SocialItem[];
  }>();
</script>
