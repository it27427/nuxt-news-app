<template>
  <div
    v-show="isOpen"
    class="fixed inset-0 top-10 bottom-15 bg-black/50 z-40"
    @click="onClick"
  />
</template>

<script setup lang="ts">
const { isOpen, onClick } = defineProps<{
  isOpen: boolean;
  onClick: () => void;
}>();
</script>
