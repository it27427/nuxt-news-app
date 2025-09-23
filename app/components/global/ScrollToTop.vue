<template>
  <div
    ref="scrollTopButton"
    :class="['fixed md:bottom-1 right-5 z-modal', props.customClass]"
  >
    <div
      :class="[
        'transition-all duration-300 ease-in-out',
        isVisible
          ? 'opacity-100 translate-y-0'
          : 'opacity-0 translate-y-5 pointer-events-none',
      ]"
    >
      <button
        @click="scrollToTop"
        class="bg-adGradient text-light border-0 cursor-pointer font-bold w-10 h-10 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl focus:outline-none"
      >
        <client-only>
          <Icon name="guidance:up-arrow" width="28" height="28" />
        </client-only>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
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
