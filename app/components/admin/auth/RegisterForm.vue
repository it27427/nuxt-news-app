<template>
  <BaseForm @submit="handleRegister" class="animated-form">
    <!-- User Name -->
    <BaseInput
      id="userName"
      label="User Name"
      type="text"
      placeholder="Enter your user name"
      v-model="localForm.userName"
      :error="errors.userName"
      :validated="validatedFields.userName"
      @update:modelValue="() => handleValidate('userName')"
    />

    <!-- Email -->
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

    <!-- Password -->
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
  import { validateField } from '@/utils/fieldValidator';
  import type { RegFormData, RegFormErrors } from '@/utils/types';
  import { reactive, ref } from 'vue';
  import { useRouter } from 'vue-router';
  import { useToast } from 'vue-toastification';

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
    userName: undefined,
    email: undefined,
    password: undefined,
  });

  const validatedFields = reactive({
    userName: false,
    email: false,
    password: false,
  });

  const isLoading = ref(false);
  const toast = useToast();
  const router = useRouter();

  // Single field validation
  function handleValidate(field: keyof RegFormData) {
    const value = localForm[field];
    const error = validateField(field, value);
    errors[field] = error || undefined;
    validatedFields[field] = !error;
  }

  // Full form validation before submit
  function validateForm() {
    (Object.keys(localForm) as (keyof RegFormData)[]).forEach(handleValidate);
    return Object.values(errors).every((err) => !err);
  }

  // Correct API response typing
  interface RegisterApiResponse {
    success: boolean;
    message?: string;
    data?:
      | {
          user?: { id: string; userName: string; email: string };
          [key: string]: any;
        }
      | RegFormErrors;
  }

  // Submit handler
  async function handleRegister() {
    if (!validateForm()) {
      emit('error', errors);
      return;
    }

    try {
      isLoading.value = true;

      const response = await $fetch<RegisterApiResponse>('/api/auth/register', {
        method: 'POST',
        body: { ...localForm },
      });

      // Handle validation errors
      if (response?.success === false && response.data) {
        Object.assign(errors, response.data as RegFormErrors);
        Object.keys(validatedFields).forEach((key) => {
          validatedFields[key as keyof typeof validatedFields] = !(
            response.data as RegFormErrors
          )[key as keyof RegFormErrors];
        });
        emit('error', response.data as RegFormErrors);
        return;
      }

      // Handle success
      if (
        response?.success &&
        response.data &&
        'user' in response.data &&
        response.data.user
      ) {
        emit('success', {
          user: response.data.user,
          message: response.message,
        });

        // Reset form fields
        Object.keys(localForm).forEach(
          (key) => (localForm[key as keyof RegFormData] = '')
        );
        Object.keys(validatedFields).forEach(
          (key) =>
            (validatedFields[key as keyof typeof validatedFields] = false)
        );

        // Redirect after 1 second
        setTimeout(() => {
          router.push('/admin/login');
        }, 1000);
      }
    } catch (err: any) {
      console.error('API error:', err);
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
