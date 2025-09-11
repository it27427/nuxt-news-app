<template>
  <div class="mt-10 max-md:max-w-md md:w-96">
    <h1 class="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-center">
      “{{ formTitle }}”
    </h1>
    <RegisterForm :form="form" @success="onSuccess" @error="onError" />
  </div>
</template>

<script setup lang="ts">
  import RegisterForm from '@/components/admin/auth/RegisterForm.vue';
  import { reactive, ref } from 'vue';

  definePageMeta({
    layout: 'authentication',
  });

  const formTitle = ref('নিবন্ধন করুন');

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
    alert(`${user.userName} সফলভাবে নিবন্ধিত!`);
  }

  // Listen to field errors
  function onError(errors: any) {
    console.log('নিবন্ধন ত্রুটি:', errors);
  }
</script>
