<template>
  <section class="p-6">
    <h1 class="text-2xl font-bold mb-4">Notifications</h1>

    <!-- Loading State -->
    <div v-if="notificationsStore.loading" class="text-gray-500">
      Loading notifications...
    </div>

    <!-- Error State -->
    <div v-else-if="notificationsStore.error" class="text-red-500">
      {{ notificationsStore.error }}
    </div>

    <!-- Empty State -->
    <div
      v-else-if="notificationsStore.notifications.length === 0"
      class="text-gray-500"
    >
      No notifications found.
    </div>

    <!-- Notifications Table -->
    <table
      v-else
      class="w-full border border-gray-200 dark:border-gray-700 text-left"
    >
      <thead class="bg-gray-100 dark:bg-gray-800">
        <tr>
          <th class="p-3 border-b">Message</th>
          <th class="p-3 border-b">Type</th>
          <th class="p-3 border-b">Related Article</th>
          <th class="p-3 border-b">Read</th>
          <th class="p-3 border-b">Created At</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="notif in notificationsStore.notifications"
          :key="notif.id"
          class="hover:bg-gray-50 dark:hover:bg-gray-900"
        >
          <td class="p-3">{{ notif.message }}</td>
          <td class="p-3 capitalize">{{ notif.type }}</td>
          <td class="p-3">{{ notif.related_article_id || '-' }}</td>
          <td class="p-3">{{ notif.is_read ? 'Yes' : 'No' }}</td>
          <td class="p-3">{{ new Date(notif.created_at).toLocaleString() }}</td>
        </tr>
      </tbody>
    </table>
  </section>
</template>

<script setup lang="ts">
  import { onMounted } from 'vue';
  import { useNotificationsStore } from '~~/store/notifications.store';

  definePageMeta({
    layout: 'admin',
  });

  const notificationsStore = useNotificationsStore();

  onMounted(() => {
    notificationsStore.fetchNotifications();
  });
</script>
