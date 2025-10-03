<template>
  <div
    class="relative"
    v-bind="otherAttrs"
    :class="finalClass"
    ref="dropdownRef"
  >
    <!-- Selected Value -->
    <button
      @click="toggleDropdown"
      type="button"
      class="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded px-4 py-2 flex justify-between items-center shadow-sm ring-1 focus:ring-green-500 active:ring-green-500 focus:border-green-500 active:border-green-500 focus:bg-green-50 dark:focus:bg-green-900 transition-all duration-150 outline-none"
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
      class="absolute z-50 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md shadow-lg max-h-80 overflow-auto scrollbar-none"
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
  import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue';

  interface Option {
    label: string;
    value: string;
  }

  const props = defineProps<{
    modelValue: string;
    options: Option[];
    className?: string;
    placeholder?: string;
  }>();

  const attrs = useAttrs();
  const finalClass = computed(() => {
    const clsFromAttrs = (attrs as Record<string, any>).class;
    if (clsFromAttrs) return clsFromAttrs as string;
    if (props.className) return props.className;
    return 'w-64';
  });

  const otherAttrs = computed(() => {
    const copy: Record<string, any> = {};
    for (const key in attrs) {
      if (key === 'class' || key === 'style') continue;
      copy[key] = (attrs as Record<string, any>)[key];
    }
    return copy;
  });

  const emit = defineEmits<{
    (e: 'update:modelValue', value: string): void;
  }>();

  const open = ref(false);
  const selected = ref(props.modelValue);
  const dropdownRef = ref<HTMLElement | null>(null);

  watch(
    () => props.modelValue,
    (val) => {
      selected.value = val;
    }
  );

  const selectedLabel = computed(() => {
    const found = props.options.find((opt) => opt.value === selected.value);
    return found ? found.label : (props.placeholder || 'Select...'); 
  });

  const toggleDropdown = () => {
    open.value = !open.value;
  };

  const selectOption = (option: Option) => {
    selected.value = option.value;
    emit('update:modelValue', option.value);
    open.value = false;
  };

  // Click outside to close
  const handleClickOutside = (event: MouseEvent) => {
    if (
      dropdownRef.value &&
      !dropdownRef.value.contains(event.target as Node)
    ) {
      open.value = false;
    }
  };

  onMounted(() => {
    document.addEventListener('click', handleClickOutside);
  });

  onBeforeUnmount(() => {
    document.removeEventListener('click', handleClickOutside);
  });
</script>
