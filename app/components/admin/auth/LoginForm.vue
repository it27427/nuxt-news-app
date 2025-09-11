<template>
  <BaseForm @submit="handleLogin">
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
  import BaseButton from '@/components/admin/common/BaseButton.vue';
  import BaseForm from '@/components/admin/common/BaseForm.vue';
  import BaseInput from '@/components/admin/common/BaseInput.vue';
  import { reactive, ref, watch } from 'vue';
  const { signIn } = useAuth();

  interface FormData {
    email: string;
    password: string;
  }

  interface FormErrors {
    email?: string;
    password?: string;
    message?: string;
  }

  // Props: parent can pass a form object
  const props = defineProps<{
    form?: FormData;
  }>();

  // Emits: parent can listen for 'success' or 'error'
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
      errors.password = 'পাসওয়ার্ড অবশ্যই বাধ্যতামূলক।';
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
        console.error('লগইন ত্রুটি:', response.error);
        const errorMessage =
          response.error === 'CredentialsSignin'
            ? 'ইমেল বা পাসওয়ার্ড বৈধ নয়!'
            : 'একটি অপ্রত্যাশিত ত্রুটি ঘটেছে!';
        emit('error', {
          message: errorMessage,
          email: errorMessage,
          password: errorMessage,
        });
      } else {
        emit('success', { message: 'সফলভাবে লগইন হয়েছে!' });
      }
    } catch (err) {
      console.error('লগইন ত্রুটি:', err);
      emit('error', { message: 'একটি অপ্রত্যাশিত ত্রুটি ঘটেছে!' });
    } finally {
      isLoading.value = false;
    }
  }
</script>
