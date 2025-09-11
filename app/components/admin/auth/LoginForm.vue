<template>
  <BaseForm @submit="handleLogin">
    <BaseInputid
      id="email"
      label="Email Address"
      type="email"
      placeholder="Enter your email address"
      v-model="localForm.email"
      :error="errors.email"
    />

    <BaseInputid
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
  import BaseButton from '@/components/admin/common/BaseButton.vue';
  import BaseForm from '@/components/admin/common/BaseForm.vue';
  import { reactive, ref, watch } from 'vue';
  const { signIn } = useAuth();

  interface FormData {
    email: string;
    password: string;
  }

  interface FormErrors {
    email?: string;
    password?: string;
  } // Props: parent can pass a form object

  const props = defineProps<{
    form?: FormData;
  }>(); // Emits: parent can listen for 'success' or 'error'

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
      errors.email = 'Email is required.';
      hasError = true;
    }

    if (!localForm.password) {
      errors.password = 'Password is required.';
      hasError = true;
    }

    return !hasError;
  }

  async function handleLogin() {
    if (!validateForm()) {
      emit('error', errors);
      return;
    }

    isLoading.value = true;
    try {
      const response = await signIn('credentials', {
        email: localForm.email,
        password: localForm.password,
        redirect: false,
      });

      if (response?.error) {
        console.error('Login error:', response.error);
        errors.email = 'Invalid email or password.';
        errors.password = 'Invalid email or password.';
        emit('error', errors);
      } else {
        emit('success', { message: 'Login successful!' }); // Navigate to the dashboard or home page
        navigateTo('/admin/dashboard');
      }
    } catch (err) {
      console.error('Login failed:', err);
      emit('error', { password: 'An unexpected error occurred.' });
    } finally {
      isLoading.value = false;
    }
  }
</script>
