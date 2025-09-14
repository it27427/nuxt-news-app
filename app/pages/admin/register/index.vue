<template>
  <div class="-mt-12 md:-mt-24 w-full max-w-md mx-auto">
    <div class="flex items-center justify-center w-32 h-25 mx-auto mb-4">
      <AuthLogo />
    </div>

    <h1 class="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-center">
      {{ formTitle }}
    </h1>

    <RegisterForm :form="form" @success="onSuccess" @error="onError" />

    <div class="flex items-center justify-center gap-2 mt-8">
      <p class="text-md text-dark dark:text-light">ইতিমধ্যে অ্যাকাউন্ট আছে?</p>
      <client-only>
        <BaseLink
          to="/admin/login"
          class="text-md text-dark dark:text-white font-medium underline transition-colors hover:text-primary-dark dark:hover:text-primary"
        >
          লগইন করুন
        </BaseLink>
      </client-only>
    </div>
  </div>
</template>

<script setup lang="ts">
  import RegisterForm from '@/components/admin/auth/RegisterForm.vue';
  import AuthLogo from '@/components/admin/AuthLogo.vue';
  import BaseLink from '@/components/base/BaseLink.vue';
  import type { RegFormData, RegFormErrors } from '@/utils/types';
  import { reactive, ref } from 'vue';
  import { useRouter } from 'vue-router';
  import { useToast } from 'vue-toastification';

  definePageMeta({
    layout: 'authentication',
  });

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
    toast.success(`${payload.user.userName} ${payload.message}`);

    // Redirect to login page after 1 second
    setTimeout(() => {
      router.push('/admin/login');
    }, 1000);

    // Reset form fields (also done inside RegisterForm.vue, but safe here)
    Object.keys(form).forEach((key) => (form[key as keyof RegFormData] = ''));
  }

  // Error listener
  function onError(errors: RegFormErrors) {
    console.log('নিবন্ধন ত্রুটি:', errors);
    if (errors.userName) toast.error(errors.userName);
    if (errors.email) toast.error(errors.email);
    if (errors.password) toast.error(errors.password);
  }
</script>
