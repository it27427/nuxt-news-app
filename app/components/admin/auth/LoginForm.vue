<template>
  <BaseForm @submit="handleLogin" class="animated-form">
    <BaseInput
      id="email"
      label="Email Address"
      type="email"
      placeholder="Enter your email address"
      v-model="localForm.email"
      :error="errors.email"
    />

    <BaseInput
      id="password"
      label="Password"
      type="password"
      placeholder="Enter your password"
      v-model="localForm.password"
      :error="errors.password"
    />

    <div class="mb-2"></div>

    <BaseButton
      type="submit"
      label="লগইন করুন"
      variant="primary"
      :loading="isLoading"
    />
  </BaseForm>
</template>

<script setup lang="ts">
  import { useAuth, useRuntimeConfig } from '#imports';
  import { reactive, ref, watch } from 'vue';
  import { useToast } from 'vue-toastification';

  import { navigateTo } from '#app';
  import BaseButton from '@/components/admin/common/BaseButton.vue';
  import BaseForm from '@/components/admin/common/BaseForm.vue';
  import BaseInput from '@/components/admin/common/BaseInput.vue';

  const config = useRuntimeConfig();
  const toast = useToast();

  interface FormData {
    email: string;
    password: string;
  }

  interface FormErrors {
    email?: string;
    password?: string;
    message?: string;
  }

  const props = defineProps<{
    form?: FormData;
  }>();

  const emit = defineEmits<{
    (e: 'success', data: any): void;
    (e: 'error', errors: FormErrors): void;
  }>();

  const localForm = reactive<FormData>({
    email: props.form?.email || '',
    password: props.form?.password || '',
  });

  const errors = reactive<FormErrors>({
    email: '',
    password: '',
  });

  const isLoading = ref(false);

  if (props.form) {
    watch(localForm, () => {
      if (props.form) Object.assign(props.form, localForm);
    });
  }

  function validateForm() {
    Object.keys(errors).forEach((key) => {
      errors[key as keyof FormErrors] = '';
    });

    let hasError = false;

    if (!localForm.email) {
      errors.email = 'ইমেইল অবশ্যই বাধ্যতামূলক।';
      hasError = true;
    }

    if (!localForm.password) {
      errors.password = 'পাসওয়ার্ড অবশ্যই বাধ্যতামূলক।';
      hasError = true;
    }

    return !hasError;
  }

  const { signIn } = useAuth();

  async function handleLogin() {
    if (!validateForm()) {
      emit('error', errors);
      return;
    }

    isLoading.value = true;

    try {
      // redirect false => manual redirect + toast
      const result = await signIn('credentials', {
        email: localForm.email,
        password: localForm.password,
        redirect: false,
        callbackUrl: '/admin/dashboard',
        baseURL: config.public.authBaseURL,
      });

      if (result?.error) {
        toast.error('ইমেল বা পাসওয়ার্ড বৈধ নয়।');
        emit('error', { message: result.error });
      } else {
        toast.success('সফলভাবে লগইন হয়েছে...');
        emit('success', { message: 'সফলভাবে লগইন হয়েছে...' });

        // redirect manually
        await navigateTo('/admin/dashboard');
      }
    } catch (error: any) {
      console.error('লগইন ত্রুটি (catch):', error);
      toast.error('লগইন ব্যর্থ হয়েছে। সার্ভার ত্রুটি।');
      emit('error', { message: 'লগইন ব্যর্থ হয়েছে। সার্ভার ত্রুটি।' });
    } finally {
      isLoading.value = false;
    }
  }
</script>

<style scoped lang="scss">
  .animated-form {
    animation: fadeInFromTop 0.8s ease-out;
  }

  @keyframes fadeInFromTop {
    from {
      opacity: 0;
      transform: translateY(-20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
</style>
