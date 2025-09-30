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

      <!-- Tiptap Editor -->
      <ClientOnly>
        <TipTapEditor v-model="tiptapContent" />
      </ClientOnly>

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

  // Fetch categories, tags, and news on mount
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
      await newsStore.fetchSingleNews(id);
      const news = newsStore.singleNews;
      if (!news) return;

      // Populate selects
      selectedNewsType.value = news.categories.map((c) => ({
        label: c,
        value: c,
      }));
      selectedNewsTag.value = news.tags.map((t) => ({ label: t, value: t }));

      // Populate Tiptap
      if (news.tiptap_json_for_editing) {
        tiptapContent.value = news.tiptap_json_for_editing;
      }
    } catch (err) {
      console.error('Failed to fetch news:', err);
      toast.error('সংবাদ লোড করতে ব্যর্থ হয়েছে!');
    }
  }

  // --- Build payload ---
  function buildPayload() {
    const nodes = tiptapContent.value.content ?? [];
    const firstNode = nodes[0] ?? null;

    let titleText: string | null = null;
    if (
      firstNode?.type === 'heading' &&
      firstNode.content?.[0]?.type === 'text'
    ) {
      titleText = firstNode.content[0].text?.trim() || null;
    }

    if (!titleText)
      throw new Error(
        'অনুগ্রহ করে Tiptap এডিটরের শুরুতে সংবাদটির শিরোনাম লিখুন।'
      );
    if (!selectedNewsType.value.length)
      throw new Error('দয়া করে অন্তত একটি ক্যাটেগরি নির্বাচন করুন।');

    const isOnlyTitle = nodes.length === 1 && nodes[0]?.type === 'heading';
    const isEmptyPara =
      nodes.length === 1 &&
      nodes[0]?.type === 'paragraph' &&
      !nodes[0]?.content;
    if (isOnlyTitle || isEmptyPara)
      throw new Error('News content cannot be empty.');

    // --- Cast tiptap_content to TiptapNode ---
    const tiptapPayload: TiptapNode = {
      type: tiptapContent.value.type || 'doc',
      content: nodes as TiptapNode[],
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
