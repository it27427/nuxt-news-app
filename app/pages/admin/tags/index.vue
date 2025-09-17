<template>
  <div class="p-5">
    <h1 class="text-2xl font-semibold mb-4">Tag List</h1>

    <table class="w-full border border-gray-200">
      <thead class="bg-gray-100">
        <tr>
          <th class="px-4 py-2 border">ID</th>
          <th class="px-4 py-2 border">Tag Name</th>
          <th class="px-4 py-2 border">Actions</th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="tag in tags" :key="tag.id">
          <td class="px-4 py-2 border">{{ tag.id }}</td>
          <td class="px-4 py-2 border">{{ tag.name }}</td>
          <td class="px-4 py-2 border flex gap-2">
            <button
              class="bg-blue-500 text-white px-3 py-1 rounded"
              @click="goToEdit(tag.id)"
            >
              Edit
            </button>
            <button
              class="bg-red-500 text-white px-3 py-1 rounded"
              @click="deleteTag(tag.id)"
            >
              Delete
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue';
  import { useRouter } from 'vue-router';
  import { useToast } from 'vue-toastification';

  definePageMeta({
    layout: 'admin',
  });

  const toast = useToast();
  const router = useRouter();

  // Dummy tag list
  const tags = ref([
    { id: 1, name: 'Vue' },
    { id: 2, name: 'Nuxt' },
    { id: 3, name: 'Tailwind' },
  ]);

  // Go to edit page
  function goToEdit(id: number) {
    router.push(`/admin/tags/${id}/edit`);
  }

  // Delete tag
  function deleteTag(id: number) {
    tags.value = tags.value.filter((tag) => tag.id !== id);
    toast.success(`Tag with ID ${id} deleted successfully!`);
  }
</script>
