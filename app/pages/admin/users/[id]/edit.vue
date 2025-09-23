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

      <!-- Only allow password update if entered -->
      <BaseInput
        v-model="form.password"
        label="Password (Leave blank to keep unchanged)"
        type="password"
        :error="errors.password"
      />

      <!-- Role selection -->
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

  const route = useRoute();
  const router = useRouter();
  const userId = route.params.id as string;

  const form = reactive<Form>({
    name: '',
    email: '',
    password: '',
    role: 'admin',
  });
  const errors = reactive<FormErrors>({});
  const loading = ref(false);
  const isDefaultSuperAdmin = ref(false);

  onMounted(async () => {
    try {
      const res = await axios.get(`/api/admin/users/${userId}`);
      const user = res.data.user;

      form.name = user.name;
      form.email = user.email;
      form.role = user.role;

      // Disable role change for default SUPER_ADMIN
      if (user.email === process.env.SUPER_ADMIN_EMAIL) {
        isDefaultSuperAdmin.value = true;
      }
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to fetch user data');
      router.push('/admin/users');
    }
  });

  const handleUpdate = async () => {
    loading.value = true;
    Object.keys(errors).forEach(
      (k) => (errors[k as keyof FormErrors] = undefined)
    );

    try {
      const res = await axios.put(`/api/admin/users/${userId}`, form);
      alert(res.data.message || 'User updated successfully');
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
