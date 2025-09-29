<template>
  <section class="flex flex-col gap-4">
    <h1>{{ title }}</h1>

    <form @submit.prevent="updateNewsContent" class="space-y-5">
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
      <client-only>
        <div>
          <QuillEditor v-model:content="body" contentType="json" />
        </div>
      </client-only>

      <!-- Preview Cleaned Delta -->
      <div class="mt-4">
        <h3>Editor Output (JSON/Delta) - Cleaned Data</h3>
        <pre>{{ finalBody.ops || finalBody }}</pre>
      </div>

      <!-- Buttons -->
      <div class="flex items-center justify-end gap-3">
        <button
          type="submit"
          class="py-2 px-5 bg-blue-500 text-white hover:bg-blue-600 font-semibold text-xl transition-all delay-300"
        >
          আপডেট করুন
        </button>
      </div>
    </form>
  </section>
</template>

<script lang="ts" setup>
  import Delta from 'quill-delta';
  import { computed, onMounted, ref } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import { useToast } from 'vue-toastification';
  import { useCategoriesStore } from '~~/store/categories.store';
  import { useNewsStore } from '~~/store/news.store';
  import { useTagsStore } from '~~/store/tags.store';

  definePageMeta({ layout: 'admin' });

  const title = ref('সংবাদ সংযোজন করুন');

  // ------------------
  // Option Interface
  // ------------------
  interface Option {
    label: string;
    value: string;
  }

  // ------------------
  // Stores & State
  // ------------------
  const newsStore = useNewsStore();
  const categoriesStore = useCategoriesStore();
  const tagsStore = useTagsStore();
  const route = useRoute();
  const router = useRouter();
  const toast = useToast();

  const body = ref<Delta>(new Delta());
  const finalBody = computed(() => cleanDelta(body.value));

  const selectedNewsType = ref<Option[]>([]);
  const selectedNewsTag = ref<Option[]>([]);

  // ------------------
  // Computed Options
  // ------------------
  const categoryOptions = computed<Option[]>(() =>
    categoriesStore.categories.map((c) => ({ label: c.name, value: c.name }))
  );
  const tagOptions = computed<Option[]>(() =>
    tagsStore.tags.map((t) => ({ label: t.name, value: t.name }))
  );

  // ------------------
  // Lifecycle: Fetch Categories, Tags, and News
  // ------------------
  onMounted(async () => {
    if (!categoriesStore.categories.length)
      await categoriesStore.fetchCategories();
    if (!tagsStore.tags.length) await tagsStore.fetchTags();

    const newsId = route.params.id as string;
    if (newsId) await fetchNews(newsId);
  });

  // ------------------
  // Fetch Single News
  // ------------------
  async function fetchNews(id: string) {
    try {
      await newsStore.fetchSingleNews(id);
      const news = newsStore.singleNews;
      if (!news) return;

      // Populate selects
      selectedNewsType.value = news.categories.map((c) => ({
        label: c,
        value: c,
      }));
      selectedNewsTag.value = news.tags.map((t) => ({ label: t, value: t }));

      // Populate Quill
      if (news.quill_data_for_editing) body.value = news.quill_data_for_editing;
    } catch (err) {
      console.error('Failed to fetch news:', err);
      toast.error('সংবাদ লোড করতে ব্যর্থ হয়েছে!');
    }
  }

  // ------------------
  // Utility: Clean Delta
  // ------------------
  function cleanDelta(delta: Delta): Delta {
    const newOps: any[] = [...delta.ops];
    while (newOps.length > 0 && newOps[0].insert === '\n') newOps.shift();
    while (newOps.length > 0 && newOps[newOps.length - 1].insert === '\n')
      newOps.pop();
    return new Delta(newOps);
  }

  // ------------------
  // Update News
  // ------------------
  async function updateNewsContent() {
    if (!finalBody.value.ops.length) {
      toast.error('কোনো কন্টেন্ট নেই!');
      return;
    }

    try {
      const newsId = route.params.id as string;
      if (!newsId) return;

      const payload = {
        categories: selectedNewsType.value.map((c) => c.value),
        tags: selectedNewsTag.value.map((t) => t.value),
        quill_data_for_editing: finalBody.value,
      };

      await newsStore.updateNews(newsId, payload);
      toast.success('সংবাদ সফলভাবে আপডেট হয়েছে!');
      router.push('/admin/news');
    } catch (err) {
      console.error(err);
      toast.error('সংবাদ আপডেট করতে ব্যর্থ হয়েছে!');
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
