<template>
  <div class="flex flex-col gap-2">
    <div class="flex flex-col gap-2">
      <label
        v-if="label"
        :for="id"
        class="font-sans text-md font-medium text-dark dark:text-light"
      >
        {{ label }}
      </label>

      <input
        :id="id"
        :type="type"
        :placeholder="placeholder"
        :value="modelValue"
        @input="
          $emit('update:modelValue', ($event.target as HTMLInputElement).value)
        "
        :class="{
          'border-red-500': error,
          'border-gray-300 dark:border-dark-divider': !error,
          'focus:border-primary dark:focus:border-primary': !error,
          'focus:border-red-500 dark:focus:border-red-500': error,
        }"
        class="font-sans text-dark dark:text-light bg-transparent h-12 px-4 py-2 rounded-lg border transition-colors focus:outline-none"
      />
    </div>

    <p v-if="error" class="font-sans text-sm text-red-500">{{ error }}</p>
  </div>
</template>

<script setup lang="ts">
  import { toRefs } from 'vue';
  interface Props {
    id?: string;
    type?: string;
    label?: string;
    placeholder?: string;
    error?: string;
    modelValue: string;
  }

  const props = defineProps<Props>();

  const { id, type, label, placeholder, error, modelValue } = toRefs(props);

  const emit = defineEmits(['update:modelValue']);
</script>
