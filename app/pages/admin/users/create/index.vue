<!-- /app/admin/users/create.vue -->
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

      <BaseButton :loading="loading" type="submit" label="Create User" />
    </form>
  </section>
</template>

<script setup lang="ts">
  import axios from 'axios';
  import { reactive, ref } from 'vue';
  import { useRouter } from 'vue-router';
  import BaseButton from '~/components/admin/common/BaseButton.vue';
  import BaseInput from '~/components/admin/common/BaseInput.vue';

  definePageMeta({ layout: 'admin' });

  interface Form {
    name: string;
    email: string;
    password: string;
    role: string;
  }

  interface FormErrors {
    name?: string;
    email?: string;
    password?: string;
    role?: string;
  }

  const router = useRouter();

  const form = reactive<Form>({
    name: '',
    email: '',
    password: '',
    role: 'admin',
  });

  const errors = reactive<FormErrors>({});
  const loading = ref(false);

  const handleSubmit = async () => {
    loading.value = true;
    Object.keys(errors).forEach(
      (k) => (errors[k as keyof FormErrors] = undefined)
    );

    try {
      const res = await axios.post('/api/admin/users/create', form);
      alert(res.data.message || 'User created successfully');
      router.push('/admin/users');
    } catch (err: any) {
      if (err.response?.data?.fields) {
        Object.assign(errors, err.response.data.fields);
      } else {
        alert(err.response?.data?.message || 'Something went wrong');
      }
    } finally {
      loading.value = false;
    }
  };
</script>
