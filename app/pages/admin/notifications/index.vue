<template>
  <section class="p-6 flex flex-col gap-6">
    <!-- Title -->
    <h1 class="text-2xl font-bold text-center mb-6">
      <template v-if="loading">
        <div
          class="h-8 w-48 mx-auto bg-gray-200 dark:bg-slate-700 animate-pulse rounded"
        ></div>
      </template>
      <template v-else>🔔 Notifications</template>
    </h1>

    <!-- Skeleton Loader -->
    <div v-if="loading" class="grid md:grid-cols-2 gap-4">
      <div
        v-for="n in 4"
        :key="'skeleton-' + n"
        class="p-4 border rounded-lg shadow bg-gray-50 dark:bg-slate-800 animate-pulse"
      >
        <div class="h-5 w-40 bg-gray-200 dark:bg-slate-700 rounded mb-3"></div>
        <div class="h-4 w-64 bg-gray-200 dark:bg-slate-700 rounded mb-2"></div>
        <div class="h-4 w-24 bg-gray-200 dark:bg-slate-700 rounded"></div>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="text-red-500 text-center">
      {{ error }}
    </div>

    <!-- Empty State -->
    <div
      v-else-if="notifications.length === 0"
      class="text-gray-500 text-center"
    >
      😴 No notifications found.
    </div>

    <!-- Notifications Cards -->
    <div v-else class="grid md:grid-cols-2 gap-4">
      <div
        v-for="notif in notifications"
        :key="notif.id"
        class="p-5 border rounded-lg shadow-sm bg-white dark:bg-slate-900 transition hover:shadow-md relative"
      >
        <!-- Message -->
        <p class="font-semibold text-lg mb-2">
          {{ notif.message }}
        </p>

        <!-- Type + Time -->
        <p class="text-sm text-gray-600 dark:text-gray-400 mb-2">
          Type:
          <span class="capitalize font-medium">{{ notif.type }}</span>
        </p>
        <p class="text-sm text-gray-500">
          {{ new Date(notif.created_at).toLocaleString() }}
        </p>

        <!-- Footer Actions -->
        <div class="flex justify-between items-center mt-4">
          <!-- Mark as Read -->
          <button
            v-if="!notif.read"
            @click="markAsReadAction(notif.id)"
            class="px-3 py-1 text-sm font-medium bg-blue-500 text-white rounded hover:bg-blue-600 transition"
          >
            Mark as Read
          </button>
          <span
            v-else
            class="text-green-600 text-sm font-medium flex items-center gap-1"
          >
            <Icon icon="mdi:check-circle" class="text-lg" />
            Read
          </span>

          <!-- Delete -->
          <button
            @click="openDeleteModal(notif)"
            class="text-red-500 hover:text-red-700 transition"
            title="Delete notification"
          >
            <Icon icon="mdi:delete" class="text-xl" />
          </button>
        </div>
      </div>
    </div>

    <!-- Delete Modal -->
    <VueFinalModal
      v-model="showModal"
      :clickToClose="false"
      class="fixed inset-0 flex items-center justify-center z-50 bg-black/50"
    >
      <div
        class="p-8 bg-white dark:bg-slate-800 rounded-lg shadow-lg max-w-md text-center"
      >
        <h4 class="text-lg font-semibold mb-6">
          Are you sure you want to delete?
        </h4>
        <div class="flex justify-center gap-4">
          <button
            @click="confirmDelete"
            class="px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark transition"
          >
            Yes
          </button>
          <button
            @click="showModal = false"
            class="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-700 transition"
          >
            No
          </button>
        </div>
      </div>
    </VueFinalModal>
  </section>
</template>

<script setup lang="ts">
  import { onMounted, ref } from 'vue';
  import { VueFinalModal } from 'vue-final-modal';
  import { useToast } from 'vue-toastification';
  import { useNotificationsStore } from '~~/store/notifications.store';
import { Icon } from '@iconify/vue';

  definePageMeta({ layout: 'admin' });

  const store = useNotificationsStore();
  const toast = useToast();

  const loading = ref(true);
  const error = ref<string | null>(null);
  const notifications = ref<any[]>([]);

  // Delete Modal
  const showModal = ref(false);
  let selectedNotif: any | null = null;

  onMounted(async () => {
    try {
      loading.value = true;
      await store.fetchNotifications();
      notifications.value = store.notifications;
    } catch (err: any) {
      error.value = err?.message || 'Failed to load notifications.';
    } finally {
      loading.value = false;
    }
  });

  // Actions
  async function markAsReadAction(id: string) {
    try {
      await store.markAsRead(id);
      toast.success('Notification marked as read!');
    } catch (err: any) {
      toast.error(err?.message || 'Failed to mark as read.');
    }
  }

  function openDeleteModal(notif: any) {
    selectedNotif = notif;
    showModal.value = true;
  }

  async function confirmDelete() {
    if (!selectedNotif) return;
    try {
      await store.deleteNotification(selectedNotif.id);
      notifications.value = store.notifications;
      toast.success('Notification deleted successfully!');
    } catch (err: any) {
      toast.error(err?.message || 'Failed to delete notification.');
    } finally {
      selectedNotif = null;
      showModal.value = false;
    }
  }
</script>
