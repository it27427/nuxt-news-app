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
        type="email"
      />

      <BaseInput
        id="password"
        label="Password"
        placeholder="Enter your password"
        v-model="form.password"
        :error="errors.password"
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
  import { reactive, ref } from 'vue';
  import { useRouter } from 'vue-router';
  import { useAuth } from '~/composables/useAuth';
  import type { LoginForm, LoginFormErrors } from '~~/types/auth';

  definePageMeta({ layout: 'authentication' });

  const toast = useToast();
  const formTitle = ref('Login');

  const form = reactive<LoginForm>({ email: '', password: '' });
  const errors = reactive<LoginFormErrors>({});

  const router = useRouter();
  const { login, loading } = useAuth();

  async function handleLogin() {
    Object.keys(errors).forEach(
      (key) => (errors[key as keyof LoginFormErrors] = undefined)
    );

    if (!form.email) {
      errors.email = 'Email is required';
    }
    if (!form.password) {
      errors.password = 'Password is required';
    }

    if (errors.email || errors.password) {
      return;
    }

    try {
      await login(form);
      toast.success('Login successful!');
      setTimeout(() => {
        router.push('/admin/dashboard');
      }, 1000);
    } catch (err: any) {
      toast.error(err.message || 'An unexpected error occurred.');
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
