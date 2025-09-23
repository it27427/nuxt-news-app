<template>
  <div class="flex items-center justify-center h-full">
    <div class="w-full max-w-md mx-auto">
      <Form
        :fields="tagFields"
        submitText="Create Tag"
        @submit="handleTagSubmit"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
  definePageMeta({
    layout: 'admin',
  });

  const toast = useToast();

  // Define form fields
  const tagFields = [
    {
      name: 'name',
      label: 'Tag Name',
      type: 'text',
      placeholder: 'Enter tag name',
      required: true,
      minLength: 3,
      maxLength: 50,
    },
  ];

  // Handle form submit
  function handleTagSubmit(data: Record<string, any>) {
    console.log('Tag data:', data);

    // Simulate API success
    toast.success(`Tag "${data.name}" created successfully!`);
  }
</script>
