<template>
  <div
    class="bg-white dark:bg-dark dark:shadow-lg rounded-xl p-5 flex flex-col items-center justify-center transition duration-300"
  >
    <!-- Title -->
    <h3
      class="text-light-heading dark:text-slate-400 font-hind font-semibold text-sizeLg text-center"
    >
      {{ toBengaliText(title) }}
    </h3>

    <!-- Animated Value with Optional Suffix -->
    <p class="text-primary dark:text-primary mt-2 flex items-baseline gap-1">
      <span class="font-tino text-size3XXl font-bold">
        {{ toBengaliNumber(displayValue) }}
      </span>

      <span v-if="suffix" class="text-base font-medium font-hind">
        {{ toBengaliText(suffix) }}
      </span>
    </p>
  </div>
</template>

<script setup lang="ts">
  import type { MonitoringCardType as CardType } from '@/utils/adminPropTypes';
  import { onMounted, ref, watch } from 'vue';

  // Props
  const props = defineProps<CardType>();

  // Reactive value for animation
  const displayValue = ref(0);

  // Function: Convert English numbers to Bengali
  const toBengaliNumber = (num: number | string) => {
    const bengaliDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
    return num
      .toString()
      .split('')
      .map((d) => (/[0-9]/.test(d) ? bengaliDigits[parseInt(d)] : d))
      .join('');
  };

  // Function: Convert English text to Bengali
  const toBengaliText = (text?: string) => {
    const safeText = text ?? '';
    const map: Record<string, string> = {
      'Per News': 'প্রতি সংবাদ',
      'Total Users': 'মোট ব্যবহারকারী',
      'Total News Views': 'মোট সংবাদ ভিউ',
      'Total News Visitors': 'মোট সংবাদ দর্শক',
      'Total Ads Clicks': 'মোট বিজ্ঞাপন ক্লিক',
      Views: 'ভিউ',
      Visitors: 'দর্শক',
      Day: 'দিন',
      Month: 'মাস',
      Total: 'মোট',
    };

    // Sort keys by length to prevent partial replacements
    const keys = Object.keys(map).sort((a, b) => b.length - a.length);
    let converted = safeText;

    keys.forEach((key) => {
      const regex = new RegExp(`\\b${key}\\b`, 'gi'); // case-insensitive
      converted = converted.replace(regex, map[key] ?? '');
    });

    return converted;
  };

  // Function: Animate value from start to end over duration (ms)
  const animateValue = (start: number, end: number, duration: number) => {
    let startTimestamp: number | null = null;

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      displayValue.value = Math.round(progress * (end - start) + start);
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };

    window.requestAnimationFrame(step);
  };

  // Animate on mount and whenever props.value changes
  onMounted(() => {
    animateValue(0, props.value, 2500);
  });

  watch(
    () => props.value,
    (newVal) => {
      animateValue(displayValue.value, newVal, 2500);
    }
  );
</script>
