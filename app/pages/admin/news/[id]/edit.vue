<template>
  <div class="flex items-center justify-center h-full">
    <div class="w-full max-w-md mx-auto">
      <Form
        :fields="tagFields"
        submitText="Update Tag"
        @submit="handleTagUpdate"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
  import { useRoute } from 'vue-router';
  import { useToast } from 'vue-toastification';
  import Form from '~/components/admin/forms/Form.vue';

  definePageMeta({
    layout: 'admin',
  });

  const route = useRoute();
  const toast = useToast();

  const tagId = route.params.id as string;

  // Normally, you'd fetch tag data from API by tagId
  // For demo purpose, we simulate previous data
  const tagData = { id: tagId, name: 'Sample Tag' };

  const tagFields = [
    {
      name: 'name',
      label: 'Tag Name',
      type: 'text',
      placeholder: 'Enter tag name',
      required: true,
      value: tagData.name,
      minLength: 3,
      maxLength: 50,
    },
  ];

  function handleTagUpdate(data: Record<string, any>) {
    console.log('Updated tag:', data);
    toast.success(`Tag "${data.name}" updated successfully!`);
  }
</script>
