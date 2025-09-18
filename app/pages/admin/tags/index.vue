<template>
  <section class="md:p-5 flex flex-col gap-6">
    <h2
      class="font-hind font-bold text-2xl lg:text-3xl text-center text-dark-surface dark:text-white"
    >
      ট্যাগ তালিকা
    </h2>

    <!-- TAG-LIST-RESPONSIVE-TABLE -->
    <div class="overflex-x-auto scroll-none">
      <table
        class="w-full bg-gray-50 dark:bg-dark-divider text-center border border-gray-200 dark:border-slate-800 border-collapse"
      >
        <thead
          class="text-dark dark:bg-gray-900 dark:text-gray-100 dark:shadow-lg"
        >
          <tr>
            <th
              class="px-4 py-2 font-bold border border-gray-200 dark:border-slate-800"
            >
              ক্রমিক নম্বর
            </th>
            <th
              class="px-4 py-2 font-bold border border-gray-200 dark:border-slate-800"
            >
              ট্যাগ নাম
            </th>
            <th
              class="px-4 py-2 font-bold border border-gray-200 dark:border-slate-800"
            >
              প্রক্রিয়া
            </th>
          </tr>
        </thead>

        <tbody>
          <!--TAG-EMPTY-SCREEN -->
          <tr v-if="tags.length === 0">
            <td colspan="3" class="py-4">
              <!-- Empty Icon -->
              <h3 class="text-6xl lg:text-7xl text-gray-400 my-4">🏷️</h3>

              <p
                class="text-lg font-baloda font-normalf text-gray-400 dark:text-gray-200"
              >
                কোন ট্যাগ নেই! নতুন ট্যাগ তৈরি করুন।
              </p>
            </td>
          </tr>

          <!--TAG-DATA -->
          <tr v-for="tag in tags" :key="tag.id">
            <td
              class="px-4 py-2 text-2xl border border-gray-200 dark:border-slate-700"
            >
              {{ toBanglaNumber(tag.id) }}
            </td>
            <td
              class="px-4 py-2 text-lg border border-gray-200 dark:border-slate-700"
            >
              {{ tag.name }}
            </td>
            <td
              class="px-4 py-2 border border-gray-200 dark:border-slate-700 flex justify-center gap-2"
            >
              <client-only>
                <Button
                  v-tooltip.top="'This is a tooltip!'"
                  label="Hover Me"
                  class="text-yellow-500 hover:text-yellow-700 w-12 h-12 flex items-center justify-center transition-colors duration-400"
                  @click="goToEdit(tag.id)"
                >
                  <Icon
                    name="carbon:tag-edit"
                    width="32"
                    height="32"
                    class="text-2xl"
                  />
                </Button>
              </client-only>

              <button
                class="text-red-500 hover:text-red-800 w-12 h-12 flex items-center justify-center transition-colors duration-400"
                @click="openDeleteModal(tag)"
              >
                <client-only>
                  <Icon
                    name="streamline-freehand:delete-bin-2"
                    width="24"
                    height="24"
                    class="text-2xl"
                  />
                </client-only>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

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
        class="p-12 px-8 bg-white dark:bg-dark-divider rounded-lg shadow-lg max-w-96 text-center"
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
  import { toBanglaNumber } from '@/utils/number';
  import { ref } from 'vue';
  import { VueFinalModal } from 'vue-final-modal';
  import { useRouter } from 'vue-router';
  import { useToast } from 'vue-toastification';

  definePageMeta({
    layout: 'admin',
  });

  const toast = useToast();
  const router = useRouter();

  // Dummy tag list
  const tags = ref([
    { id: 1, name: 'Vue' },
    { id: 2, name: 'Nuxt' },
    { id: 3, name: 'Tailwind' },
  ]);

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
