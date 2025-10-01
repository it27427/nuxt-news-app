<template>
  <section>
    <form @submit.prevent="publishContent" class="flex flex-col gap-5">
      <!-- Categories & Tags -->
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

      <!-- Tiptap Editor -->
      <client-only>
        <TipTapEditor v-model="tiptapContent" />
      </client-only>

      <!-- Buttons -->
      <div class="flex items-center justify-end gap-3">
        <button
          type="button"
          @click="saveDraft"
          :disabled="loading"
          class="py-2 px-5 bg-slate-500 text-white hover:bg-slate-600 font-semibold rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          সংরক্ষণ করুন
        </button>

        <button
          type="submit"
          :disabled="loading"
          class="py-2 px-5 bg-green-500 text-white hover:bg-green-600 font-semibold rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {{ submitButtonLabel }}
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
  import { useAuthStore } from '~~/store/auth.store';
  import { useCategoriesStore } from '~~/store/categories.store';
  import { useDraftsStore } from '~~/store/drafts.store';
  import { useNewsStore } from '~~/store/news.store';
  import { useTagsStore } from '~~/store/tags.store';
  import type { TiptapNode } from '~~/types/newstypes';

  const toast = useToast();
  const router = useRouter();
  const authStore = useAuthStore();

  interface Option {
    label: string;
    value: string;
  }

  const newsStore = useNewsStore();
  const draftsStore = useDraftsStore();
  const categoriesStore = useCategoriesStore();
  const tagsStore = useTagsStore();

  const selectedNewsType = ref<Option[]>([]);
  const selectedNewsTag = ref<Option[]>([]);
  const tiptapContent = ref<JSONContent>({ type: 'doc', content: [] });

  /* --- Dropdown options --- */
  const categoryOptions = computed<Option[]>(() =>
    categoriesStore.categories.map((c) => ({ label: c.name, value: c.id }))
  );
  const tagOptions = computed<Option[]>(() =>
    tagsStore.tags.map((t) => ({ label: t.name, value: t.id }))
  );

  /* --- Loading state --- */
  const loading = computed(() => newsStore.loading || draftsStore.loading);

  /* --- Submit button label based on role --- */
  const submitButtonLabel = computed(() => {
    const role = authStore.user?.role;
    return role === 'super_admin' ? 'প্রকাশ করুন' : 'সাবমিট করুন';
  });

  /* --- Fetch categories and tags on mount --- */
  onMounted(async () => {
    if (!categoriesStore.categories.length)
      await categoriesStore.fetchCategories();
    if (!tagsStore.tags.length) await tagsStore.fetchTags();
  });

  /* --- Build payload without validation --- */
  function buildPayloadForNewsOrDraft() {
    const tiptapNode: TiptapNode = {
      type: tiptapContent.value.type || 'doc',
      content: tiptapContent.value.content as TiptapNode[] | undefined,
      attrs: tiptapContent.value.attrs,
    };

    return {
      categories: selectedNewsType.value.map((c) => c.value),
      tags: selectedNewsTag.value.map((t) => t.value),
      tiptap_json_for_editing: tiptapNode,
    };
  }

  /* --- Save Draft --- */
  async function saveDraft() {
    try {
      const payload = buildPayloadForNewsOrDraft();
      await draftsStore.createDraft(payload);
      toast.success('সংবাদ সফলভাবে সংরক্ষণাগারে সংরক্ষণ করা হয়েছে!');
      router.push('/admin/drafts/');
    } catch (err: any) {
      toast.error(
        err.message || 'সংবাদ সংরক্ষণাগারে সংরক্ষণ করতে ব্যর্থ হয়েছে!'
      );
    }
  }

  /* --- Publish / Submit News --- */
  async function publishContent() {
    try {
      const payload = buildPayloadForNewsOrDraft();
      const role = authStore.user?.role;

      await newsStore.createNews(payload);

      if (role === 'super_admin') {
        toast.success('সংবাদ সফলভাবে প্রকাশ করা হয়েছে!');
      } else {
        toast.success('সংবাদ সফলভাবে পর্যালোচনায় হয়েছে!');
      }

      router.push('/admin/news/');
    } catch (err: any) {
      toast.error(err.message || 'সংবাদ প্রকাশ করতে ব্যর্থ হয়েছে!');
    }
  }
</script>
