<template>
  <div ref="dropdownRef" class="relative w-full">
    <!-- Dropdown Button -->
    <button
      type="button"
      @click="toggleDropdown"
      class="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm px-4 py-2 text-left focus:outline-none focus:ring-1 focus:ring-green-500 flex justify-between items-center flex-wrap gap-1"
    >
      <template v-if="selected.length">
        <span
          v-for="(item, index) in selected"
          :key="index"
          class="bg-green-500 text-white text-sm px-2 py-1 rounded flex items-center gap-1"
        >
          {{ item }}
          <button
            type="button"
            @click.stop="removeOption(item)"
            class="ml-1 text-white hover:text-gray-200"
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
      class="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md shadow-lg max-h-80 overflow-auto scrollbar-none"
    >
      <li
        v-for="(option, index) in props.options"
        :key="index"
        @click="toggleOption(option)"
        class="cursor-pointer px-4 py-2 flex justify-between items-center hover:bg-green-500 hover:text-white dark:hover:bg-green-600 dark:hover:text-white"
      >
        {{ option }}
        <span v-if="selected.includes(option)">✔</span>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
  import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue';

  const props = defineProps<{
    modelValue: string[];
    options: string[];
    placeholder?: string;
  }>();

  const emit = defineEmits<{
    (e: 'update:modelValue', value: string[]): void;
  }>();

  const open = ref(false);
  const selected = ref<string[]>([]);
  const dropdownRef = ref<HTMLElement | null>(null);

  const placeholder = props.placeholder || 'সংবাদ ধরন নির্বাচন করুন';

  const toggleDropdown = () => {
    open.value = !open.value;
  };

  // Toggle option selection
  const toggleOption = (option: string) => {
    if (selected.value.includes(option)) {
      selected.value = selected.value.filter((o) => o !== option);
    } else {
      selected.value.push(option);
    }
    emit('update:modelValue', selected.value);
  };

  // Remove option from selected (for tag close button)
  const removeOption = (option: string) => {
    selected.value = selected.value.filter((o) => o !== option);
    emit('update:modelValue', selected.value);
  };

  watch(
    () => props.modelValue,
    (newVal) => {
      selected.value = [...newVal];
    },
    { immediate: true }
  );

  // Display selected or placeholder
  const selectedLabel = computed(() =>
    selected.value.length ? selected.value.join(', ') : placeholder
  );

  // Close dropdown when clicking outside
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
