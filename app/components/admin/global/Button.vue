<template>
  <button :class="buttonClass" :type="buttonType" @click="emit('click')">
    <slot />
  </button>
</template>

<script setup lang="ts">
  const props = withDefaults(
    defineProps<{
      buttonType?: 'button' | 'submit' | 'reset';
      buttonClass?: string | string[] | Record<string, boolean>;
    }>(),
    {
      buttonType: 'button',
    }
  );

  const emit = defineEmits<{
    (e: 'click'): void;
  }>();
</script>
