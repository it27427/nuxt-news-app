<template>
  <div ref="dropdownRef" class="relative w-full">
    <!-- Dropdown Button -->
    <button
      type="button"
      @click="toggleDropdown"
      class="w-full h-12 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 dark:text-white rounded px-4 py-2 flex justify-between items-center gap-2 shadow-sm ring-1 focus:ring-green-500 active:ring-green-500 focus:border-green-500 active:border-green-500 focus:bg-green-50 dark:focus:bg-green-900 transition-all duration-150 outline-none"
    >
      <template v-if="selected.length">
        <span
          v-for="(item, index) in selected"
          :key="index"
          class="bg-green-500 ring-1 ring-green-500 text-white px-2 py-1 rounded flex items-center gap-1 text-xs"
        >
          <span class="inline-block mr-1">{{ item.label }}</span>
          <button
            type="button"
            @click.stop="removeOption(item)"
            class="text-white hover:text-gray-200"
          >
            &times;
          </button>
        </span>
      </template>
      <template v-else>
        <span class="text-gray-400">{{ placeholder }}</span>
      </template>

      <svg
        class="w-5 h-5 ml-auto transition-transform duration-200"
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

    <!-- Dropdown List -->
    <ul
      v-if="open"
      class="absolute z-50 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md shadow-lg max-h-80 overflow-auto scrollbar-none"
    >
      <li
        v-for="(option, index) in props.options"
        :key="index"
        @click="toggleOption(option)"
        class="cursor-pointer px-4 py-2 flex justify-between items-center hover:bg-green-500 hover:text-white dark:hover:bg-green-600 dark:hover:text-white"
      >
        {{ option.label }}
        <span v-if="selected.some((s) => s.value === option.value)">✔</span>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
  import { onBeforeUnmount, onMounted, ref, watch } from 'vue';

  interface Option {
    label: string;
    value: string;
  }

  const props = defineProps<{
    modelValue: Option[];
    options: Option[];
    placeholder?: string;
  }>();

  const emit = defineEmits<{
    (e: 'update:modelValue', value: Option[]): void;
  }>();

  const open = ref(false);
  const selected = ref<Option[]>([]);
  const dropdownRef = ref<HTMLElement | null>(null);
  const placeholder = props.placeholder || 'Select...';

  const toggleDropdown = () => {
    open.value = !open.value;
  };

  const toggleOption = (option: Option) => {
    const exists = selected.value.find((s) => s.value === option.value);
    if (exists) {
      selected.value = selected.value.filter((s) => s.value !== option.value);
    } else {
      selected.value.push(option);
    }
    emit('update:modelValue', selected.value);
  };

  const removeOption = (option: Option) => {
    selected.value = selected.value.filter((s) => s.value !== option.value);
    emit('update:modelValue', selected.value);
  };

  watch(
    () => props.modelValue,
    (newVal) => {
      selected.value = [...newVal];
    },
    { immediate: true }
  );

  const handleClickOutside = (event: MouseEvent) => {
    if (
      dropdownRef.value &&
      !dropdownRef.value.contains(event.target as Node)
    ) {
      open.value = false;
    }
  };

  onMounted(() => {
    window.addEventListener('click', handleClickOutside);
  });

  onBeforeUnmount(() => {
    window.removeEventListener('click', handleClickOutside);
  });
</script>
