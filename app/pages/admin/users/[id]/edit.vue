<!-- /app/admin/users/[id]/edit.vue -->
<template>
  <section class="p-6 max-w-lg mx-auto">
    <template v-if="loading">
      <CreateUserSkeleton/>
    </template>

    <template v-else>
      <h1 class="text-2xl font-bold mb-4">
        {{ pageTitle }}
      </h1>

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

        <CustomSelect
          v-model="form.role"
          :options="userTypeOptions"
          :disabled="isDefaultSuperAdmin"
          placeholder="ব্যবহারকারী নির্বাচন করুন"
          class="w-full"
          :class="{'border-red-500 bg-red-50': errors.role}"
        />

        <div v-if="errors.role" class="text-red-500 text-sm">
          {{ errors.role }}
        </div>

        <BaseButton :loading="loading" type="submit" label="ব্যবহারকারী হালনাগাদ" />
      </form>
    </template>    
  </section>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useToast } from 'vue-toastification';
import { useUsersStore } from '~~/store/users.store';
import type { FormErrors, UserUpdateForm } from '~~/types/users';

  definePageMeta({ layout: 'admin' });

  const pageTitle = ref('ব্যবহারকারী তথ্য পরিবর্তন');

  const route = useRoute();
  const router = useRouter();
  const toast = useToast();
  const usersStore = useUsersStore();

  const userTypeOptions = ref([
    { label: 'সুপার এডমিন', value: 'super_admin' },
    { label: 'এডমিন', value: 'admin' },
    { label: 'রিপোর্টার', value: 'reporter' }
  ]);

  const userId = route.params.id as string;

  // Make sure all reactive form fields are strings
  const form = reactive<UserUpdateForm>({
    name: '',
    email: '',
    password: '',
    role: '',
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

    setTimeout(() => {
      loading.value = false;
    }, 2000);

    try {
      await usersStore.fetchUser(userId);
      const user = usersStore.selectedUser;
      if (!user) throw new Error('User not found');

      // Always cast to string
      form.name = String(user.name ?? '');
      form.email = String(user.email ?? '');
      form.role = String(user.role ?? 'admin');
      form.password = '';

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
