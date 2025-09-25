<template>
  <div class="flex items-center justify-center h-full">
    <div class="w-full max-w-md mx-auto">
      <form @submit.prevent="handleTagSubmit" class="space-y-4">
        <!-- Tag Name Input -->
        <BaseInput v-model="form.name" label="Tag Name" :error="errors.name" />

        <!-- Submit Button -->
        <BaseButton
          :loading="tagStore.loading"
          type="submit"
          label="Create Tag"
        />
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { reactive } from 'vue';
  import { useTagStore } from '~~/store/tags.store';

  definePageMeta({
    layout: 'admin',
  });

  const toast = useToast();
  const tagStore = useTagStore();

  // Reactive form state
  const form = reactive({
    name: '',
  });

  // Validation errors
  const errors = reactive<{ name?: string }>({});

  // Handle form submit
  async function handleTagSubmit() {
    errors.name = '';

    if (!form.name.trim()) {
      errors.name = 'Tag name is required';
      return;
    }

    try {
      const res = await tagStore.createTag({ name: form.name });
      toast.success(
        `Tag "${res.data?.name || form.name}" created successfully!`
      );

      // Reset form
      form.name = '';
    } catch (err: any) {
      toast.error(err?.message || 'Failed to create tag');
    }
  }
</script>
