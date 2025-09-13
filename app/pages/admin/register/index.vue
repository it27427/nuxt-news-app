// /app/pages/admin/register/index.vue

<template>
  <div class="mt-10 w-full mx-auto md:w-36.5">
    <h1 class="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-center">
      {{ formTitle }}
    </h1>

    <RegisterForm :form="form" @success="onSuccess" @error="onError" />
  </div>
</template>

<script setup lang="ts">
  import RegisterForm from '@/components/admin/auth/RegisterForm.vue';
  import type { RegFormData, RegFormErrors } from '@/utils/types';
  import { reactive, ref } from 'vue';
  import { useRouter } from 'vue-router';
  import { useToast } from 'vue-toastification';

  definePageMeta({ layout: 'authentication' });

  const formTitle = ref('নিবন্ধন করুন');

  const form = reactive<RegFormData>({
    userName: '',
    email: '',
    password: '',
  });

  const toast = useToast();
  const router = useRouter();

  // Success listener
  function onSuccess(payload: { user: { userName: string }; message: string }) {
    const { user, message } = payload;

    // Show success toast
    toast.success(`${user.userName} ${message}`);

    // Redirect to login page after short delay
    setTimeout(() => {
      router.push('/admin/login');
    }, 1000);
  }

  // Error listener
  function onError(errors: RegFormErrors) {
    console.log('নিবন্ধন ত্রুটি:', errors);

    if (errors.userName) toast.error(errors.userName);
    if (errors.email) toast.error(errors.email);
    if (errors.password) toast.error(errors.password);
  }
</script>
