<template>
  <section class="p-6">
    <h1 class="text-2xl font-bold mb-4">Approval Panel</h1>

    <!-- Status Filter -->
    <div class="mb-4 flex items-center gap-3">
      <label for="status" class="font-semibold">Filter by Status:</label>
      <CustomSelects
        v-model="selectedStatus"
        :options="[
          { label: 'Pending', value: 'pending' },
          { label: 'Approved', value: 'approved' },
          { label: 'Rejected', value: 'rejected' },
          { label: 'Published', value: 'published' },
        ]"
      />
    </div>

    <!-- Loading State -->
    <div v-if="approvalStore.loading" class="text-gray-500">
      Loading approvals...
    </div>

    <!-- Error State -->
    <div v-else-if="approvalStore.error" class="text-red-500">
      {{ approvalStore.error }}
    </div>

    <!-- Empty State -->
    <div
      v-else-if="approvalStore.approvalList.length === 0"
      class="text-gray-500"
    >
      No news found for this status.
    </div>

    <!-- Approval Table -->
    <table
      v-else
      class="w-full border border-gray-200 dark:border-gray-700 text-left"
    >
      <thead class="bg-gray-100 dark:bg-gray-800">
        <tr>
          <th class="p-3 border-b">Title</th>
          <th class="p-3 border-b">Status</th>
          <th class="p-3 border-b">Approval Status</th>
          <th class="p-3 border-b">Created At</th>
          <th class="p-3 border-b">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="news in approvalStore.approvalList"
          :key="news.id"
          class="hover:bg-gray-50 dark:hover:bg-gray-900"
        >
          <td class="p-3">{{ news.title }}</td>
          <td class="p-3 capitalize">{{ news.status }}</td>
          <td class="p-3 capitalize">{{ news.approval_status }}</td>
          <td class="p-3">{{ new Date(news.created_at).toLocaleString() }}</td>
          <td class="p-3 flex gap-2">
            <button
              v-if="news.approval_status === 'pending'"
              @click="approveNews(news.id)"
              class="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
            >
              Approve
            </button>
            <button
              v-if="news.approval_status === 'pending'"
              @click="rejectNews(news.id)"
              class="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Reject
            </button>
            <span v-else class="text-gray-500">-</span>
          </td>
        </tr>
      </tbody>
    </table>
  </section>
</template>

<script setup lang="ts">
  import { onMounted, ref } from 'vue';
  import { useApprovalStore } from '~~/store/approval.store';

  definePageMeta({
    layout: 'admin',
  });

  const approvalStore = useApprovalStore();
  const selectedStatus = ref<'pending' | 'approved' | 'rejected' | 'published'>(
    'pending'
  );

  const fetchApprovals = () => {
    approvalStore.fetchApprovalList(selectedStatus.value);
  };

  const approveNews = async (newsId: string) => {
    try {
      await approvalStore.takeAction(newsId, 'approved');
      alert('News approved successfully.');
      fetchApprovals(); // Refresh list
    } catch (err: any) {
      alert(err.message || 'Approval failed.');
    }
  };

  const rejectNews = async (newsId: string) => {
    try {
      await approvalStore.takeAction(newsId, 'rejected');
      alert('News rejected successfully.');
      fetchApprovals(); // Refresh list
    } catch (err: any) {
      alert(err.message || 'Rejection failed.');
    }
  };

  onMounted(fetchApprovals);
</script>
