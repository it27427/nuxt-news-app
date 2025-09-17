<template>
  <div class="flex flex-col gap-1">
    <label
      v-if="label"
      :for="id"
      class="font-sans text-md font-medium text-dark dark:text-light"
    >
      {{ label }}
    </label>

    <div class="relative w-full">
      <input
        :id="id"
        :type="type"
        :placeholder="placeholder"
        :value="modelValue"
        @input="onInput"
        :class="[
          'w-full font-sans text-dark dark:text-light bg-transparent h-12 px-4 py-2 rounded-lg border-2 transition-colors focus:outline-none',
          error
            ? 'border-red-500 focus:border-red-500'
            : validated
              ? 'border-green-500 focus:border-green-500'
              : 'border-gray-300 dark:border-dark-divider focus:border-primary dark:focus:border-primary',
        ]"
        autocomplete="off"
      />
    </div>

    <p v-if="error" class="text-sm text-red-500">{{ error }}</p>
  </div>
</template>

<script setup lang="ts">
  interface FormInputProps {
    id?: string;
    label?: string;
    type: string;
    placeholder: string;
    modelValue: string;
    error?: string;
    validated?: boolean;
  }

  const props = defineProps<FormInputProps>();
  const emit = defineEmits(['update:modelValue']);

  function onInput(event: Event) {
    emit('update:modelValue', (event.target as HTMLInputElement).value);
  }
</script>
