<template>
  <section class="max-w-4xl mx-auto p-6">
    <div v-if="loading" class="animate-pulse space-y-4">
      <div class="h-8 bg-gray-200 dark:bg-slate-700 rounded w-48"></div>
      <div class="h-6 bg-gray-200 dark:bg-slate-700 rounded w-32"></div>
      <div class="h-6 bg-gray-200 dark:bg-slate-700 rounded w-64"></div>
    </div>

    <div
      v-else-if="draft"
      class="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 space-y-4"
    >
      <h2 class="text-2xl font-bold text-gray-900 dark:text-white">
        {{ draft.title }}
      </h2>

      <div
        class="flex flex-col md:flex-row gap-4 text-gray-700 dark:text-gray-300"
      >
        <p>
          <strong>Author:</strong>
          {{ draft.username || draft.user_id }}
        </p>
        <p>
          <strong>Status:</strong>
          <span class="capitalize">{{ draft.status }}</span>
        </p>
        <p>
          <strong>Created At:</strong>
          {{ formatDate(draft.created_at) }}
        </p>
        <p>
          <strong>Updated At:</strong>
          {{ formatDate(draft.updated_at) }}
        </p>
      </div>

      <div class="border-t border-gray-200 dark:border-gray-700 pt-4">
        <h3 class="font-semibold mb-2">Content:</h3>
        <div class="prose dark:prose-invert max-w-full">
          <div v-html="draft.contentHtml"></div>
        </div>
      </div>

      <div class="flex gap-3 mt-4">
        <button
          @click="editDraft"
          class="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
        >
          <Icon icon="ic:round-edit" width="24" height="24" />
        </button>

        <button
          @click="goBack"
          class="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
        >
          <Icon
            class="text-size4Xl"
            icon="guidance:right-arrow"
            width="28"
            height="28"
          />
        </button>
      </div>
    </div>

    <div v-else class="text-center text-gray-500 dark:text-gray-400">
      Draft not found.
    </div>
  </section>
</template>

<script lang="ts" setup>
  import { Icon } from '@iconify/vue';
  import { onMounted, ref } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import { useToast } from 'vue-toastification';
  import { useDraftsStore } from '~~/store/drafts.store';

  definePageMeta({ layout: 'admin' });

  const route = useRoute();
  const router = useRouter();
  const toast = useToast();
  const draftsStore = useDraftsStore();

  const draft = ref<any | null>(null);
  const loading = ref(true);

  const draftId = route.params.id as string;

  const formatDate = (dateStr: string) => new Date(dateStr).toLocaleString();

  onMounted(async () => {
    try {
      loading.value = true;
      // Check if drafts are already loaded
      if (!draftsStore.drafts.length) await draftsStore.fetchDrafts();

      draft.value = draftsStore.drafts.find((d) => d.id === draftId) || null;
    } catch (err: any) {
      toast.error(err?.message || 'Failed to load draft!');
    } finally {
      loading.value = false;
    }
  });

  const editDraft = () => {
    if (draft.value) router.push(`/admin/drafts/${draftId}/edit`);
  };

  const goBack = () => router.push('/admin/drafts');
</script>
