<template>
  <div ref="dropdownRef" class="relative w-full">
    <!-- Dropdown Button -->
    <button
      type="button"
      @click="toggleDropdown"
      class="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm px-4 py-2 text-left focus:outline-none focus:ring-1 focus:ring-green-500 flex justify-between items-center"
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

    <!-- Dropdown List -->
    <ul
      v-if="open"
      class="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md shadow-lg max-h-80 overflow-auto scrollbar-none"
    >
      <li
        v-for="(option, index) in props.options"
        :key="index"
        @click="selectOption(option)"
        class="cursor-pointer px-4 py-2 hover:bg-green-500 hover:text-white dark:hover:bg-green-600 dark:hover:text-white"
      >
        {{ option }}
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
  import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue';

  const props = defineProps<{
    modelValue: string | null;
    options: string[];
    placeholder?: string;
  }>();

  const emit = defineEmits<{
    (e: 'update:modelValue', value: string): void;
  }>();

  const open = ref(false);
  const selected = ref<string | null>(null);
  const dropdownRef = ref<HTMLElement | null>(null);

  const placeholder = props.placeholder || 'সংবাদ ধরন নির্বাচন করুন';

  const toggleDropdown = () => {
    open.value = !open.value;
  };

  const selectOption = (option: string) => {
    selected.value = option;
    open.value = false;
    emit('update:modelValue', option);
  };

  const selectedLabel = computed(() => selected.value || placeholder);

  watch(
    () => props.modelValue,
    (newVal) => {
      selected.value = newVal;
    },
    { immediate: true }
  );

  // ✅ Close dropdown when clicking outside
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
