<template>
  <div class="mt-10 w-full mx-auto md:w-36.5">
    <h1 class="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-center">
      “{{ formTitle }}”
    </h1>
    <LoginForm :form="form" @success="onSuccess" @error="onError" />
  </div>
</template>

<script setup lang="ts">
  import LoginForm from '@/components/admin/auth/LoginForm.vue';
  import { reactive, ref } from 'vue';
  definePageMeta({ layout: 'authentication' });

  const formTitle = ref('লগইন করুন');

  interface FormData {
    email: string;
    password: string;
  }

  const form = reactive<FormData>({
    email: '',
    password: '',
  });

  function onSuccess(data: any) {
    alert(`লগইন সফল!`);
    console.log(data.message);
  }

  function onError(errors: any) {
    console.log('লগইন ত্রুটি:', errors);
  }
</script>
