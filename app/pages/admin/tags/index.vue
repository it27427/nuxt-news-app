<template>
  <section class="p-5 flex flex-col gap-6">
    <h2
      class="font-hind font-bold text-2xl lg:text-3xl text-center text-dark-surface dark:text-white"
    >
      ট্যাগ তালিকা
    </h2>

    <table
      class="w-full bg-gray-50 border border-gray-200 dark:border-slate-800 text-center"
    >
      <thead
        class="text-dark dark:bg-gray-900 dark:text-gray-100 dark:shadow-lg"
      >
        <tr>
          <th
            class="px-4 py-2 border border-gray-200 dark:border-slate-800 font-bold"
          >
            ক্রমিক নম্বর
          </th>
          <th
            class="px-4 py-2 border border-gray-200 dark:border-slate-800 font-bold"
          >
            ট্যাগ নাম
          </th>
          <th
            class="px-4 py-2 border border-gray-200 dark:border-slate-800 font-bold"
          >
            প্রক্রিয়া
          </th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="tag in tags" :key="tag.id">
          <td
            class="px-4 py-2 border border-gray-200 dark:border-slate-800 text-2xl"
          >
            {{ toBanglaNumber(tag.id) }}
          </td>
          <td
            class="px-4 py-2 border border-gray-200 dark:border-slate-800 text-lg"
          >
            {{ tag.name }}
          </td>
          <td
            class="px-4 py-2 border border-gray-200 dark:border-slate-800 flex gap-2 justify-center"
          >
            <button
              class="bg-yellow-500 text-white hover:bg-yellow-700 px-3 py-1 rounded duration-400"
              @click="goToEdit(tag.id)"
            >
              Edit
            </button>

            <button
              class="bg-red-500 text-white hover:bg-red-700 px-3 py-1 rounded duration-400"
              @click="openDeleteModal(tag)"
            >
              Delete
            </button>
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
        class="p-12 px-8 bg-white dark:bg-dark rounded-lg shadow-lg max-w-96 text-center"
      >
        <h4 class="text-lg font-hind font-medium mb-6">
          আপনি কি নিশ্চিতভাবে মুছে ফেলতে চান?
        </h4>

        <div class="flex justify-center gap-2">
          <button
            @click="confirmDelete"
            class="px-4 py-2 w-10 h-10 font-medium flex items-center justify-center bg-primary text-white rounded hover:bg-primary-dark transition duration-400"
          >
            হ্যাঁ
          </button>

          <button
            @click="showModal = false"
            class="px-4 py-2 w-10 h-10 font-medium flex items-center justify-center bg-red-500 text-white rounded hover:bg-red-700 transition duration-400"
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
