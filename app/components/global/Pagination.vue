<template>
  <nav
    v-if="totalPages > 1"
    class="w-full flex items-center justify-center mt-6"
  >
    <ul class="pagination flex items-center gap-2">
      <!-- Previous button -->
      <li>
        <button
          class="page-link"
          @click="prevPageSet"
          :disabled="currentPage === 1"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            viewBox="0 0 16 16"
          >
            <path
              fill-rule="evenodd"
              d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0"
            />
          </svg>
        </button>
      </li>

      <!-- Page Numbers -->
      <li v-for="page in visiblePages" :key="page">
        <button
          class="page-link"
          :class="{ active: currentPage === page }"
          @click="goToPage(page)"
        >
          {{ page }}
        </button>
      </li>

      <!-- Next button -->
      <li>
        <button
          class="page-link"
          @click="nextPageSet"
          :disabled="currentPage === totalPages"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            viewBox="0 0 16 16"
          >
            <path
              fill-rule="evenodd"
              d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708"
            />
          </svg>
        </button>
      </li>
    </ul>
  </nav>
</template>

<script setup lang="ts">
  import { computed, ref, watch } from 'vue';

  const props = defineProps<{
    totalItems: number;
    itemsPerPage?: number;
    modelValue?: number;
    maxVisiblePages?: number;
  }>();

  const emit = defineEmits<{
    (e: 'update:modelValue', value: number): void;
  }>();

  const itemsPerPage = props.itemsPerPage ?? 10;
  const maxVisiblePages = props.maxVisiblePages ?? 5;
  const totalPages = computed(() => Math.ceil(props.totalItems / itemsPerPage));

  const currentPage = computed({
    get: () => props.modelValue ?? 1,
    set: (val: number) => emit('update:modelValue', val),
  });

  // Page range tracking
  const startPage = ref(1);
  const endPage = ref(Math.min(maxVisiblePages, totalPages.value));

  // Visible pages computation
  const visiblePages = computed(() => {
    const pages = [];
    for (
      let i = startPage.value;
      i <= Math.min(endPage.value, totalPages.value);
      i++
    ) {
      pages.push(i);
    }
    return pages;
  });

  // Go to specific page
  function goToPage(page: number) {
    if (page >= 1 && page <= totalPages.value) {
      currentPage.value = page;
      adjustPageRange();
    }
  }

  // Next page
  function nextPageSet() {
    if (currentPage.value < totalPages.value) {
      currentPage.value++;
      adjustPageRange();
    }
  }

  // Previous page
  function prevPageSet() {
    if (currentPage.value > 1) {
      currentPage.value--;
      adjustPageRange();
    }
  }

  // Adjust page range around current page
  function adjustPageRange() {
    let middle = Math.floor(maxVisiblePages / 2);
    let start = Math.max(currentPage.value - middle, 1);
    let end = Math.min(start + maxVisiblePages - 1, totalPages.value);

    // Ensure the range fills maxVisiblePages
    start = Math.max(end - maxVisiblePages + 1, 1);

    startPage.value = start;
    endPage.value = end;
  }

  // Watch total pages to reset range
  watch(totalPages, (newVal) => {
    startPage.value = 1;
    endPage.value = Math.min(maxVisiblePages, newVal);
  });
</script>
