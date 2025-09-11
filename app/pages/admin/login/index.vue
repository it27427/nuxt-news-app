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
  import { useToast } from 'vue-toastification';

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

  const toast = useToast();

  function onSuccess(data: any) {
    toast.success(data.message || 'সফলভাবে লগইন হয়েছে...');
    // `LoginForm.vue` ফাইল থেকে সরাসরি নেভিগেশন করা হয়, তাই এখানে কোনো রিডাইরেক্টের প্রয়োজন নেই।
    // শুধুমাত্র সফলতার বার্তাটি দেখানো হচ্ছে।
  }

  function onError(errors: any) {
    console.log('লগইন ত্রুটি:', errors);

    const errorMessage = errors.message || 'লগইন ব্যর্থ হয়েছে...';
    toast.error(errorMessage);

    if (errors.email) {
      toast.error(errors.email);
    }
  }
</script>
