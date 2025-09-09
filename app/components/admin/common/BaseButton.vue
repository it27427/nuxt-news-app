<template>
  <button
    :type="type"
    :disabled="disabled || loading"
    class="w-full py-2 px-4 rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors"
    :class="[
      variantClasses,
      disabled || loading ? 'opacity-50 cursor-not-allowed' : '',
    ]"
    @click="$emit('click')"
  >
    <!-- Loading spinner -->
    <svg
      v-if="loading"
      class="animate-spin h-5 w-5 text-white"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        class="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        stroke-width="4"
      />
      <path
        class="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
      />
    </svg>

    <!-- Button Label -->
    <span>{{ label }}</span>
  </button>
</template>

<script setup lang="ts">
  import { computed } from 'vue';

  interface Props {
    label: string;
    type?: 'button' | 'submit' | 'reset';
    variant?: 'primary' | 'secondary' | 'danger';
    disabled?: boolean;
    loading?: boolean;
  }

  const props = withDefaults(defineProps<Props>(), {
    type: 'button',
    variant: 'primary',
    disabled: false,
    loading: false,
  });

  defineEmits(['click']);

  const variantClasses = computed(() => {
    switch (props.variant) {
      case 'primary':
        return 'bg-primary text-light hover:text-white hover:bg-primary-dark dark:bg-primary-dark dark:hover:bg-primary';
      case 'danger':
        return 'bg-red-600 text-white hover:bg-red-700';
      case 'secondary':
        return 'bg-gray-500 text-white hover:bg-gray-600';
      default:
        return 'bg-dark text-light hover:text-white hover:bg-dark-hover';
    }
  });
</script>
