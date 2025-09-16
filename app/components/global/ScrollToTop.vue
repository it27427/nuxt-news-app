<template>
  <div
    ref="scrollTopButton"
    :class="['fixed md:bottom-1 right-5 z-modal', props.customClass]"
  >
    <div
      :class="[
        'transition-all duration-300 ease-in-out',
        isVisible
          ? 'opacity-100 translate-y-0' // যখন দৃশ্যমান
          : 'opacity-0 translate-y-5 pointer-events-none', // যখন অদৃশ্য
      ]"
    >
      <button
        @click="scrollToTop"
        class="bg-adGradient text-light border-0 cursor-pointer font-bold text-2xl w-10 h-10 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl focus:outline-none"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          fill="white"
          viewBox="0 0 16 16"
        >
          <path
            fill-rule="evenodd"
            d="M8 15a.5.5 0 0 0 .5-.5V2.707l3.146 3.147a.5.5 0 0 0 .708-.708l-4-4a.5.5 0 0 0-.708 0l-4 4a.5.5 0 1 0 .708.708L7.5 2.707V14.5a.5.5 0 0 0 .5.5"
          />
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { onMounted, onUnmounted, ref } from 'vue';

  const props = defineProps<{
    customClass?: string;
  }>();

  const isVisible = ref(false);

  const scrollThreshold = 200;

  const handleScroll = () => {
    isVisible.value = window.scrollY > scrollThreshold;
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  onMounted(() => {
    handleScroll();
    window.addEventListener('scroll', handleScroll);
  });

  onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll);
  });
</script>
