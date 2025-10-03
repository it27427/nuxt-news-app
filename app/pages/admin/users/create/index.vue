<template>
  <section class="p-6 max-w-lg mx-auto">
    <template v-if="loading">
      <CreateUserSkeleton/>
    </template>
    
    <template v-else>
      <h1 class="text-2xl font-bold mb-4">{{ pageTitle }}</h1>

      <form @submit.prevent="handleSubmit" class="flex flex-col gap-4">
        <BaseInput v-model="form.name" label="Name" :error="errors.name" />

        <BaseInput
          v-model="form.email"
          label="Email"
          type="email"
          :error="errors.email"
        />

        <BaseInput
          v-model="form.password"
          label="Password"
          type="password"
          :error="errors.password"
        />

        <!-- Role selection -->
        <div class="flex flex-col gap-2 mb-4">
          <CustomSelect
            v-model="form.role"
            :options="userTypeOptions"
            placeholder="ব্যবহারকারী নির্বাচন করুন"
            class="w-full"
            :error="!!errors.role"
            :errorMessage="errors.role"
          />
        </div>

        <BaseButton
          :loading="usersStore.loading"
          type="submit"
          label="ব্যবহারকারী তৈরি"
        />
      </form>
    </template>
  </section>
</template>

<script setup lang="ts">
import { reactive } from 'vue';
import { useRouter } from 'vue-router';
import { useUsersStore } from '~~/store/users.store';
import type { FormErrors, UserCreationForm } from '~~/types/users';

  definePageMeta({ layout: 'admin' });

  const pageTitle = ref('নতুন ব্যবহারকারী তৈরি');
  const loading = ref(true);

  const toast = useToast();
  const router = useRouter();
  const usersStore = useUsersStore();

  const userTypeOptions = ref([
    { label: 'সুপার এডমিন', value: 'super_admin' },
    { label: 'এডমিন', value: 'admin' },
    { label: 'রিপোর্টার', value: 'reporter' }
  ]);

  const form = reactive<UserCreationForm>({
    name: '',
    email: '',
    password: '',
    role: '',
  });

  const errors = reactive<FormErrors>({});

  onMounted(() => {
    setTimeout(() => {
      loading.value = false;
    }, 2000);
  });

  const handleSubmit = async () => {
    Object.keys(errors).forEach(
      (k) => (errors[k as keyof FormErrors] = undefined)
    );

    let hasError = false;
    if (!form.name) {
      errors.name = 'Name is required';
      hasError = true;
    }
    if (!form.email) {
      errors.email = 'Email is required';
      hasError = true;
    }
    if (!form.password) {
      errors.password = 'Password is required';
      hasError = true;
    }
    if (!form.role) {
      errors.role = 'Role is required';
      hasError = true;
    }

    if (hasError) {
      return;
    }

    try {
      const res = await usersStore.createUser(form);

      toast.success(res.message || 'User created successfully');

      Object.assign(form, {
        name: '',
        email: '',
        password: '',
        role: 'admin',
      });

      router.push('/admin/users');
    } catch (err: any) {
      if (err.response?.data?.fields) {
        Object.assign(errors, err.response.data.fields);
      } else {
        toast.error(usersStore.error || 'Something went wrong');
      }
    }
  };
</script>
