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
      <template v-else>ট্যাগ হালনাগাদ করুন</template>
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
          <!-- Assuming BaseInput is correctly imported and available -->
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
          <!-- Assuming BaseButton is correctly imported and available -->
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

      // CRITICAL: Check if tagData is valid before accessing .name
      if (tagData && tagData.name) {
        form.name = tagData.name;
      } else {
        // If tag not found (e.g., 404), show error and redirect
        // The store is designed to throw an error on 404/failure,
        // but this defensive check is good practice.
        if (localLoading.value) {
          // Only show toast if loading has started successfully
          toast.error('Tag not found or failed to load. Redirecting...');
          router.push('/admin/tags');
        }
      }
    } catch (err: any) {
      // Catch error thrown by store (e.g., 404 or network failure)
      const errorMessage =
        err?.response?.data?.message || err.message || 'Failed to load tag';
      toast.error(errorMessage);
      router.push('/admin/tags'); // Redirect on network or severe error
    } finally {
      // Ensure loading stops immediately after API call completes
      localLoading.value = false;
    }
  });

  // Handle tag update
  async function handleTagUpdate() {
    // Clear previous errors
    errors.name = undefined;

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
      // Handle server-side validation errors
      const serverErrors = err.response?.data?.errors;
      if (serverErrors?.name) {
        errors.name = serverErrors.name;
        toast.error(err.response.data.message || 'Validation failed');
      } else {
        toast.error(err?.message || 'Failed to update tag');
      }
    } finally {
      tagsStore.loading = false;
    }
  }
</script>
