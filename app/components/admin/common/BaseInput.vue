<template>
  <div class="flex flex-col gap-1">
    <label v-if="label" :for="id" class="text-sm font-medium text-gray-700">
      {{ label }}
    </label>

    <input
      :id="id"
      :type="type"
      :placeholder="placeholder"
      v-model="modelValue"
      class="px-4 py-2 rounded-lg border border-gray-300 dark:border-dark-divider focus:ring-2 focus:ring-green-500 focus:outline-none"
    />

    <p v-if="error" class="text-sm text-red-500">{{ error }}</p>
  </div>
</template>

<script setup lang="ts">
  interface Props {
    id?: string;
    type?: string;
    label?: string;
    placeholder?: string;
    error?: string;
    modelValue: string;
  }

  const props = defineProps<Props>();
  const emit = defineEmits(['update:modelValue']);
</script>
