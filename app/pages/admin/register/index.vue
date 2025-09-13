<template>
  <div class="mt-10 w-full mx-auto md:w-36.5">
    <h1 class="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-center">
      {{ formTitle }}
    </h1>

    <RegisterForm :form="form" @success="onSuccess" @error="onError" />
  </div>
</template>

<script setup lang="ts">
  import { navigateTo } from '#imports';
  import RegisterForm from '@/components/admin/auth/RegisterForm.vue';
  import { errorMessages } from '@/utils/messages';
  import { reactive, ref } from 'vue';
  import { useToast } from 'vue-toastification';

  import type { RegFormData, RegFormErrors } from '@/utils/types';

  definePageMeta({ layout: 'authentication' });

  const formTitle = ref('নিবন্ধন করুন');

  const form = reactive<RegFormData>({
    userName: '',
    email: '',
    password: '',
  });

  const toast = useToast();

  // Success listener
  function onSuccess(user: { userName: string }) {
    toast.success(`${user.userName} ${errorMessages.registrationSuccess}`);

    // Redirect to login page after short delay
    setTimeout(() => {
      navigateTo('/admin/login');
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
