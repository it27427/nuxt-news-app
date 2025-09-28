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
      <template v-else>নতুন সংবাদ ধরন তৈরি করুন</template>
    </h2>

    <!-- Form Skeleton / Actual Form -->
    <div class="w-full max-w-md">
      <form @submit.prevent="handleCategorySubmit" class="space-y-4">
        <!-- Category Input -->
        <div v-if="localLoading">
          <div
            class="h-12 w-full bg-gray-200 dark:bg-slate-700 animate-pulse rounded"
          ></div>
        </div>
        <div v-else>
          <!-- NOTE: Assuming BaseInput component is correctly receiving v-model and error prop -->
          <BaseInput
            v-model="form.name"
            label="Category Name"
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
          <!-- NOTE: Assuming BaseButton component is correctly receiving loading prop -->
          <BaseButton
            :loading="categoriesStore.loading"
            type="submit"
            label="Create Category"
          />
        </div>
      </form>
    </div>
  </section>
</template>

<script setup lang="ts">
  import { onMounted, reactive, ref } from 'vue';
  import { useRouter } from 'vue-router';
  // NOTE: Assuming vue-toastification is configured and available globally
  import { isAxiosError } from 'axios'; // Import isAxiosError for type safety
  import { useToast } from 'vue-toastification';
  import { useCategoriesStore } from '~~/store/categories.store';

  definePageMeta({
    layout: 'admin',
  });

  const toast = useToast();
  const router = useRouter();
  const categoriesStore = useCategoriesStore();

  // Local loading for skeleton
  const localLoading = ref(true);

  // Reactive form state
  const form = reactive({
    name: '',
  });

  // Validation errors
  const errors = reactive<{ name?: string }>({});

  // Simulate short initial loading for skeleton
  onMounted(() => {
    setTimeout(() => {
      localLoading.value = false;
    }, 2000);
  });

  // Handle form submit
  async function handleCategorySubmit() {
    // Clear previous errors
    errors.name = '';

    // Client-side basic validation
    if (!form.name.trim()) {
      errors.name = 'Category name is required (Client Check)';
      return;
    }

    try {
      // We set loading true inside the store action, but resetting it locally here for clarity
      categoriesStore.loading = true;

      const newCategory = await categoriesStore.createCategory({
        name: form.name,
      });

      toast.success(`Category "${newCategory.name}" created successfully!`, {
        timeout: 1000,
        id: 'local-success',
      });

      form.name = '';

      setTimeout(() => {
        router.push('/admin/categories');
      }, 1000);
    } catch (err: any) {
      // IMPROVED: Enhanced error handling for server validation
      if (isAxiosError(err) && err.response) {
        const resData = err.response.data;
        const status = err.response.status;

        if (status === 400 || status === 409) {
          // Handle Validation/Conflict errors from the server API handler
          if (resData.data?.name) {
            errors.name = resData.data.name; // Apply server error to form field
            toast.error(resData.data.name);
          } else {
            toast.error(resData.statusMessage || 'Validation failed.');
          }
        } else {
          // Handle general error messages (401, 500, etc.)
          toast.error(resData.message || 'An unexpected error occurred.');
        }
      } else {
        // Handle network errors or non-Axios exceptions
        toast.error(err.message || 'Failed to create category');
      }
    } finally {
      categoriesStore.loading = false;
    }
  }
</script>
