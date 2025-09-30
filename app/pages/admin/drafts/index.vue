<template>
  <section class="md:p-5 flex flex-col gap-6">
    <!-- Title -->
    <h2
      class="font-hind font-bold text-2xl lg:text-3xl text-center text-dark-surface dark:text-white"
    >
      <template v-if="draftsStore.loading">
        <div
          class="h-8 w-48 mx-auto bg-gray-200 dark:bg-slate-700 animate-pulse rounded"
        ></div>
      </template>
      <template v-else>সংরক্ষিত সংবাদ তালিকা</template>
    </h2>

    <!-- Table -->
    <table
      class="bg-gray-50 dark:bg-dark border border-gray-300 dark:border-slate-700 text-lg text-center w-full mt-4"
    >
      <thead class="bg-gray-100 dark:bg-dark">
        <tr>
          <th class="px-4 py-2 border border-gray-300 dark:border-slate-700">
            #
          </th>
          <th class="px-4 py-2 border border-gray-300 dark:border-slate-700">
            শিরোনাম
          </th>
          <th class="px-4 py-2 border border-gray-300 dark:border-slate-700">
            লেখক
          </th>
          <th class="px-4 py-2 border border-gray-300 dark:border-slate-700">
            তৈরির তারিখ
          </th>
          <th class="px-4 py-2 border border-gray-300 dark:border-slate-700">
            স্ট্যাটাস
          </th>
          <th class="px-4 py-2 border border-gray-300 dark:border-slate-700">
            কর্ম
          </th>
        </tr>
      </thead>
      <tbody>
        <!-- Skeleton Rows -->
        <tr v-if="draftsStore.loading" v-for="n in 5" :key="'skeleton-' + n">
          <td class="px-4 py-3 border border-gray-300 dark:border-slate-700">
            <div
              class="h-6 w-10 mx-auto bg-gray-200 dark:bg-slate-700 animate-pulse rounded"
            ></div>
          </td>
          <td class="px-4 py-3 border border-gray-300 dark:border-slate-700">
            <div
              class="h-6 w-24 mx-auto bg-gray-200 dark:bg-slate-700 animate-pulse rounded"
            ></div>
          </td>
          <td class="px-4 py-3 border border-gray-300 dark:border-slate-700">
            <div
              class="h-6 w-20 mx-auto bg-gray-200 dark:bg-slate-700 animate-pulse rounded"
            ></div>
          </td>
          <td class="px-4 py-3 border border-gray-300 dark:border-slate-700">
            <div
              class="h-6 w-16 mx-auto bg-gray-200 dark:bg-slate-700 animate-pulse rounded"
            ></div>
          </td>
          <td class="px-4 py-3 border border-gray-300 dark:border-slate-700">
            <div
              class="h-6 w-16 mx-auto bg-gray-200 dark:bg-slate-700 animate-pulse rounded"
            ></div>
          </td>
          <td class="px-4 py-3 border border-gray-300 dark:border-slate-700">
            <div class="flex justify-center gap-3">
              <div
                class="h-8 w-8 bg-gray-200 dark:bg-slate-700 animate-pulse rounded-full"
              ></div>
              <div
                class="h-8 w-8 bg-gray-200 dark:bg-slate-700 animate-pulse rounded-full"
              ></div>
            </div>
          </td>
        </tr>

        <!-- Empty State -->
        <tr v-else-if="draftsStore.drafts.length === 0">
          <td colspan="6" class="py-6 text-gray-400">
            <span class="text-6xl">📝</span>
            <p class="text-xl">কোন ড্রাফট নেই! নতুন ড্রাফট তৈরি করুন।</p>
          </td>
        </tr>

        <!-- Data Rows -->
        <tr v-else v-for="(draft, index) in draftsStore.drafts" :key="draft.id">
          <td class="px-4 py-2 border border-gray-300 dark:border-slate-700">
            {{ index + 1 }}
          </td>
          <td class="px-4 py-2 border border-gray-300 dark:border-slate-700">
            {{ draft.title }}
          </td>
          <td class="px-4 py-2 border border-gray-300 dark:border-slate-700">
            {{ draft.author?.name || draft.user_id || 'Unknown' }}
          </td>
          <td class="px-4 py-2 border border-gray-300 dark:border-slate-700">
            {{ new Date(draft.created_at).toLocaleDateString() }}
          </td>
          <td
            class="px-4 py-2 border border-gray-300 dark:border-slate-700 capitalize"
          >
            {{ draft.status }}
          </td>
          <td class="px-4 py-2 border border-gray-300 dark:border-slate-700">
            <div class="flex justify-center gap-2">
              <!-- View -->
              <button
                class="text-green-500 hover:text-green-700 w-10 h-10 flex items-center justify-center transition-colors duration-300"
                title="ড্রাফট দেখুন"
                @click="viewDraft(draft.id)"
              >
                <Icon icon="ic:round-visibility" width="24" height="24" />
              </button>

              <!-- Edit -->
              <button
                class="text-yellow-500 hover:text-yellow-700 w-10 h-10 flex items-center justify-center transition-colors duration-300"
                title="ড্রাফট এডিট করুন"
                @click="editDraft(draft.id)"
              >
                <Icon icon="ic:round-edit" width="24" height="24" />
              </button>

              <!-- Delete -->
              <button
                class="text-red-500 hover:text-red-800 w-10 h-10 flex items-center justify-center transition-colors duration-300"
                title="ড্রাফট মুছে ফেলুন"
                @click="openDeleteModal(draft)"
              >
                <Icon icon="ic:round-delete" width="24" height="24" />
              </button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Delete Modal -->
    <VueFinalModal
      v-model="showModal"
      :clickToClose="false"
      class="fixed inset-0 flex items-center justify-center z-50 bg-black/50"
    >
      <div
        class="p-8 bg-white dark:bg-dark-divider rounded-lg shadow-lg max-w-96 text-center"
      >
        <h4 class="text-lg font-hind font-medium mb-6">
          আপনি কি নিশ্চিতভাবে মুছে ফেলতে চান?
        </h4>
        <div class="flex justify-center gap-3">
          <button
            @click="confirmDelete"
            class="px-4 py-2 w-10 h-10 font-hind text-base flex items-center justify-center bg-primary text-white rounded hover:bg-primary-dark dark:bg-primary-dark dark:hover:bg-primary transition duration-400"
          >
            হ্যাঁ
          </button>
          <button
            @click="showModal = false"
            class="px-4 py-2 w-10 h-10 font-hind text-base flex items-center justify-center bg-red-500 text-white rounded hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-500 transition duration-400"
          >
            না
          </button>
        </div>
      </div>
    </VueFinalModal>
  </section>
</template>

<script setup lang="ts">
  import { Icon } from '@iconify/vue';
  import { onMounted, ref } from 'vue';
  import { VueFinalModal } from 'vue-final-modal';
  import { useRouter } from 'vue-router';
  import { useToast } from 'vue-toastification';
  import { useDraftsStore } from '~~/store/drafts.store';

  definePageMeta({ layout: 'admin' });

  const draftsStore = useDraftsStore();
  const router = useRouter();
  const toast = useToast();

  const showModal = ref(false);
  let selectedDraft: { id: string; title: string } | null = null;

  // Fetch drafts
  onMounted(async () => {
    try {
      await draftsStore.fetchDrafts();
    } catch (err: any) {
      toast.error(err?.message || 'ড্রাফট লোড করতে ব্যর্থ হয়েছে!');
    }
  });

  // Actions
  function viewDraft(id: string) {
    router.push(`/admin/drafts/${id}/view`);
  }

  function editDraft(id: string) {
    router.push(`/admin/drafts/${id}/edit`);
  }

  function openDeleteModal(draft: { id: string; title: string }) {
    selectedDraft = draft;
    showModal.value = true;
  }

  async function confirmDelete() {
    if (!selectedDraft) return;
    try {
      await draftsStore.deleteDraft(selectedDraft.id);
      toast.success(
        `ড্রাফট "${selectedDraft.title}" সফলভাবে মুছে ফেলা হয়েছে!`
      );
    } catch (err: any) {
      toast.error(err?.message || 'ড্রাফট মুছতে ব্যর্থ হয়েছে!');
    } finally {
      selectedDraft = null;
      showModal.value = false;
    }
  }
</script>
