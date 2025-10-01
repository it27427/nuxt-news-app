<template>
  <section class="p-6">
    <h1 class="text-2xl font-bold mb-4">{{ title }}</h1>

    <!-- Loading Skeleton -->
    <div v-if="approvalStore.loading" class="space-y-4">
      <!-- Header skeleton -->
      <div class="flex items-center justify-between gap-4">
        <div
          class="h-6 w-64 bg-gray-200 dark:bg-slate-700 rounded animate-pulse"
        ></div>
        <div
          class="h-6 w-32 bg-gray-200 dark:bg-slate-700 rounded animate-pulse"
        ></div>
      </div>

      <!-- Skeleton table -->
      <div
        class="mt-4 border border-gray-200 dark:border-gray-700 rounded overflow-hidden"
      >
        <div class="grid grid-cols-5 gap-0 bg-gray-50 dark:bg-gray-800 p-3">
          <div
            class="h-5 w-full bg-gray-200 dark:bg-slate-700 rounded animate-pulse"
          ></div>
          <div
            class="h-5 w-full bg-gray-200 dark:bg-slate-700 rounded animate-pulse"
          ></div>
          <div
            class="h-5 w-full bg-gray-200 dark:bg-slate-700 rounded animate-pulse"
          ></div>
          <div
            class="h-5 w-full bg-gray-200 dark:bg-slate-700 rounded animate-pulse"
          ></div>
          <div
            class="h-5 w-full bg-gray-200 dark:bg-slate-700 rounded animate-pulse"
          ></div>
        </div>

        <div class="divide-y divide-gray-100 dark:divide-gray-700">
          <div
            v-for="n in 6"
            :key="n"
            class="p-4 grid grid-cols-5 gap-4 items-center"
          >
            <div
              class="h-5 w-8 bg-gray-200 dark:bg-slate-700 rounded animate-pulse"
            ></div>
            <div
              class="h-5 w-full bg-gray-200 dark:bg-slate-700 rounded animate-pulse col-span-2"
            ></div>
            <div
              class="h-5 w-32 bg-gray-200 dark:bg-slate-700 rounded animate-pulse"
            ></div>
            <div
              class="h-5 w-24 bg-gray-200 dark:bg-slate-700 rounded animate-pulse"
            ></div>
            <div class="flex gap-2 justify-end col-span-1">
              <div
                class="h-8 w-20 bg-gray-200 dark:bg-slate-700 rounded animate-pulse"
              ></div>
              <div
                class="h-8 w-20 bg-gray-200 dark:bg-slate-700 rounded animate-pulse"
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="approvalStore.error" class="text-red-500">
      {{ approvalStore.error }}
    </div>

    <!-- Empty -->
    <div
      v-else-if="approvalStore.approvalList.length === 0"
      class="text-gray-500"
    >
      কোনো সংবাদ পাওয়া যায়নি।
    </div>

    <!-- Approval Table -->
    <table
      v-else
      class="w-full border border-gray-200 dark:border-gray-700 text-left mt-4"
      role="table"
      aria-label="Approval table"
    >
      <thead class="bg-gray-100 dark:bg-gray-800">
        <tr>
          <th class="p-3 border-b">Title</th>
          <th class="p-3 border-b">Status</th>
          <th class="p-3 border-b">Approval Status</th>
          <th class="p-3 border-b">Created At</th>
          <th class="p-3 border-b">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="news in approvalStore.approvalList"
          :key="news.id"
          class="hover:bg-gray-50 dark:hover:bg-gray-900"
        >
          <td class="p-3 font-semibold align-top max-w-xl break-words">
            {{ news.title || 'Untitled' }}
            <div class="text-xs text-gray-500 mt-1">
              <template v-if="news.tiptap_json_for_editing">
                <!-- small preview from tiptap json: show first text node if possible -->
                <span
                  v-html="renderPreview(news.tiptap_json_for_editing)"
                ></span>
              </template>
            </div>
          </td>
          <td class="p-3 capitalize align-top">{{ news.status }}</td>
          <td class="p-3 capitalize align-top">{{ news.approval_status }}</td>
          <td class="p-3 align-top">{{ formatDate(news.created_at) }}</td>
          <td class="p-3 flex gap-2">
            <button
              @click="takeAction(news.id, 'pending')"
              class="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
              aria-label="Mark as pending"
            >
              Pending
            </button>

            <button
              @click="takeAction(news.id, 'approved')"
              class="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
              aria-label="Approve news"
            >
              Approve
            </button>

            <button
              @click="takeAction(news.id, 'rejected')"
              class="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
              aria-label="Reject news"
            >
              Reject
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </section>
</template>

<script setup lang="ts">
  import { onMounted } from 'vue';
  import { useToast } from 'vue-toastification';
  import { useApprovalStore } from '~~/store/approval.store';

  const title = ref('সংবাদ অনুমোদন প্যানেল');

  // meta
  definePageMeta({
    layout: 'admin',
  });

  const approvalStore = useApprovalStore();
  const toast = useToast();

  onMounted(() => {
    approvalStore.fetchApprovalList();
  });

  // helper: format date
  const formatDate = (d: string | Date | undefined) => {
    if (!d) return '-';
    try {
      return new Date(d).toLocaleString();
    } catch {
      return String(d);
    }
  };

  /**
   * takeAction wrapper that calls store and shows toast.
   * The store already removes the item locally on success.
   */
  const takeAction = async (
    newsId: string,
    newStatus: 'pending' | 'approved' | 'rejected'
  ) => {
    try {
      await approvalStore.takeAction(newsId, newStatus);
      toast.success(`News marked ${newStatus}`);
      // optional: re-fetch for fresh list
      await approvalStore.fetchApprovalList();
    } catch (err: any) {
      toast.error(err?.message || 'Action failed!');
    }
  };

  /**
   * Render a small HTML preview from Tiptap JSON.
   * This is a minimal safe extractor: it finds first paragraph/heading text.
   * It returns escaped small snippet (not full HTML conversion).
   */
  const renderPreview = (tiptapJson: any) => {
    try {
      const doc = tiptapJson;
      if (!doc) return '';

      const nodes = doc.content || (Array.isArray(doc) ? doc : []);
      for (const node of nodes) {
        if (!node) continue;
        if (node.type === 'paragraph' || node.type === 'heading') {
          const text = (node.content || [])
            .map((c: any) => (c?.text ? c.text : ''))
            .join(' ')
            .trim();
          if (text) {
            // escape text for HTML
            return escapeHtml(text).slice(0, 250);
          }
        }
        // images or youtube: show caption if available
        if (node.type === 'image' && node.attrs?.caption) {
          return escapeHtml(node.attrs.caption).slice(0, 250);
        }
      }
      return '';
    } catch {
      return '';
    }
  };

  const escapeHtml = (unsafe: string) =>
    unsafe
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#039;');
</script>

<style scoped>
  table th,
  table td {
    vertical-align: top;
  }
</style>
