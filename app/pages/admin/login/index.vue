<template>
  <div class="-mt-12 md:-mt-24 w-full max-w-md mx-auto">
    <div class="flex items-center justify-center w-32 h-25 mx-auto mb-4">
      <AuthLogo />
    </div>

    <h1 class="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-center">
      {{ formTitle }}
    </h1>

    <LoginForm :form="form" @success="onSuccess" @error="onError" />

    <div class="flex items-center justify-center gap-2 mt-8">
      <p class="text-md text-dark dark:text-light">কোন অ্যাকাউন্ট নেই?</p>
      <client-only>
        <BaseLink
          to="/admin/register"
          class="text-md text-dark dark:text-white font-medium underline transition-colors hover:text-primary-dark dark:hover:text-primary"
        >
          নিবন্ধন করুন
        </BaseLink>
      </client-only>
    </div>
  </div>
</template>

<script setup lang="ts">
  import LoginForm from '@/components/admin/auth/LoginForm.vue';
  import AuthLogo from '@/components/admin/AuthLogo.vue';
  import BaseLink from '@/components/base/BaseLink.vue';
  import { validateMessages } from '@/utils/messages';
  import type { LoginFormData, LoginFormErrors } from '@/utils/types';
  import { reactive, ref } from 'vue';
  import { useToast } from 'vue-toastification';

  definePageMeta({ layout: 'authentication' });

  const formTitle = ref('লগইন করুন');
  const form = reactive<LoginFormData>({ email: '', password: '' });
  const toast = useToast();

  function onSuccess(payload: { message: string }): void {
    toast.success(payload.message || validateMessages.loginSuccess);
  }

  function onError(
    errors: Partial<LoginFormErrors> & { message?: string }
  ): void {
    if (errors.message) toast.error(errors.message);
    if (errors.email) toast.error(errors.email);
    if (errors.password) toast.error(errors.password);
  }
</script>
