<template>
  <section class="w-full max-w-md mx-auto">
    <div class="flex items-center justify-center w-32 h-25 mx-auto mb-4">
      <AuthLogo />
    </div>

    <h1 class="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-center">
      {{ formTitle }}
    </h1>

    <BaseForm @submit="handleLogin" class="animated-form">
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

  interface LoginResponse {
    success: boolean;
    token?: string;
    message?: string;
  }

  const form = reactive<LoginForm>({
    email: '',
    password: '',
  });

  const errors = reactive<LoginFormErrors>({});
  const loading = ref(false);

  async function handleLogin() {
    loading.value = true;

    // Reset errors
    Object.keys(errors).forEach(
      (key) => (errors[key as keyof LoginFormErrors] = undefined)
    );

    // Frontend validation
    if (!form.email) errors.email = 'Email is required';
    if (!form.password) errors.password = 'Password is required';
    if (errors.email || errors.password) {
      loading.value = false;
      return;
    }

    try {
      const res = await $fetch<LoginResponse>('/api/auth/login', {
        method: 'POST',
        body: form,
      });

      toast.success(res.message || 'Login successful!');

      if (res.token) localStorage.setItem('token', res.token);

      // Reset form
      Object.keys(form).forEach((key) => (form[key as keyof LoginForm] = ''));

      // Redirect to dashboard
      router.push('/admin/dashboard');
    } catch (err: any) {
      if (err?.data?.fields) Object.assign(errors, err.data.fields);
      toast.error(err?.message || 'Something went wrong');
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
