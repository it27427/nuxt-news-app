<template>
  <div ref="preloaderRef" class="preloader">
    <div class="preloader-content">
      <h2 class="preloader-percent">{{ displayedProgress }}%</h2>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { ref, onMounted } from 'vue';
  import { gsap } from 'gsap';

  const emit = defineEmits<{ (e: 'hide'): void }>();
  const displayedProgress = ref(0);
  const preloaderRef = ref<HTMLElement | null>(null);

  onMounted(() => {
    // Animate progress 0 -> 100
    gsap.to(displayedProgress, {
      value: 100,
      duration: 2,
      ease: 'power1.out',
      onUpdate() {
        displayedProgress.value = Math.floor(displayedProgress.value);
      },
    });

    // Fade out preloader after window load
    window.addEventListener('load', () => {
      if (!preloaderRef.value) return;

      gsap.to(preloaderRef.value, {
        opacity: 0,
        duration: 0.7,
        ease: 'power2.inOut',
        onComplete() {
          emit('hide'); // main content appears
        },
      });
    });
  });
</script>
