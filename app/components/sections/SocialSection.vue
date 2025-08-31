<template>
  <div class="flex flex-col gap-5">
    <h2 class="font-bold text-size2Xl md:text-2xl">{{ title }}</h2>

    <SocialMenu />
  </div>
</template>
<script lang="ts" setup>
  import SocialMenu from '@/components/global/menus/SocialMenu.vue';
  import { ref } from 'vue';

  const title = ref('সামাজিক মাধ্যমে জনপথ');
</script>
