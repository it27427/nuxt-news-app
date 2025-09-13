<template>
  <BaseForm @submit="handleLogin" class="animated-form">
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
      label="লগইন করুন"
      variant="primary"
      :loading="isLoading"
    />
  </BaseForm>
</template>

<script setup lang="ts">
  import { navigateTo } from '#app';
  import { useAuth } from '#imports';
  import BaseButton from '@/components/admin/common/BaseButton.vue';
  import BaseForm from '@/components/admin/common/BaseForm.vue';
  import BaseInput from '@/components/admin/common/BaseInput.vue';
  import { validateField } from '@/utils/fieldValidator';
  import { validateMessages } from '@/utils/messages';
  import type { LoginFormData, LoginFormErrors } from '@/utils/types';
  import { reactive, ref, watch } from 'vue';
  import { useToast } from 'vue-toastification';

  const props = defineProps<{ form?: LoginFormData }>();
  const emit = defineEmits<{
    (e: 'success', data: any): void;
    (e: 'error', errors: LoginFormErrors): void;
  }>();

  // Reactive local form
  const localForm = reactive<LoginFormData>({
    email: props.form?.email || '',
    password: props.form?.password || '',
  });

  // Reactive errors and validated fields
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

  // Sync props.form with localForm safely
  if (props.form) {
    watch(localForm, () => {
      Object.assign(props.form!, localForm); // Non-null assertion
    });
  }

  // Single field validation
  function handleValidate(field: keyof LoginFormData) {
    const value = localForm[field];
    const error = validateField(field, value);
    errors[field] = error || undefined;
    validatedFields[field] = !error;
  }

  // Full form validation
  function validateForm() {
    (Object.keys(localForm) as (keyof LoginFormData)[]).forEach(handleValidate);
    return Object.values(errors).every((err) => !err);
  }

  const { signIn } = useAuth();

  // Submit handler
  async function handleLogin() {
    if (!validateForm()) {
      emit('error', errors);
      return;
    }

    isLoading.value = true;

    try {
      const result = await signIn('credentials', {
        email: localForm.email,
        password: localForm.password,
        redirect: false,
      });

      if (result?.error) {
        const msg = result.error || validateMessages.loginFailed;
        toast.error(msg);
        emit('error', { message: msg });
      } else {
        toast.success(validateMessages.loginSuccess);
        emit('success', { message: validateMessages.loginSuccess });
        await navigateTo('/admin/dashboard');
      }
    } catch (err: any) {
      console.error('Login error:', err);
      const msg = validateMessages.server;
      toast.error(msg);
      emit('error', { message: msg });
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
