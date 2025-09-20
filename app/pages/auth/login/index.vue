<template>
  <section class="w-full max-w-md mx-auto">
    <div class="flex items-center justify-center w-32 h-25 mx-auto mb-4">
      <AuthLogo />
    </div>

    <h1 class="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-center">
      {{ formTitle }}
    </h1>

    <BaseForm @submit.prevent="handleLogin" class="animated-form">
      <BaseInput
        id="email"
        label="Email"
        placeholder="Enter your email"
        v-model="form.email"
        :error="errors.email"
        :validated="!!form.email && !errors.email"
        type="email"
      />

      <BaseInput
        id="password"
        label="Password"
        placeholder="Enter your password"
        v-model="form.password"
        :error="errors.password"
        :validated="!!form.password && !errors.password"
        type="password"
      />

      <BaseButton type="submit" :loading="loading" label="Login" />
    </BaseForm>

    <div class="flex items-center justify-center gap-2 mt-8">
      <p class="text-md text-dark dark:text-light">Don't have an account?</p>
      <client-only>
        <BaseLink
          to="/auth/register"
          class="text-md text-dark dark:text-white font-medium underline transition-colors hover:text-primary-dark dark:hover:text-primary"
        >
          Register
        </BaseLink>
      </client-only>
    </div>
  </section>
</template>

<script setup lang="ts">
  import AuthLogo from '@/components/admin/AuthLogo.vue';
  import BaseButton from '@/components/admin/common/BaseButton.vue';
  import BaseForm from '@/components/admin/common/BaseForm.vue';
  import BaseInput from '@/components/admin/common/BaseInput.vue';
  import BaseLink from '@/components/base/BaseLink.vue';
  import { reactive, ref } from 'vue';
  import { useRouter } from 'vue-router';
  import { useToast } from 'vue-toastification';

  definePageMeta({ layout: 'authentication' });

  const toast = useToast();
  const router = useRouter();
  const formTitle = ref('Login');

  interface LoginForm {
    email: string;
    password: string;
  }

  interface LoginFormErrors {
    email?: string;
    password?: string;
  }

  const form = reactive<LoginForm>({
    email: '',
    password: '',
  });

  const errors = reactive<LoginFormErrors>({
    email: undefined,
    password: undefined,
  });

  const loading = ref(false);

  async function handleLogin() {
    loading.value = true;

    // Reset errors
    Object.keys(errors).forEach(
      (key) => (errors[key as keyof LoginFormErrors] = undefined)
    );

    // FRONTEND VALIDATION
    let hasError = false;
    if (!form.email) {
      errors.email = 'Email is required';
      hasError = true;
    }
    if (!form.password) {
      errors.password = 'Password is required';
      hasError = true;
    }

    if (hasError) {
      loading.value = false;
      return;
    }

    try {
      const res = await $fetch<{
        success: boolean;
        token?: string;
        message?: string;
      }>('/api/auth/login', {
        method: 'POST',
        body: { ...form },
      });

      toast.success(res.message || 'Login successful!');

      // Reset form
      Object.keys(form).forEach((key) => (form[key as keyof LoginForm] = ''));

      // Redirect after success
      setTimeout(() => router.push('/admin/dashboard'), 1000);
    } catch (err: any) {
      // If API returns field errors
      if (err?.data?.fields) {
        Object.assign(errors, err.data.fields);

        // Show toast only if user doesn't exist
        if (
          err?.statusCode === 404 ||
          err?.data?.fields.email === "User doesn't exist!"
        ) {
          toast.error(
            err?.message ||
              "This user doesn't exist. Please register first then try again."
          );
        }
      } else {
        toast.error(err?.statusMessage || 'Something went wrong');
      }
    } finally {
      loading.value = false;
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
