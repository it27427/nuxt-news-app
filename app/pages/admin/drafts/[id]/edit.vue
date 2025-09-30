<template>
  <section>
    <form @submit.prevent="publishContent" class="flex flex-col gap-5">
      <!-- Categories & Tags -->
      <div class="flex flex-col md:flex-row gap-4">
        <CustomSelect
          v-model="selectedNewsType"
          :options="categoryOptions"
          multiple
          placeholder="ক্যাটেগরি নির্বাচন করুন"
        />
        <CustomSelect
          v-model="selectedNewsTag"
          :options="tagOptions"
          multiple
          placeholder="ট্যাগ নির্বাচন করুন"
        />
      </div>

      <!-- Tiptap Editor -->
      <ClientOnly>
        <TipTapEditor v-model="tiptapContent" />
      </ClientOnly>

      <!-- Buttons -->
      <div class="flex justify-end gap-3">
        <button
          type="button"
          @click="saveDraft"
          class="py-2 px-4 bg-slate-500 text-white rounded hover:bg-slate-600"
        >
          সংরক্ষণ করুন
        </button>
        <button
          type="submit"
          class="py-2 px-4 bg-green-500 text-white rounded hover:bg-green-600"
        >
          {{ submitButtonLabel }}
        </button>
      </div>
    </form>
  </section>
</template>

<script setup lang="ts">
  definePageMeta({ layout: 'admin' });

  import { computed, onMounted, ref } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import { useCategoriesStore } from '~~/store/categories.store';
  import { useDraftsStore } from '~~/store/drafts.store';
  import { useNewsStore } from '~~/store/news.store';
  import { useTagsStore } from '~~/store/tags.store';
  import type { TiptapNode } from '~~/types/newstypes';

  const draftsStore = useDraftsStore();
  const newsStore = useNewsStore();
  const categoriesStore = useCategoriesStore();
  const tagsStore = useTagsStore();
  const router = useRouter();
  const route = useRoute();

  const draftId = route.params.id as string;

  const tiptapContent = ref<TiptapNode>({ type: 'doc', content: [] });
  const selectedNewsType = ref<{ label: string; value: string }[]>([]);
  const selectedNewsTag = ref<{ label: string; value: string }[]>([]);

  const categoryOptions = computed(() =>
    categoriesStore.categories.map((c) => ({ label: c.name, value: c.id }))
  );

  const tagOptions = computed(() =>
    tagsStore.tags.map((t) => ({ label: t.name, value: t.id }))
  );

  const submitButtonLabel = computed(() =>
    (window as any).currentUser?.role === 'super_admin'
      ? 'প্রকাশ করুন'
      : 'সাবমিট করুন'
  );

  // --- Load draft ---
  onMounted(async () => {
    if (!categoriesStore.categories.length)
      await categoriesStore.fetchCategories();
    if (!tagsStore.tags.length) await tagsStore.fetchTags();

    await draftsStore.fetchDrafts();
    const draft = draftsStore.drafts.find((d) => d.id === draftId);
    if (!draft) return router.push('/admin/drafts');

    // Ensure type-safe tiptap content
    const node: any = draft.tiptap_json_for_editing || {
      type: 'doc',
      content: [],
    };
    if (!node.type) node.type = 'doc';
    tiptapContent.value = node as TiptapNode;

    selectedNewsType.value = draft.categories.map((c) => ({
      label: c,
      value: c,
    }));
    selectedNewsTag.value = draft.tags.map((t) => ({ label: t, value: t }));
  });

  // --- Save Draft ---
  async function saveDraft() {
    try {
      await draftsStore.updateDraft(draftId, {
        tiptap_json_for_editing: {
          ...tiptapContent.value,
          type: tiptapContent.value.type || 'doc',
        },
        categories: selectedNewsType.value.map((c) => c.value),
        tags: selectedNewsTag.value.map((t) => t.value),
      });
      router.push('/admin/drafts/');
    } catch (err: any) {
      console.error(err);
    }
  }

  // --- Publish / Submit ---
  async function publishContent() {
    try {
      const payload = {
        tiptap_json_for_editing: {
          ...tiptapContent.value,
          type: tiptapContent.value.type || 'doc',
        },
        categories: selectedNewsType.value.map((c) => c.value),
        tags: selectedNewsTag.value.map((t) => t.value),
      };

      await newsStore.createNews(payload);

      // Delete draft after publish
      await draftsStore.deleteDraft(draftId);

      router.push('/admin/news/');
    } catch (err: any) {
      console.error(err);
    }
  }
</script>
