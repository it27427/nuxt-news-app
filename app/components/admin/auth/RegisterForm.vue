<template>
  <BaseForm @submit.prevent="handleRegister">
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
    userName: string;
    email: string;
    password: string;
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

  // Keep parent form reactive if passed
  if (props.form) {
    watch(localForm, () => {
      if (props.form) Object.assign(props.form, localForm);
    });
  }

  async function handleRegister() {
    try {
      isLoading.value = true;

      // Clear previous errors
      Object.keys(errors).forEach((key) => {
        errors[key as keyof FormErrors] = '';
      });

      // API call
      const { data, error } = await useFetch<{
        success: boolean;
        user?: { id: string; userName: string; email: string };
        data?: FormErrors;
      }>('/api/auth/register', {
        method: 'POST',
        body: { ...localForm },
        default: () => ({ success: false }),
      });

      if (error.value) {
        console.error('API error:', error.value);
        emit('error', { ...errors });
        return;
      }

      // Backend field validation errors
      if (data.value?.success === false && data.value.data) {
        Object.assign(errors, data.value.data);
        emit('error', data.value.data);
        return;
      }

      // Success
      if (data.value?.success && data.value.user) {
        emit('success', data.value.user);

        // Reset form
        Object.keys(localForm).forEach((key) => {
          localForm[key as keyof FormData] = '';
        });
      }
    } catch (err) {
      console.error(err);
      emit('error', { ...errors });
    } finally {
      isLoading.value = false;
    }
  }
</script>
