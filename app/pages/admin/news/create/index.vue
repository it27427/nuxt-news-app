<template>
  <section>
    <form @submit.prevent="publishContent" class="space-y-5">
      <div class="flex flex-col md:flex-row gap-4">
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

      <ClientOnly>
        <TipTapEditor v-model="tiptapContent" />
      </ClientOnly>

      <div class="flex items-center justify-end gap-3">
        <button
          type="button"
          @click="saveDraft"
          :disabled="newsStore.loading"
          class="py-2 px-5 bg-slate-500 text-white hover:bg-slate-600 font-semibold rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          সংরক্ষণ
        </button>

        <button
          type="submit"
          :disabled="newsStore.loading"
          class="py-2 px-5 bg-green-500 text-white hover:bg-green-600 font-semibold rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {{ newsStore.loading ? 'প্রকাশ হচ্ছে...' : 'প্রকাশ করুন' }}
        </button>
      </div>
    </form>
  </section>
</template>

<script lang="ts" setup>
  definePageMeta({ layout: 'admin' });

  import type { JSONContent } from '@tiptap/vue-3';
  import { computed, onMounted, ref } from 'vue';
  import { useRouter } from 'vue-router';
  import { useCategoriesStore } from '~~/store/categories.store';
  import { useNewsStore } from '~~/store/news.store';
  import { useTagsStore } from '~~/store/tags.store';

  const toast = useToast();
  const router = useRouter();

  interface Option {
    label: string;
    value: string;
  }

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

  // Fetch categories and tags on mount
  onMounted(async () => {
    if (!categoriesStore.categories.length)
      await categoriesStore.fetchCategories();
    if (!tagsStore.tags.length) await tagsStore.fetchTags();
  });

  // --- Build payload safely ---
  function buildPayload() {
    const nodes = tiptapContent.value.content ?? [];
    const firstNode = nodes[0] ?? null;

    let title: string | null = null;
    if (
      firstNode?.type === 'heading' &&
      firstNode.content?.[0]?.type === 'text'
    ) {
      title = firstNode.content[0].text?.trim() || null;
    }

    if (!title)
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

    return {
      title,
      subtitle: null,
      categories: selectedNewsType.value.map((c) => c.value),
      tags: selectedNewsTag.value.map((t) => t.value),
      tiptap_json_for_editing: {
        ...tiptapContent.value,
        type: tiptapContent.value.type || 'doc', // ✅ Ensure type is always string
      },
    };
  }

  // --- Actions ---
  async function saveDraft() {
    try {
      const payload = buildPayload();
      await newsStore.createDraft(payload);
      toast.success('সংবাদ সফলভাবে Draft এ সংরক্ষণ করা হয়েছে!');
      router.push('/admin/drafts/');
    } catch (err: any) {
      toast.error(err.message || 'সংরক্ষণ করতে ব্যর্থ হয়েছে!');
    }
  }

  async function publishContent() {
    try {
      const payload = buildPayload();

      // Example: Check superadmin flag (replace with your auth logic)
      const isSuperAdmin = (window as any).currentUser?.role === 'super_admin';

      if (isSuperAdmin) {
        await newsStore.createArticle(payload, 'approved');
        toast.success('সংবাদ সফলভাবে প্রকাশ করা হয়েছে!');
      } else {
        await newsStore.createPendingNews(payload);
        toast.success('সংবাদ সফলভাবে Pending এ জমা দেওয়া হয়েছে!');
      }

      router.push('/admin/news/');
    } catch (err: any) {
      toast.error(err.message || 'প্রকাশ করতে ব্যর্থ হয়েছে!');
    }
  }
</script>
