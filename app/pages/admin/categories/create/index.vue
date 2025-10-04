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
      <template v-else>{{ pageTitle }}</template>
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
          <BaseButton
            :loading="categoriesStore.loading"
            type="submit"
            label="ক্যাটেগরি তৈরি"
          />
        </div>
      </form>
    </div>
  </section>
</template>

<script setup lang="ts">
import { isAxiosError } from 'axios';
import { onMounted, reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from 'vue-toastification';
import { useCategoriesStore } from '~~/store/categories.store';

  definePageMeta({ layout: 'admin' });

  const pageTitle = ref('ক্যাটেগরি তৈরি করুন');

  const toast = useToast();
  const router = useRouter();
  const categoriesStore = useCategoriesStore();

  // Local loading for skeleton
  const localLoading = ref(true);

  // Reactive form state
  const form = reactive({ name: '' });

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

    errors.name = '';

    if (!form.name.trim()) {
      errors.name = 'Category name is required (Client Check)';
      return;
    }

    try {
      categoriesStore.loading = true;

      const newCategory = await categoriesStore.createCategory({
        name: form.name,
      });

      toast.success(`Category "${newCategory.name}" created successfully!`, {
        timeout: 1000,
        id: 'local-success',
      });

      form.name = '';

      // Redirect
      router.push('/admin/categories');
    } catch (err: any) {

      if (isAxiosError(err) && err.response) {
        const resData = err.response.data;
        const status = err.response.status;

        if (status === 400 || status === 409) {
          if (resData.data?.name) {
            errors.name = resData.data.name;
            toast.error(resData.data.name);
          } else {
            toast.error(resData.statusMessage || 'Validation failed.');
          }
        } else {
          toast.error(resData.message || 'An unexpected error occurred.');
        }
      } else {
        toast.error(err.message || 'Failed to create category');
      }
    } finally {
      categoriesStore.loading = false;
    }
  }
</script>
