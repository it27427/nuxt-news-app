<!-- /app/admin/users/[id]/edit.vue -->
<template>
  <section class="p-6 max-w-lg mx-auto">
    <h1 class="text-2xl font-bold mb-4">Edit User</h1>

    <form @submit.prevent="handleUpdate" class="space-y-4">
      <BaseInput v-model="form.name" label="Name" :error="errors.name" />

      <BaseInput
        v-model="form.email"
        label="Email"
        type="email"
        :error="errors.email"
      />

      <BaseInput
        v-model="form.password"
        label="Password (Leave blank to keep unchanged)"
        type="password"
        :error="errors.password"
      />

      <div class="flex gap-4 items-center">
        <label class="flex items-center gap-1">
          <input
            type="radio"
            value="admin"
            v-model="form.role"
            :disabled="isDefaultSuperAdmin"
          />
          Admin
        </label>

        <label class="flex items-center gap-1">
          <input
            type="radio"
            value="super_admin"
            v-model="form.role"
            :disabled="isDefaultSuperAdmin"
          />
          Super Admin
        </label>
      </div>

      <div v-if="errors.role" class="text-red-500 text-sm">
        {{ errors.role }}
      </div>

      <BaseButton :loading="loading" type="submit" label="Update User" />
    </form>
  </section>
</template>

<script setup lang="ts">
  import { onMounted, reactive, ref } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import { useToast } from 'vue-toastification';
  import { useUsersStore } from '~~/store/users.store';
  import type { FormErrors, UserUpdateForm } from '~~/types/users';

  definePageMeta({ layout: 'admin' });

  const route = useRoute();
  const router = useRouter();
  const toast = useToast();
  const usersStore = useUsersStore();

  const userId = route.params.id as string;

  // Make sure all reactive form fields are strings
  const form = reactive<UserUpdateForm>({
    name: '',
    email: '',
    password: '', // always string
    role: 'admin',
  });

  // Errors: all strings
  const errors = reactive<FormErrors>({
    name: '',
    email: '',
    password: '',
    role: '',
  });

  const loading = ref(false);
  const isDefaultSuperAdmin = ref(false);

  onMounted(async () => {
    loading.value = true;
    try {
      await usersStore.fetchUser(userId);
      const user = usersStore.selectedUser;
      if (!user) throw new Error('User not found');

      // Always cast to string
      form.name = String(user.name ?? '');
      form.email = String(user.email ?? '');
      form.role = String(user.role ?? 'admin');
      form.password = ''; // optional field: start as empty string

      if (user.email === process.env.SUPER_ADMIN_EMAIL) {
        isDefaultSuperAdmin.value = true;
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to fetch user data');
      router.push('/admin/users');
    } finally {
      loading.value = false;
    }
  });

  const handleUpdate = async () => {
    loading.value = true;

    // Reset errors
    Object.keys(errors).forEach((k) => (errors[k as keyof FormErrors] = ''));

    try {
      await usersStore.updateUser(userId, form);
      toast.success('User updated successfully');
      router.push('/admin/users');
    } catch (err: any) {
      if (err.response?.data?.fields) {
        Object.keys(err.response.data.fields).forEach((key) => {
          errors[key as keyof FormErrors] = String(
            err.response.data.fields[key] ?? ''
          );
        });
      } else {
        toast.error(err.response?.data?.message || 'Something went wrong');
      }
    } finally {
      loading.value = false;
    }
  };
</script>
