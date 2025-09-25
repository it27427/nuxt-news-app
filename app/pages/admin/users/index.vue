<template>
  <section class="p-6 md:p-5 flex flex-col gap-6">
    <h1 class="text-2xl font-bold text-dark-surface dark:text-white">
      ব্যবহারকারীর তালিকা
    </h1>

    <!-- Loading Skeleton -->
    <table
      v-if="usersStore.loading"
      class="w-full table-auto border-collapse border border-gray-200 dark:border-slate-700 text-lg text-center"
    >
      <thead>
        <tr class="bg-gray-100 dark:bg-dark-divider">
          <th class="px-4 py-2 border border-gray-300 dark:border-slate-700">
            ক্রমিক নম্বর
          </th>
          <th class="px-4 py-2 border border-gray-300 dark:border-slate-700">
            নাম
          </th>
          <th class="px-4 py-2 border border-gray-300 dark:border-slate-700">
            ইমেইল
          </th>
          <th class="px-4 py-2 border border-gray-300 dark:border-slate-700">
            ভূমিকা
          </th>
          <th class="px-4 py-2 border border-gray-300 dark:border-slate-700">
            তৈরি হয়েছে
          </th>
          <th class="px-4 py-2 border border-gray-300 dark:border-slate-700">
            কার্যক্রম
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="n in 5" :key="'skeleton-' + n">
          <td class="px-4 py-3 border border-gray-300 dark:border-slate-700">
            <div
              class="h-6 w-10 mx-auto bg-gray-200 dark:bg-slate-700 animate-pulse rounded"
            ></div>
          </td>
          <td class="px-4 py-3 border border-gray-300 dark:border-slate-700">
            <div
              class="h-6 w-24 mx-auto bg-gray-200 dark:bg-slate-700 animate-pulse rounded"
            ></div>
          </td>
          <td class="px-4 py-3 border border-gray-300 dark:border-slate-700">
            <div
              class="h-6 w-32 mx-auto bg-gray-200 dark:bg-slate-700 animate-pulse rounded"
            ></div>
          </td>
          <td class="px-4 py-3 border border-gray-300 dark:border-slate-700">
            <div
              class="h-6 w-20 mx-auto bg-gray-200 dark:bg-slate-700 animate-pulse rounded"
            ></div>
          </td>
          <td class="px-4 py-3 border border-gray-300 dark:border-slate-700">
            <div
              class="h-6 w-28 mx-auto bg-gray-200 dark:bg-slate-700 animate-pulse rounded"
            ></div>
          </td>
          <td class="px-4 py-3 border border-gray-300 dark:border-slate-700">
            <div class="flex justify-center gap-3">
              <div
                class="h-8 w-14 bg-gray-200 dark:bg-slate-700 animate-pulse rounded-md"
              ></div>
              <div
                class="h-8 w-14 bg-gray-200 dark:bg-slate-700 animate-pulse rounded-md"
              ></div>
            </div>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Empty State -->
    <div
      v-else-if="!usersStore.loading && usersStore.users.length === 0"
      class="py-6 text-gray-400 text-center flex flex-col items-center justify-center gap-3"
    >
      <span class="text-6xl">👤</span>
      <p class="text-xl">কোন ব্যবহারকারী নেই!</p>
      <div class="w-64">
        <BaseButton
          @click="router.push('/admin/users/create')"
          label="নতুন ব্যবহারকারী তৈরি করুন"
        />
      </div>
    </div>

    <!-- Data Rows -->
    <table
      v-else
      class="w-full table-auto border-collapse border border-gray-200 dark:border-slate-700 text-lg text-center"
    >
      <thead>
        <tr class="bg-gray-100 dark:bg-dark-divider">
          <th class="px-4 py-2 border border-gray-300 dark:border-slate-700">
            ক্রমিক নম্বর
          </th>
          <th class="px-4 py-2 border border-gray-300 dark:border-slate-700">
            নাম
          </th>
          <th class="px-4 py-2 border border-gray-300 dark:border-slate-700">
            ইমেইল
          </th>
          <th class="px-4 py-2 border border-gray-300 dark:border-slate-700">
            ভূমিকা
          </th>
          <th class="px-4 py-2 border border-gray-300 dark:border-slate-700">
            তৈরি হয়েছে
          </th>
          <th class="px-4 py-2 border border-gray-300 dark:border-slate-700">
            কার্যক্রম
          </th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(user, index) in usersStore.users"
          :key="user.id"
          class="hover:bg-gray-50 dark:hover:bg-dark-surface"
        >
          <td class="p-2 border border-gray-300 dark:border-slate-700">
            {{ index + 1 }}
          </td>
          <td class="p-2 border border-gray-300 dark:border-slate-700">
            {{ user.name }}
          </td>
          <td class="p-2 border border-gray-300 dark:border-slate-700">
            {{ user.email }}
          </td>
          <td class="p-2 border border-gray-300 dark:border-slate-700">
            {{ user.role }}
          </td>
          <td class="p-2 border border-gray-300 dark:border-slate-700">
            {{ formatDate(user.created_at) }}
          </td>
          <td class="p-2 border border-gray-300 dark:border-slate-700">
            <div class="flex justify-center gap-2">
              <BaseButton @click="editUser(user.id)" label="Edit" />
              <BaseButton @click="confirmDelete(user)" label="Delete" />
            </div>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Vue Final Modal for Delete Confirmation -->
    <VueFinalModal
      v-model="showModal"
      :hide-overlay="false"
      :click-to-close="false"
      class="fixed inset-0 flex items-center justify-center z-50 bg-black/50"
      :transition="{
        enterActiveClass: 'ease-out duration-300',
        enterFromClass: 'opacity-0 scale-90',
        enterToClass: 'opacity-100 scale-100',
        leaveActiveClass: 'ease-in duration-200',
        leaveFromClass: 'opacity-100 scale-100',
        leaveToClass: 'opacity-0 scale-90',
      }"
    >
      <div
        class="p-8 bg-white dark:bg-dark-divider rounded-lg shadow-lg max-w-96 text-center"
      >
        <h4 class="text-lg font-hind font-medium mb-6">
          আপনি কি নিশ্চিতভাবে এই ইউজারকে মুছে ফেলতে চান?
        </h4>

        <div class="flex justify-center gap-3">
          <button
            @click="showModal = false"
            class="px-4 py-2 font-hind text-base flex items-center justify-center bg-gray-500 text-white rounded hover:bg-gray-700 dark:bg-gray-700 dark:hover:bg-gray-500 transition duration-400"
          >
            না
          </button>
          <button
            @click="deleteUser"
            class="px-4 py-2 font-hind text-base flex items-center justify-center bg-red-500 text-white rounded hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-500 transition duration-400"
          >
            হ্যাঁ
          </button>
        </div>
      </div>
    </VueFinalModal>
  </section>
</template>

<script setup lang="ts">
  import { onMounted, ref } from 'vue';
  import { VueFinalModal } from 'vue-final-modal';
  import { useRouter } from 'vue-router';
  import { useUsersStore } from '~~/store/users.store';
  import type { User } from '~~/types/users';

  definePageMeta({ layout: 'admin' });

  const toast = useToast();
  const router = useRouter();
  const usersStore = useUsersStore();

  const showModal = ref(false);
  const selectedUser = ref<User | null>(null);

  // Fetch users when the component is mounted
  onMounted(() => {
    usersStore.fetchUsers();
  });

  // Navigate to edit page
  const editUser = (id: string) => {
    router.push(`/admin/users/${id}/edit`);
  };

  // Open delete confirmation modal
  const confirmDelete = (user: User) => {
    selectedUser.value = user;
    showModal.value = true;
  };

  // Call store's delete action
  const deleteUser = async () => {
    if (!selectedUser.value) return;

    try {
      const deletedName = selectedUser.value.name;
      await usersStore.deleteUser(selectedUser.value.id);
      await usersStore.fetchUsers();
      toast.success(`${deletedName} deleted successfully`);

      showModal.value = false;
      selectedUser.value = null;
    } catch (err: any) {
      console.error(err);
      toast.error('Failed to delete user');
    }
  };

  /**
   * Formats a date string to a readable format.
   * Returns the original string if parsing fails.
   */
  const formatDate = (dateString: string): string => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return dateString;
      }
      return date.toLocaleString();
    } catch {
      return dateString;
    }
  };
</script>
