<template>
  <section class="flex flex-col items-center justify-center h-full gap-6 p-6">
    <!-- Title Skeleton -->
    <h2
      class="font-hind font-bold text-2xl lg:text-3xl text-center text-dark-surface dark:text-white"
    >
      <template v-if="localLoading">
        <div
          class="h-8 w-48 bg-gray-200 dark:bg-slate-700 animate-pulse rounded mx-auto"
        ></div>
      </template>
      <template v-else>ট্যাগ সংযোজন করুন</template>
    </h2>

    <!-- Form Skeleton / Actual Form -->
    <div class="w-full max-w-md">
      <form @submit.prevent="handleTagUpdate" class="space-y-4">
        <!-- Tag Input -->
        <div v-if="localLoading">
          <div
            class="h-12 w-full bg-gray-200 dark:bg-slate-700 animate-pulse rounded"
          ></div>
        </div>
        <div v-else>
          <BaseInput
            v-model="form.name"
            label="Tag Name"
            :error="errors.name"
          />
        </div>

        <!-- Submit Button -->
        <div v-if="localLoading">
          <div
            class="h-12 w-full bg-gray-300 dark:bg-slate-600 animate-pulse rounded"
          ></div>
        </div>
        <div v-else>
          <BaseButton
            :loading="tagsStore.loading"
            type="submit"
            label="Update Tag"
          />
        </div>
      </form>
    </div>
  </section>
</template>

<script setup lang="ts">
  import { onMounted, reactive, ref } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import { useToast } from 'vue-toastification';
  import { useTagsStore } from '~~/store/tags.store';

  definePageMeta({
    layout: 'admin',
  });

  const toast = useToast();
  const router = useRouter();
  const route = useRoute();
  const tagsStore = useTagsStore();

  const tagId = route.params.id as string;

  // Local loading for skeleton
  const localLoading = ref(true);

  // Reactive form state
  const form = reactive({
    name: '',
  });

  // Validation errors
  const errors = reactive<{ name?: string }>({});

  // Fetch tag data on mount
  onMounted(async () => {
    try {
      const tagData = await tagsStore.fetchTag(tagId);
      form.name = tagData.name;
      setTimeout(() => {
        localLoading.value = false;
      }, 2000);
    } catch (err: any) {
      toast.error(err?.message || 'Failed to load tag');
    } finally {
      localLoading.value = false;
    }
  });

  // Handle tag update
  async function handleTagUpdate() {
    errors.name = '';

    if (!form.name.trim()) {
      errors.name = 'Tag name is required';
      return;
    }

    try {
      tagsStore.loading = true;

      const updatedTag = await tagsStore.updateTag(tagId, { name: form.name });

      toast.success(`Tag "${updatedTag.name}" updated successfully!`, {
        timeout: 1000,
        id: 'local-success',
      });

      setTimeout(() => {
        router.push('/admin/tags');
      }, 1000);
    } catch (err: any) {
      toast.error(err?.message || 'Failed to update tag');
    } finally {
      tagsStore.loading = false;
    }
  }
</script>
