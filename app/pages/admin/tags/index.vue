<template>
  <section class="md:p-5 flex flex-col gap-6">
    <h2
      class="font-hind font-bold text-2xl lg:text-3xl text-center text-dark-surface dark:text-white"
    >
      ট্যাগ তালিকা
    </h2>

    <!-- TAG-LIST-DATATABLE -->
    <client-only>
      <div class="card">
        <!-- Skeleton Table (Loading State) -->
        <DataTable
          v-if="loading"
          :value="skeletonRows"
          showGridlines
          tableStyle="min-width: 40rem"
          class="bg-gray-50 dark:bg-dark-divider border border-gray-300 dark:border-slate-700 text-lg text-center"
        >
          <Column header="ক্রমিক নম্বর">
            <template #body>
              <Skeleton width="60%" height="1.5rem" />
            </template>
          </Column>
          <Column header="ট্যাগ নাম">
            <template #body>
              <Skeleton width="70%" height="1.5rem" />
            </template>
          </Column>
          <Column header="কার্যক্রম">
            <template #body>
              <div class="flex justify-center gap-2">
                <Skeleton shape="circle" size="2.5rem" />
                <Skeleton shape="circle" size="2.5rem" />
              </div>
            </template>
          </Column>
        </DataTable>

        <!-- Actual DataTable -->
        <DataTable
          v-else
          :value="tags"
          dataKey="id"
          showGridlines
          resizableColumns
          columnResizeMode="fit"
          paginator
          :rows="10"
          filterDisplay="row"
          removableSort
          v-model:filters="filters"
          tableStyle="min-width: 40rem"
          class="bg-gray-50 dark:bg-dark-divider border border-gray-300 dark:border-slate-700 text-lg text-center"
        >
          <!-- Search bar -->
          <template #header>
            <div class="flex justify-end">
              <IconField>
                <InputIcon>
                  <i class="pi pi-search" />
                </InputIcon>
                <InputText
                  v-model="filters['global'].value"
                  placeholder="ট্যাগ খুঁজুন..."
                />
              </IconField>
            </div>
          </template>

          <!-- Empty state (conditional) -->
          <template v-if="tags.length === 0" #empty>
            🏷️ কোন ট্যাগ নেই! নতুন ট্যাগ তৈরি করুন।
          </template>

          <!-- Index Column -->
          <Column header="ক্রমিক নম্বর" sortable filter>
            <template #body="slotProps">
              {{ toBanglaNumber(slotProps.data.id) }}
            </template>
          </Column>

          <!-- Tag Name Column -->
          <Column field="name" header="ট্যাগ নাম" sortable filter></Column>

          <!-- Action Column -->
          <Column header="কার্যক্রম">
            <template #body="slotProps">
              <div class="flex justify-center gap-2">
                <!-- Edit Button -->
                <Button
                  v-tooltip.top="'ট্যাগ সংযোজন করুন'"
                  unstyled
                  class="text-yellow-500 hover:text-yellow-700 w-10 h-10 flex items-center justify-center transition-colors duration-400"
                  @click="goToEdit(slotProps.data.id)"
                >
                  <Icon
                    name="carbon:tag-edit"
                    width="24"
                    height="24"
                    class="text-2xl"
                  />
                </Button>

                <!-- Delete Button -->
                <button
                  v-tooltip.top="'ট্যাগ মুছে ফেলুন'"
                  class="text-red-500 hover:text-red-800 w-10 h-10 flex items-center justify-center transition-colors duration-400"
                  @click="openDeleteModal(slotProps.data)"
                >
                  <Icon
                    name="streamline-freehand:delete-bin-2"
                    width="20"
                    height="20"
                    class="text-2xl"
                  />
                </button>
              </div>
            </template>
          </Column>
        </DataTable>
      </div>
    </client-only>

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
  </section>
</template>

<script setup lang="ts">
  import { toBanglaNumber } from '@/utils/number';
  import { onMounted, ref } from 'vue';
  import { VueFinalModal } from 'vue-final-modal';
  import { useRouter } from 'vue-router';
  import { useToast } from 'vue-toastification';

  // PrimeVue
  import { FilterMatchMode } from '@primevue/core/api';
  import Skeleton from 'primevue/skeleton';

  definePageMeta({
    layout: 'admin',
  });

  const toast = useToast();
  const router = useRouter();

  // Dummy tag list
  const tags = ref<{ id: number; name: string }[]>([]);

  // Skeleton rows
  const skeletonRows = ref(new Array(5));

  // Filters for search
  const filters = ref({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    name: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
  });

  const loading = ref(true);

  // Simulate loading
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
