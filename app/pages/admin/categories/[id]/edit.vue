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
      <!-- Updated Title for clarity -->
      <template v-else>সংবাদ ধরন হালনাগাদ করুন</template>
    </h2>

    <!-- Form Skeleton / Actual Form -->
    <div class="w-full max-w-md">
      <form @submit.prevent="handleCategoryUpdate" class="space-y-4">
        <!-- Category Input -->
        <div v-if="localLoading">
          <div
            class="h-12 w-full bg-gray-200 dark:bg-slate-700 animate-pulse rounded"
          ></div>
        </div>
        <div v-else>
          <!-- Assuming BaseInput is correctly imported and available -->
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
          <!-- Assuming BaseButton is correctly imported and available -->
          <BaseButton
            :loading="categoriesStore.loading"
            type="submit"
            label="Update Category"
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
  import { useCategoriesStore } from '~~/store/categories.store';

  definePageMeta({
    layout: 'admin',
  });

  // Interface for Category data (assuming the store returns this shape)
  interface Category {
    id: string;
    name: string;
  }

  const toast = useToast();
  const router = useRouter();
  const route = useRoute();
  const categoriesStore = useCategoriesStore();

  // Get the category ID from the route parameters
  const categoryId = route.params.id as string;

  // Local loading state for skeleton UI
  const localLoading = ref(true);

  // Reactive form state
  const form = reactive({
    name: '',
  });

  // Validation errors
  const errors = reactive<{ name?: string }>({});

  // Fetch category data on mount
  onMounted(async () => {
    try {
      // Fetch the category data using the store action
      const categoryData = await categoriesStore.fetchCategory(categoryId);

      // Check if data was successfully loaded before accessing its properties
      if (categoryData && categoryData.name) {
        form.name = categoryData.name;
      } else {
        // This block handles cases where the category might not exist (e.g., 404 response)
        toast.error('Category not found or failed to load.');
        router.push('/admin/categories'); // Redirect if load fails
      }
    } catch (err: any) {
      toast.error(err?.message || 'Failed to load category');
      // In case of error, still ensure we redirect
      router.push('/admin/categories');
    } finally {
      // Stop skeleton loading once fetching is complete, regardless of success/fail
      localLoading.value = false;
    }
  });

  // Handle category update
  async function handleCategoryUpdate() {
    // Clear previous errors
    errors.name = undefined;

    if (!form.name.trim()) {
      errors.name = 'Category name is required';
      return;
    }

    try {
      categoriesStore.loading = true;

      const updatedCategory = await categoriesStore.updateCategory(categoryId, {
        name: form.name,
      });

      toast.success(
        `Category "${updatedCategory.name}" updated successfully!`,
        {
          timeout: 1000,
          id: 'local-success',
        }
      );

      // Redirect after a short delay
      setTimeout(() => {
        router.push('/admin/categories');
      }, 1000);
    } catch (err: any) {
      // Handle server-side validation errors (e.g., duplicate name)
      const serverErrors = err.response?.data?.errors;
      if (serverErrors?.name) {
        errors.name = serverErrors.name;
        toast.error(err.response.data.message || 'Validation failed');
      } else {
        toast.error(err?.message || 'Failed to update category');
      }
    } finally {
      categoriesStore.loading = false;
    }
  }
</script>
