<template>
  <div class="max-w-md mx-auto mt-10">
    <h1 class="text-2xl font-bold mb-6 text-center">Register Admin</h1>
    <RegisterForm :form="form" @success="onSuccess" @error="onError" />
  </div>
</template>

<script setup lang="ts">
  import RegisterForm from '@/components/admin/auth/RegisterForm.vue';
  import { reactive } from 'vue';

  interface FormData {
    userName: string;
    email: string;
    password: string;
  }

  const form = reactive<FormData>({
    userName: '',
    email: '',
    password: '',
  });

  // Listen to success
  function onSuccess(user: any) {
    alert(`Admin ${user.userName} registered successfully!`);
  }

  // Listen to field errors
  function onError(errors: any) {
    console.log('Registration errors:', errors);
  }
</script>
