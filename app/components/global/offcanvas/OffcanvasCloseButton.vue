<template>
  <button
    type="button"
    class="w-12 h-12 flex flex-col items-center justify-center relative focus:outline-none"
    @click="onClick"
  >
    <!-- Hamburger Icon -->
    <template v-if="!isOpen">
      <span class="block w-6 h-0.5 mx-auto bg-dark mb-1"/>
      <span class="block w-6 h-0.5 mx-auto bg-dark mb-1"/>
      <span class="block w-6 h-0.5 mx-auto bg-dark"/>
    </template>

    <!-- Close Icon -->
    <template v-else>
      <span class="block w-6 h-0.5 mx-auto bg-dark rotate-45 absolute"/>
      <span class="block w-6 h-0.5 mx-auto bg-dark -rotate-45 absolute"/>
    </template>
  </button>
</template>

<script setup lang="ts">
const { isOpen, onClick } = defineProps<{
  isOpen: boolean
  onClick: () => void
}>()
</script>
