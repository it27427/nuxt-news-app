<template>
  <section :class="sectionClass">
    <div class="jonopath-container">
      <div
        class="bg-adGradient w-full h-64 md:h-40 flex items-center justify-center"
      >
        <h2 class="font-bold text-size2Xl md:text-2xl text-white">
          {{ title }}
        </h2>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
  import { ref } from 'vue';

  const title = ref('জনপথের বিজ্ঞাপন');

  const { sectionClass = '' } = defineProps<{
    sectionClass?: string | string[] | Record<string, boolean>;
  }>();
</script>
