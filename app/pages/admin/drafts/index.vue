<template>
  <section class="p-6">
    <h1 class="text-2xl font-bold mb-4">Drafts List</h1>

    <!-- Loading State -->
    <div v-if="draftsStore.loading" class="text-gray-500">
      Loading drafts...
    </div>

    <!-- Error State -->
    <div v-else-if="draftsStore.error" class="text-red-500">
      {{ draftsStore.error }}
    </div>

    <!-- Empty State -->
    <div v-else-if="draftsStore.drafts.length === 0" class="text-gray-500">
      No drafts found.
    </div>

    <!-- Drafts Table -->
    <table
      v-else
      class="w-full border border-gray-200 dark:border-gray-700 text-left"
    >
      <thead class="bg-gray-100 dark:bg-gray-800">
        <tr>
          <th class="p-3 border-b">Title</th>
          <th class="p-3 border-b">Author</th>
          <th class="p-3 border-b">Created At</th>
          <th class="p-3 border-b">Status</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="draft in draftsStore.drafts"
          :key="draft.id"
          class="hover:bg-gray-50 dark:hover:bg-gray-900"
        >
          <td class="p-3">{{ draft.title }}</td>
          <td class="p-3">
            <!-- Show author name if available, otherwise user_id -->
            {{ draft.author?.name || draft.user_id || 'Unknown' }}
          </td>
          <td class="p-3">
            {{ new Date(draft.created_at).toLocaleDateString() }}
          </td>
          <td class="p-3 capitalize">{{ draft.status }}</td>
        </tr>
      </tbody>
    </table>
  </section>
</template>

<script setup lang="ts">
  import { onMounted } from 'vue';
  import { useDraftsStore } from '~~/store/drafts.store';

  definePageMeta({
    layout: 'admin',
  });

  // Draft type definition
  interface Author {
    id: string;
    name: string;
    email: string;
  }

  interface Draft {
    id: string;
    title: string;
    content: string;
    status: 'draft' | 'pending';
    user_id: string;
    created_at: string;
    updated_at: string;
    author?: Author; // optional, only if API sends
  }

  const draftsStore = useDraftsStore();

  onMounted(() => {
    draftsStore.fetchDrafts();
  });
</script>
