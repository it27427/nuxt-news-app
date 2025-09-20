<template>
  <div class="flex flex-col gap-2">
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
        :type="inputType"
        :placeholder="placeholder"
        :value="modelValue"
        @input="onInput"
        @blur="onBlur"
        :class="[
          'relative w-full font-sans text-dark dark:text-light bg-transparent h-12 px-4 py-2 rounded-lg border-2 transition-colors focus:outline-none',
          error
            ? 'border-red-500 focus:border-red-500'
            : validated
              ? 'border-green-500 focus:border-green-500'
              : 'border-gray-300 dark:border-dark-divider focus:border-primary dark:focus:border-primary',
        ]"
        :autocomplete="autocomplete || 'off'"
        :disabled="disabled"
      />

      <!-- Password toggle -->
      <button
        v-if="type === 'password'"
        type="button"
        class="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer text-gray-400 hover:text-gray-600 transition-colors"
        @click="togglePasswordVisibility"
      >
        <svg
          v-if="!showPassword"
          xmlns="http://www.w3.org/2000/svg"
          class="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          stroke-width="2"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M12 4.5C7.305 4.5 3.165 7.24 1.5 12c1.665 4.76 5.805 7.5 10.5 7.5s8.835-2.74 10.5-7.5C20.835 7.24 16.695 4.5 12 4.5z"
          />
          <circle cx="12" cy="12" r="3" />
        </svg>

        <svg
          v-else
          xmlns="http://www.w3.org/2000/svg"
          class="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          stroke-width="2"
        >
          <path stroke-linecap="round" stroke-linejoin="round" d="M3 3l18 18" />
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M12 4.5C7.305 4.5 3.165 7.24 1.5 12c1.665 4.76 5.805 7.5 10.5 7.5s8.835-2.74 10.5-7.5C20.835 7.24 16.695 4.5 12 4.5z"
          />
          <circle cx="12" cy="12" r="3" />
        </svg>
      </button>
    </div>

    <p v-if="error" class="font-sans text-sm text-red-500">{{ error }}</p>
  </div>
</template>

<script setup lang="ts">
  import type { BaseInputProps } from '@/utils/adminPropTypes';
  import { computed, ref } from 'vue';

  const props = defineProps<BaseInputProps>();
  const emit = defineEmits(['update:modelValue', 'blur']);

  const showPassword = ref(false);
  const inputType = computed(() =>
    props.type === 'password' && showPassword.value
      ? 'text'
      : props.type || 'text'
  );

  function togglePasswordVisibility() {
    showPassword.value = !showPassword.value;
  }

  function onInput(event: Event) {
    emit('update:modelValue', (event.target as HTMLInputElement).value);
  }

  function onBlur() {
    emit('blur');
  }
</script>
