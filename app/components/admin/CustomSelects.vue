<template>
  <div class="relative w-64">
    <!-- Selected Value -->
    <button
      @click="toggleDropdown"
      type="button"
      class="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded px-4 py-2 flex justify-between items-center shadow-sm hover:ring-1 hover:ring-blue-500 focus:outline-none"
    >
      <span>{{ selectedLabel }}</span>
      <svg
        class="w-5 h-5 ml-2 transition-transform duration-200"
        :class="{ 'rotate-180': open }"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M19 9l-7 7-7-7"
        />
      </svg>
    </button>

    <!-- Options Dropdown -->
    <ul
      v-show="open"
      class="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md shadow-lg max-h-80 overflow-auto scrollbar-none"
    >
      <li
        v-for="option in options"
        :key="option.value"
        @click="selectOption(option)"
        class="cursor-pointer px-4 py-2 flex justify-between items-center hover:bg-green-500 hover:text-white dark:hover:bg-green-600 dark:hover:text-white"
      >
        {{ option.label }}
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
  import { computed, ref, watch } from 'vue';

  interface Option {
    label: string;
    value: string;
  }

  // Props
  const props = defineProps<{
    modelValue: string;
    options: Option[];
  }>();

  const emit = defineEmits<{
    (e: 'update:modelValue', value: string): void;
  }>();

  // Reactive
  const open = ref(false);
  const selected = ref(props.modelValue);

  // Watch parent v-model changes
  watch(
    () => props.modelValue,
    (val) => {
      selected.value = val;
    }
  );

  const selectedLabel = computed(() => {
    const found = props.options.find((opt) => opt.value === selected.value);
    return found ? found.label : 'Select...';
  });

  const toggleDropdown = () => {
    open.value = !open.value;
  };

  const selectOption = (option: Option) => {
    selected.value = option.value;
    emit('update:modelValue', option.value);
    open.value = false;
  };
</script>
