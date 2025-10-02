<template>
  <section class="flex flex-col gap-4">
    <h1>{{ title }}</h1>

    <form @submit.prevent="updateNewsContent" class="space-y-5">
      <!-- Category & Tag Selects -->
      <div class="flex flex-col md:flex-row items-center gap-4">
        <div class="w-full md:w-1/2">
          <CustomSelect
            v-model="selectedNewsType"
            :options="categoryOptions"
            placeholder="সংবাদ ধরন নির্বাচন করুন"
            multiple
          />
        </div>
        <div class="w-full md:w-1/2">
          <CustomSelect
            v-model="selectedNewsTag"
            :options="tagOptions"
            placeholder="ট্যাগ নির্বাচন করুন"
            multiple
          />
        </div>
      </div>

      <!-- TipTap Editor -->
      <TipTapEditor v-model="tiptapContent" />

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
  definePageMeta({ layout: 'admin' });

  import type { JSONContent } from '@tiptap/vue-3';
  import { computed, onMounted, ref } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import { useToast } from 'vue-toastification';
  import { useCategoriesStore } from '~~/store/categories.store';
  import { useNewsStore } from '~~/store/news.store';
  import { useTagsStore } from '~~/store/tags.store';
  import type { TiptapNode } from '~~/types/newstypes';

  interface Option {
    label: string;
    value: string;
  }

  const title = ref('সংবাদ আপডেট করুন');
  const toast = useToast();
  const router = useRouter();
  const route = useRoute();

  const newsStore = useNewsStore();
  const categoriesStore = useCategoriesStore();
  const tagsStore = useTagsStore();

  // Reactive refs
  const selectedNewsType = ref<Option[]>([]);
  const selectedNewsTag = ref<Option[]>([]);
  const tiptapContent = ref<JSONContent>({ type: 'doc', content: [] });

  // Computed dropdown options
  const categoryOptions = computed<Option[]>(() =>
    categoriesStore.categories.map((c) => ({ label: c.name, value: c.id }))
  );
  const tagOptions = computed<Option[]>(() =>
    tagsStore.tags.map((t) => ({ label: t.name, value: t.id }))
  );

  // Fetch categories, tags, and news
  onMounted(async () => {
    if (!categoriesStore.categories.length)
      await categoriesStore.fetchCategories();
    if (!tagsStore.tags.length) await tagsStore.fetchTags();

    const newsId = route.params.id as string;
    if (newsId) await fetchNews(newsId);
  });

  // --- Fetch Single News ---
  async function fetchNews(id: string) {
    try {
      await newsStore.fetchNewsList();
      const news = newsStore.newsList.find((n) => n.id === id);
      if (!news) return;

      newsStore.singleNews = news;

      // Populate selects
      selectedNewsType.value = news.categories.map((c) => ({
        label: c,
        value: c,
      }));
      selectedNewsTag.value = news.tags.map((t) => ({ label: t, value: t }));

      // Populate TipTap editor
      if (news.tiptap_json_for_editing)
        tiptapContent.value = news.tiptap_json_for_editing;
    } catch (err) {
      console.error('Failed to fetch news:', err);
      toast.error('সংবাদ লোড করতে ব্যর্থ হয়েছে!');
    }
  }

  // --- Build Payload (no validation) ---
  function buildPayload() {
    const tiptapPayload: TiptapNode = {
      type: tiptapContent.value.type || 'doc',
      content: tiptapContent.value.content as TiptapNode[] | undefined,
      attrs: tiptapContent.value.attrs,
    };

    return {
      categories: selectedNewsType.value.map((c) => c.value),
      tags: selectedNewsTag.value.map((t) => t.value),
      tiptap_json_for_editing: tiptapPayload,
    };
  }

  // --- Update News ---
  async function updateNewsContent() {
    try {
      const newsId = route.params.id as string;
      if (!newsId) return;

      const payload = buildPayload();
      await newsStore.updateNews(newsId, payload);

      toast.success('সংবাদ সফলভাবে আপডেট হয়েছে!');
      router.push('/admin/news/');
    } catch (err: any) {
      toast.error(err.message || 'সংবাদ আপডেট করতে ব্যর্থ হয়েছে!');
    }
  }
</script>
