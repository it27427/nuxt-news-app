<template>
  <section class="md:p-5 flex flex-col gap-6">
    <h2
      class="font-hind font-bold text-2xl lg:text-3xl text-center text-dark-surface dark:text-white"
    >
      ট্যাগ তালিকা
    </h2>

    <!-- TAG-LIST-TABLE -->
    <client-only>
      <!-- Normal Table -->
      <table
        class="bg-gray-50 dark:bg-dark border border-gray-300 dark:border-slate-700 text-lg text-center w-full"
      >
        <!-- Header -->
        <thead class="bg-gray-100 dark:bg-dark">
          <tr>
            <th class="px-4 py-2 border border-gray-300 dark:border-slate-700">
              ক্রমিক নম্বর
            </th>
            <th class="px-4 py-2 border border-gray-300 dark:border-slate-700">
              ট্যাগ নাম
            </th>
            <th class="px-4 py-2 border border-gray-300 dark:border-slate-700">
              কার্যক্রম
            </th>
          </tr>
        </thead>

        <!-- Body -->
        <tbody>
          <!-- Loading Skeleton -->
          <tr v-if="loading" v-for="n in 5" :key="'skeleton-' + n">
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
          <tr v-else-if="tags.length === 0">
            <td colspan="3" class="py-6 text-gray-400">
              <span class="text-6xl">🏷️</span>
              <p class="text-xl">কোন ট্যাগ নেই! নতুন ট্যাগ তৈরি করুন।</p>
            </td>
          </tr>

          <!-- Data Rows -->
          <tr v-else v-for="(tag, index) in tags" :key="tag.id">
            <!-- Index -->
            <td
              class="px-4 py-2 border border-gray-300 dark:border-slate-700 text-xl"
            >
              {{ toBanglaNumber(index + 1) }}
            </td>

            <!-- Tag Name -->
            <td class="px-4 py-2 border border-gray-300 dark:border-slate-700">
              {{ tag.name }}
            </td>

            <!-- Actions -->
            <td class="px-4 py-2 border border-gray-300 dark:border-slate-700">
              <div class="flex justify-center gap-2">
                <!-- Edit Button -->
                <button
                  title="ট্যাগ সংযোজন করুন"
                  class="text-yellow-500 hover:text-yellow-700 w-10 h-10 flex items-center justify-center transition-colors duration-300"
                  @click="goToEdit(tag.id)"
                >
                  <Icon
                    name="carbon:tag-edit"
                    width="24"
                    height="24"
                    class="text-2xl"
                  />
                </button>

                <!-- Delete Button -->
                <button
                  title="ট্যাগ মুছে ফেলুন"
                  class="text-red-500 hover:text-red-800 w-10 h-10 flex items-center justify-center transition-colors duration-300"
                  @click="openDeleteModal(tag)"
                >
                  <Icon
                    name="streamline-freehand:delete-bin-2"
                    width="20"
                    height="20"
                    class="text-2xl"
                  />
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Delete Confirmation Modal -->
      <VueFinalModal
        v-model="showModal"
        :clickToClose="false"
        class="fixed inset-0 flex items-center justify-center z-50 bg-black/50"
        :transition="{
          enterActiveClass: 'ease-out duration-300',
          enterFromClass: 'opacity-0 scale-90',
          enterToClass: 'opacity-100 scale-100',
          leaveActiveClass: 'ease-in duration-200',
          leaveFromClass: 'opacity-100 scale-100',
          leaveToClass: 'opacity-0 scale-90',
        }"
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
    </client-only>
  </section>
</template>

<script setup lang="ts">
  import { VueFinalModal } from 'vue-final-modal';
  import { useToast } from 'vue-toastification';

  definePageMeta({
    layout: 'admin',
  });

  const toast = useToast();
  const router = useRouter();

  // Dummy tag list
  const tags = ref<{ id: number; name: string }[]>([]);

  // Loading simulation
  const loading = ref(true);
  onMounted(() => {
    setTimeout(() => {
      tags.value = [
        { id: 1, name: 'Vue' },
        { id: 2, name: 'Nuxt' },
        { id: 3, name: 'Tailwind' },
      ];
      loading.value = false;
    }, 2000);
  });

  const showModal = ref(false);
  let selectedTag: { id: number; name: string } | null = null;

  // Go to edit page
  function goToEdit(id: number) {
    router.push(`/admin/tags/${id}/edit`);
  }

  // Open delete confirmation modal
  function openDeleteModal(tag: { id: number; name: string }) {
    selectedTag = tag;
    showModal.value = true;
  }

  // Confirm deletion
  function confirmDelete() {
    if (selectedTag) {
      tags.value = tags.value.filter((tag) => tag.id !== selectedTag!.id);
      toast.success(`Tag "${selectedTag.name}" সফলভাবে মুছে ফেলা হয়েছে!`);
      selectedTag = null;
    }
    showModal.value = false;
  }
</script>
