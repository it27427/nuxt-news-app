<template>
  <div class="mt-10 w-full mx-auto md:w-36.5">
    <h1 class="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-center">
      “{{ formTitle }}”
    </h1>

    <RegisterForm :form="form" @success="onSuccess" @error="onError" />
  </div>
</template>

<script setup lang="ts">
  import RegisterForm from '@/components/admin/auth/RegisterForm.vue';
  import { reactive, ref } from 'vue';
  import { useToast } from 'vue-toastification';

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

  const toast = useToast();

  // Listen to success
  function onSuccess(user: any) {
    toast.success(`${user.userName} সফলভাবে নিবন্ধিত হয়েছে!`);

    // Redirect to login
    setTimeout(() => {
      navigateTo('/admin/login');
    }, 1000);
  }

  // Listen to field errors
  function onError(errors: any) {
    console.log('নিবন্ধন ত্রুটি:', errors);
    // আপনি এখানে আরও কিছু করতে পারেন, যেমন একটি নোটিফিকেশন দেখানো
    // উদাহরণস্বরূপ:
    // if (errors.userName) {
    //   alert(errors.userName);
    // }
  }
</script>
