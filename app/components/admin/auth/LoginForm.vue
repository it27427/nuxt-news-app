<template>
  <BaseForm @submit="handleLogin" class="animated-form">
    <BaseInput
      id="email"
      label="Email Address"
      type="email"
      placeholder="Enter your email address"
      v-model="localForm.email"
      :error="errors.email"
      :validated="validatedFields.email"
      @update:modelValue="() => handleValidate('email')"
    />

    <BaseInput
      id="password"
      label="Password"
      type="password"
      placeholder="Enter your password"
      v-model="localForm.password"
      :error="errors.password"
      :validated="validatedFields.password"
      @update:modelValue="() => handleValidate('password')"
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
  import { navigateTo, useAuth } from '#imports';
  import BaseButton from '@/components/admin/common/BaseButton.vue';
  import BaseForm from '@/components/admin/common/BaseForm.vue';
  import BaseInput from '@/components/admin/common/BaseInput.vue';
  import { validateField } from '@/utils/fieldValidator';
  import { validateMessages } from '@/utils/messages';
  import type { LoginFormData, LoginFormErrors } from '@/utils/types';
  import { reactive, ref } from 'vue';
  import { useToast } from 'vue-toastification';

  const localForm = reactive<LoginFormData>({
    email: '',
    password: '',
  });

  const errors = reactive<LoginFormErrors>({
    email: undefined,
    password: undefined,
  });

  const validatedFields = reactive({
    email: false,
    password: false,
  });

  const isLoading = ref(false);
  const toast = useToast();

  function handleValidate(field: keyof LoginFormData) {
    const value = localForm[field];
    const error = validateField(field, value);
    errors[field] = error || undefined;
    validatedFields[field] = !error;
  }

  function validateForm() {
    (Object.keys(localForm) as (keyof LoginFormData)[]).forEach(handleValidate);
    return Object.values(errors).every((err) => !err);
  }

  const { signIn } = useAuth();

  async function handleLogin() {
    if (!validateForm()) return toast.error('ইমেল এবং পাসওয়ার্ড যাচাই করুন।');

    isLoading.value = true;

    try {
      const result = await signIn('credentials', {
        email: localForm.email,
        password: localForm.password,
        redirect: false,
      });

      if (result?.error) {
        let msg = 'ইমেল বা পাসওয়ার্ড ভুল হয়েছে।';
        toast.error(msg);
      } else {
        toast.success(validateMessages.loginSuccess);

        navigateTo('/admin/dashboard');
      }
    } catch (err) {
      console.error('Login error:', err);
      toast.error(validateMessages.server);
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
