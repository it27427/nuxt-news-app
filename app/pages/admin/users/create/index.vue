<template>
  <section class="p-6 max-w-lg mx-auto">
    <h1 class="text-2xl font-bold mb-4">Create New User</h1>

    <form @submit.prevent="handleSubmit" class="space-y-4">
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
      <div class="flex gap-4 items-center">
        <label class="flex items-center gap-1">
          <input type="radio" value="admin" v-model="form.role" />
          Admin
        </label>

        <label class="flex items-center gap-1">
          <input type="radio" value="super_admin" v-model="form.role" />
          Super Admin
        </label>
      </div>

      <div v-if="errors.role" class="text-red-500 text-sm">
        {{ errors.role }}
      </div>

      <BaseButton
        :loading="usersStore.loading"
        type="submit"
        label="Create User"
      />
    </form>
  </section>
</template>

<script setup lang="ts">
  import { reactive } from 'vue';
  import { useRouter } from 'vue-router';
  import { useUsersStore } from '~~/store/users.store';
  import type { UserCreationForm, FormErrors } from '~~/types/users';

  definePageMeta({ layout: 'admin' });

  const toast = useToast();
  const router = useRouter();
  const usersStore = useUsersStore();

  const form = reactive<UserCreationForm>({
    name: '',
    email: '',
    password: '',
    role: 'admin',
  });

  const errors = reactive<FormErrors>({});

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
