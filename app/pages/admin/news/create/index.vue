<template>
  <section>
    <form @submit.prevent="publishContent" class="space-y-5">
      <div class="flex flex-col md:flex-row items-center gap-4">
        <!-- Category Select -->
        <div class="w-full md:w-1/2">
          <CustomSelect
            v-model="selectedNewsType"
            :options="categoryOptions"
            placeholder="সংবাদ ধরন নির্বাচন করুন"
            multiple
          />
        </div>

        <!-- Tag Select -->
        <div class="w-full md:w-1/2">
          <CustomSelect
            v-model="selectedNewsTag"
            :options="tagOptions"
            placeholder="ট্যাগ নির্বাচন করুন"
            multiple
          />
        </div>
      </div>

      <!-- Quill Editor -->
      <TipTapEditor />
      <client-only></client-only>

      <!-- Buttons -->
      <div class="flex items-center justify-end gap-3">
        <button
          type="button"
          @click="saveDraft"
          class="py-2 px-5 bg-slate-500 text-white hover:bg-slate-600 font-semibold font-hind text-xl transition-all delay-300"
        >
          সংরক্ষণ
        </button>

        <button
          type="submit"
          class="py-2 px-5 bg-green-500 text-white hover:bg-green-600 font-semibold text-xl transition-all delay-300"
        >
          প্রকাশ করুন
        </button>
      </div>
    </form>
  </section>
</template>

<script lang="ts" setup>
  import { computed, onMounted, ref } from 'vue';
  import { useCategoriesStore } from '~~/store/categories.store';
  import { useNewsStore } from '~~/store/news.store';
  import { useTagsStore } from '~~/store/tags.store';

  definePageMeta({
    layout: 'admin',
  });

  // ------------------
  // Option Interface
  // ------------------
  interface Option {
    label: string;
    value: string;
  }

  // ------------------
  // State & Stores
  // ------------------

  const newsStore = useNewsStore();
  const categoriesStore = useCategoriesStore();
  const tagsStore = useTagsStore();

  // ✅ Update: Use Option[] instead of string[]
  const selectedNewsType = ref<Option[]>([]);
  const selectedNewsTag = ref<Option[]>([]);

  // ------------------
  // Computed Options
  // ------------------
  const categoryOptions = computed<Option[]>(() =>
    categoriesStore.categories.map((c: { name: string }) => ({
      label: c.name,
      value: c.name,
    }))
  );

  const tagOptions = computed<Option[]>(() =>
    tagsStore.tags.map((t: { name: string }) => ({
      label: t.name,
      value: t.name,
    }))
  );

  // ------------------
  // Lifecycle: Fetch Categories & Tags
  // ------------------
  onMounted(async () => {
    if (!categoriesStore.categories.length)
      await categoriesStore.fetchCategories();
    if (!tagsStore.tags.length) await tagsStore.fetchTags();
  });

  // ------------------
  // Utility: Clean Delta
  // ------------------

  // ------------------
  // Actions
  // ------------------
  async function saveDraft() {
    try {
      const payload = {
        userId: 'user-id',
        username: 'username',
        userRole: 'admin' as 'admin' | 'super_admin',
        categories: selectedNewsType.value.map((c) => c.value),
        tags: selectedNewsTag.value.map((t) => t.value),
      };

      alert('সংবাদ সংরক্ষণাগারে সংরক্ষণ করা হয়েছে!');
    } catch (err) {
      console.error(err);
      alert('সংরক্ষণ করতে ব্যর্থ হয়েছে!');
    }
  }

  async function publishContent() {
    try {
      const payload = {
        userId: 'user-id',
        username: 'username',
        userRole: 'admin' as 'admin' | 'super_admin',
        categories: selectedNewsType.value.map((c) => c.value),
        tags: selectedNewsTag.value.map((t) => t.value),
      };

      alert('সংবাদ প্রকাশ করা হয়েছে!');
    } catch (err) {
      console.error(err);
      alert('প্রকাশ করতে ব্যর্থ হয়েছে!');
    }
  }
</script>

<style lang="scss" scoped>
  :deep(.ql-editor) {
    min-height: 40rem;
  }
  :deep(.ql-toolbar.ql-snow) {
    border-top-left-radius: 0.3125rem;
    border-top-right-radius: 0.3125rem;
  }
  :deep(.ql-container.ql-snow) {
    border-bottom-left-radius: 0.3125rem;
    border-bottom-right-radius: 0.3125rem;
  }
  :deep(.ql-snow .ql-tooltip) {
    left: 0.625rem !important;
    @apply bg-light text-dark dark:bg-slate-600 dark:text-white border-0;
  }
  :deep(.ql-snow .ql-tooltip.ql-editing input[type='text']) {
    @apply bg-transparent;
    &:focus {
      outline: none;
    }
  }
  :deep(.ql-snow .ql-tooltip a) {
    @apply text-dark dark:text-white;
  }
</style>
