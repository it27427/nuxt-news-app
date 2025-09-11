<template>
  <BaseForm @submit="handleRegister">
    <BaseInput
      id="userName"
      label="User Name"
      type="text"
      placeholder="Enter your user name"
      v-model="localForm.userName"
      :error="errors.userName"
    />

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
      label="নিবন্ধন করুন"
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

  interface FormData {
    userName: string;
    email: string;
    password: string;
  }

  interface FormErrors {
    userName?: string;
    email?: string;
    password?: string;
  }

  const props = defineProps<{
    form?: FormData;
  }>();

  const emit = defineEmits<{
    (e: 'success', data: any): void;
    (e: 'error', errors: FormErrors): void;
  }>();

  const localForm = reactive<FormData>({
    userName: props.form?.userName || '',
    email: props.form?.email || '',
    password: props.form?.password || '',
  });

  const errors = reactive<FormErrors>({
    userName: '',
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

    if (!localForm.userName) {
      errors.userName = 'ব্যবহারকারীর নাম অবশ্যই বাধ্যতামূলক।';
      hasError = true;
    } else if (localForm.userName.length < 3) {
      errors.userName = 'ব্যবহারকারীর নাম অবশ্যই ৩ অক্ষরের বেশী হতে হবে।';
      hasError = true;
    }

    if (!localForm.email) {
      errors.email = 'ইমেইল অবশ্যই বাধ্যতামূলক।';
      hasError = true;
    } else if (!/^\S+@\S+\.\S+$/.test(localForm.email)) {
      errors.email = 'ইমেলটি বৈধ নয়!';
      hasError = true;
    }

    if (!localForm.password) {
      errors.password = 'পাসওয়ার্ড অবশ্যই বাধ্যতামূলক।';
      hasError = true;
    } else if (localForm.password.length < 8) {
      errors.password = 'পাসওয়ার্ড অবশ্যই ৮ অক্ষরের অধিক হতে হবে।';
      hasError = true;
    }

    return !hasError;
  }

  async function handleRegister() {
    if (!validateForm()) {
      emit('error', errors);
      return;
    }

    try {
      isLoading.value = true;
      const response = await $fetch<{
        success: boolean;
        user?: { id: string; userName: string; email: string };
        data?: FormErrors;
      }>('/api/auth/register', {
        method: 'POST',
        body: { ...localForm },
      });

      if (response?.success === false && response.data) {
        Object.assign(errors, response.data);
        emit('error', response.data);
        return;
      }

      if (response?.success && response.user) {
        emit('success', response.user);
        Object.keys(localForm).forEach((key) => {
          localForm[key as keyof FormData] = '';
        });
      }
    } catch (err: any) {
      console.error('API error:', err);
      if (err.data?.data) {
        Object.assign(errors, err.data.data);
      }
      emit('error', errors);
    } finally {
      isLoading.value = false;
    }
  }
</script>
