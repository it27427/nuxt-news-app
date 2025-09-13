<template>
  <BaseForm @submit="handleRegister" class="animated-form">
    <BaseInput
      id="userName"
      label="User Name"
      type="text"
      placeholder="Enter your user name"
      v-model="localForm.userName"
      :error="errors.userName"
      :validated="validatedFields.userName"
    />

    <BaseInput
      id="email"
      label="Email Address"
      type="email"
      placeholder="Enter your email address"
      v-model="localForm.email"
      :error="errors.email"
      :validated="validatedFields.email"
    />

    <BaseInput
      id="password"
      label="Password"
      type="password"
      placeholder="Enter your password"
      v-model="localForm.password"
      :error="errors.password"
      :validated="validatedFields.password"
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
  import { errorMessages } from '@/utils/messages';
  import { emailRegex } from '@/utils/validators';
  import { reactive, ref, watch } from 'vue';

  import type { ApiResponse, RegFormData, RegFormErrors } from '@/utils/types';

  const props = defineProps<{ form?: RegFormData }>();
  const emit = defineEmits<{
    (e: 'success', data: any): void;
    (e: 'error', errors: RegFormErrors): void;
  }>();

  const localForm = reactive<RegFormData>({
    userName: props.form?.userName || '',
    email: props.form?.email || '',
    password: props.form?.password || '',
  });

  const errors = reactive<RegFormErrors>({
    userName: '',
    email: '',
    password: '',
  });

  const validatedFields = reactive({
    userName: false,
    email: false,
    password: false,
  });

  const isLoading = ref(false);

  if (props.form) {
    watch(localForm, () => {
      if (props.form) Object.assign(props.form, localForm);
    });
  }

  // FORM VALIDATION USING CENTRALIZED MESSAGES
  function validateForm() {
    Object.keys(errors).forEach((key) => {
      errors[key as keyof RegFormErrors] = '';
    });

    let hasError = false;

    if (!localForm.userName) {
      errors.userName = errorMessages.userName.required;
      hasError = true;
    } else if (localForm.userName.length < 3) {
      errors.userName = errorMessages.userName.minLength;
      hasError = true;
    }

    if (!localForm.email) {
      errors.email = errorMessages.email.required;
      hasError = true;
    } else if (!emailRegex.test(localForm.email)) {
      errors.email = errorMessages.email.invalid;
      hasError = true;
    }

    if (!localForm.password) {
      errors.password = errorMessages.password.required;
      hasError = true;
    } else if (localForm.password.length < 8) {
      errors.password = errorMessages.password.minLength;
      hasError = true;
    }

    Object.keys(validatedFields).forEach((key) => {
      validatedFields[key as keyof typeof validatedFields] =
        !errors[key as keyof RegFormErrors] &&
        localForm[key as keyof RegFormData].length > 0;
    });

    return !hasError;
  }

  // HANDLE REGISTER
  async function handleRegister() {
    if (!validateForm()) {
      emit('error', errors);
      return;
    }

    try {
      isLoading.value = true;

      const response = await $fetch<ApiResponse<RegFormErrors>>(
        '/api/auth/register',
        {
          method: 'POST',
          body: { ...localForm },
        }
      );

      if (response?.success === false && response.data) {
        Object.assign(errors, response.data);
        Object.keys(validatedFields).forEach((key) => {
          validatedFields[key as keyof typeof validatedFields] = !(
            response.data && response.data[key as keyof RegFormErrors]
          );
        });
        emit('error', response.data);
        return;
      }

      if (response?.success && response.user) {
        emit('success', response.user);
        Object.keys(localForm).forEach((key) => {
          localForm[key as keyof RegFormData] = '';
        });
        Object.keys(validatedFields).forEach((key) => {
          validatedFields[key as keyof typeof validatedFields] = false;
        });
      }
    } catch (err: any) {
      console.error('API error:', err);

      if (err?.data?.data) {
        Object.assign(errors, err.data.data);
        Object.keys(validatedFields).forEach((key) => {
          validatedFields[key as keyof typeof validatedFields] = !(
            err.data.data && err.data.data[key as keyof RegFormErrors]
          );
        });
      } else {
        errors.userName = err.data?.message || errorMessages.server;
      }

      emit('error', errors);
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
