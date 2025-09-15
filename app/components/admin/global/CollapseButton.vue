<template>
  <Button
    type="button"
    @click="toggleSidebar"
    class="flex items-center justify-center"
    :class="[open ? 'w-10 h-10' : 'w-8 h-8']"
  >
    <Icon
      :class="[
        open ? 'rotate-180 text-size4Xl' : 'rotate-0 text-size3XXl',
        'transition-transform',
      ]"
      name="guidance:left-arrow"
      width="28"
      height="28"
    />
  </Button>
</template>

<script lang="ts" setup>
  import Button from '@/components/admin/global/Button.vue';

  const { open } = defineProps<{ open: boolean }>();
  const emit = defineEmits<{ (e: 'toggle'): void }>();

  const toggleSidebar = () => emit('toggle');
</script>
