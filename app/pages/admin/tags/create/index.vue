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
      <form @submit.prevent="handleTagSubmit" class="space-y-4">
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
            label="ট্যাগ তৈরি"
          />
        </div>
      </form>
    </div>
  </section>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from 'vue-toastification';
import { useTagsStore } from '~~/store/tags.store';

  definePageMeta({ layout: 'admin' });

  const pageTitle = ref('ট্যাগ তৈরি করুন');

  const toast = useToast();
  const router = useRouter();
  const tagsStore = useTagsStore();

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
  async function handleTagSubmit() {
    errors.name = '';

    if (!form.name.trim()) {
      errors.name = 'Tag name is required';
      return;
    }

    try {
      tagsStore.loading = true;

      const newTag = await tagsStore.createTag({ name: form.name });

      toast.success(`Tag "${newTag.name}" created successfully!`, {
        timeout: 1000,
        id: 'local-success',
      });

      form.name = '';

      // Redirect
      router.push('/admin/tags');
    } catch (err: any) {
      toast.error(err?.message || 'Failed to create tag');
    } finally {
      tagsStore.loading = false;
    }
  }
</script>
