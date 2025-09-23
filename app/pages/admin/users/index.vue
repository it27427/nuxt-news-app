<!-- /app/admin/users/index.vue -->
<template>
  <section class="p-6">
    <h1 class="text-2xl font-bold mb-4">Users List</h1>

    <BaseButton
      class="mb-4"
      @click="router.push('/admin/users/create')"
      label="Create New User"
    />

    <table class="w-full table-auto border-collapse border border-gray-200">
      <thead>
        <tr class="bg-gray-100">
          <th class="p-2 border">Name</th>
          <th class="p-2 border">Email</th>
          <th class="p-2 border">Role</th>
          <th class="p-2 border">Created At</th>
          <th class="p-2 border">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="user in users" :key="user.id" class="hover:bg-gray-50">
          <td class="p-2 border">{{ user.name }}</td>
          <td class="p-2 border">{{ user.email }}</td>
          <td class="p-2 border">{{ user.role }}</td>
          <td class="p-2 border">
            {{ new Date(user.created_at).toLocaleString() }}
          </td>

          <td class="p-2 border">
            <BaseButton
              small
              class="mr-2"
              :disabled="user.isDefaultSuperAdmin"
              @click="editUser(user.id)"
              label="Edit"
            />
            <BaseButton
              small
              color="red"
              :disabled="user.isDefaultSuperAdmin"
              @click="confirmDelete(user)"
              label="Delete"
            />
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Vue Final Modal -->
    <VueFinalModal
      v-model="showModal"
      :hide-overlay="false"
      :click-to-close="false"
      class="p-6 bg-white rounded shadow max-w-md mx-auto"
    >
      <h2 class="text-xl font-bold mb-4">Confirm Delete</h2>
      <p>
        Are you sure you want to delete
        <strong>{{ selectedUser?.name }}</strong>
        ?
      </p>
      <div class="mt-4 flex justify-end gap-2">
        <BaseButton @click="showModal = false" label="Cancel" />
        <BaseButton color="red" @click="deleteUser" label="Delete" />
      </div>
    </VueFinalModal>
  </section>
</template>

<script setup lang="ts">
  definePageMeta({ layout: 'admin' });

  const router = useRouter();
  const users = ref<any[]>([]);
  const showModal = ref(false);
  const selectedUser = ref<any>(null);

  const fetchUsers = async () => {
    try {
      const res = await axios.get('/api/admin/users');
      users.value = res.data;
    } catch (err: any) {
      alert(err.message || 'Failed to fetch users');
    }
  };

  const editUser = (id: string) => {
    router.push(`/admin/users/${id}/edit`);
  };

  const confirmDelete = (user: any) => {
    selectedUser.value = user;
    showModal.value = true;
  };

  const deleteUser = async () => {
    if (!selectedUser.value) return;

    try {
      await axios.post(`/api/admin/users/${selectedUser.value.id}/delete`);
      users.value = users.value.filter((u) => u.id !== selectedUser.value.id);
      showModal.value = false;
      selectedUser.value = null;
      alert('User deleted successfully');
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to delete user');
    }
  };

  onMounted(fetchUsers);
</script>
