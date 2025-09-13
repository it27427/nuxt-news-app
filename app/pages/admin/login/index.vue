<template>
  <div class="mt-10 w-full max-w-md mx-auto">
    <h1 class="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-center">
      {{ formTitle }}
    </h1>

    <LoginForm :form="form" @success="onSuccess" @error="onError" />
  </div>
</template>

<script setup lang="ts">
  import LoginForm from '@/components/admin/auth/LoginForm.vue';
  import { validateMessages } from '@/utils/messages';
  import type { LoginFormData } from '@/utils/types';
  import { reactive, ref } from 'vue';
  import { useToast } from 'vue-toastification';

  definePageMeta({ layout: 'authentication' });

  const formTitle = ref('লগইন করুন');

  const form = reactive<LoginFormData>({
    email: '',
    password: '',
  });

  const toast = useToast();

  function onSuccess(payload: any) {
    toast.success(payload.message || validateMessages.loginSuccess);
  }

  function onError(errors: any) {
    console.log('লগইন ত্রুটি:', errors);

    // centralized messages
    if (errors.message)
      toast.error(errors.message || validateMessages.loginFailed);
    if (errors.email) toast.error(errors.email.required);
    if (errors.password) toast.error(errors.password.required);
  }
</script>
