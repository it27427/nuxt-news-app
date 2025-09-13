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
        :class="[
          'relative w-full font-sans text-dark dark:text-light bg-transparent h-12 px-4 py-2 rounded-lg border-2 transition-colors focus:outline-none',
          error
            ? 'border-red-500 focus:border-red-500'
            : validated
              ? 'border-green-500 focus:border-green-500'
              : 'border-gray-300 dark:border-dark-divider focus:border-primary dark:focus:border-primary',
        ]"
        autocomplete="off"
      />

      <!-- Show/hide password -->
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
          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
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
          <path
            d="M17.94 17.94A5.94 5.94 0 0 1 12 20c-3.1 0-5.88-1.57-7.94-4.06M2.06 6.06a16.51 16.51 0 0 1 4.41-1.39A15.39 15.39 0 0 1 12 4c3.1 0 5.88 1.57 7.94 4.06M12 12a3 3 0 1 0-3 3 3 0 0 0 3-3zM1 1l22 22"
          />
        </svg>
      </button>
    </div>

    <!-- Reactive error message -->
    <p v-if="error" class="font-sans text-sm text-red-500">{{ error }}</p>
  </div>
</template>

<script setup lang="ts">
  import type { BaseInputProps } from '@/utils/adminPropTypes';
  import { computed, ref } from 'vue';

  const props = defineProps<BaseInputProps>();
  const emit = defineEmits(['update:modelValue']);

  const showPassword = ref(false);
  const inputType = computed(() =>
    props.type === 'password' && showPassword.value ? 'text' : props.type
  );

  function togglePasswordVisibility() {
    showPassword.value = !showPassword.value;
  }

  function onInput(event: Event) {
    emit('update:modelValue', (event.target as HTMLInputElement).value);
  }
</script>
