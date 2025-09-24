<template>
  <section class="w-full max-w-md mx-auto">
    <div class="flex items-center justify-center w-32 h-25 mx-auto mb-4">
      <AuthLogo />
    </div>

    <h1 class="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-center">
      {{ formTitle }}
    </h1>

    <BaseForm @submit="handleRegister" class="animated-form">
      <BaseInput
        id="name"
        label="Name"
        placeholder="Enter your name"
        v-model="form.name"
        :error="errors.name"
        :validated="!!form.name && !errors.name"
        type="text"
      />

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

      <BaseButton type="submit" :loading="loading" label="Register" />
    </BaseForm>

    <div class="flex items-center justify-center gap-2 mt-8">
      <p class="text-md text-dark dark:text-light">Already have an account?</p>
      <client-only>
        <BaseLink
          to="/auth/login"
          class="text-md text-dark dark:text-white font-medium underline transition-colors hover:text-primary-dark dark:hover:text-primary"
        >
          Login
        </BaseLink>
      </client-only>
    </div>
  </section>
</template>

<script setup lang="ts">
  import { reactive, ref } from 'vue';
  import { useRouter } from 'vue-router';
  import { useAuth } from '~/composables/useAuth';
  import type { RegisterForm, RegisterFormErrors } from '~~/types/auth';

  definePageMeta({ layout: 'authentication' });

  const toast = useToast();
  const router = useRouter();
  const formTitle = ref('Register');

  const { register, loading } = useAuth();

  const form = reactive<RegisterForm>({
    name: '',
    email: '',
    password: '',
  });

  const errors = reactive<RegisterFormErrors>({
    name: undefined,
    email: undefined,
    password: undefined,
  });

  async function handleRegister() {
    // Reset errors
    Object.keys(errors).forEach(
      (key) => (errors[key as keyof RegisterFormErrors] = undefined)
    );

    // FRONTEND VALIDATION
    let hasError = false;
    if (!form.name) {
      errors.name = 'Name is required';
      hasError = true;
    }
    if (!form.email) {
      errors.email = 'Email is required';
      hasError = true;
    }
    if (!form.password) {
      errors.password = 'Password is required';
      hasError = true;
    }

    if (hasError) {
      return;
    }

    try {
      const res = await register(form);

      toast.success(res.message);

      // Reset form
      Object.keys(form).forEach(
        (key) => (form[key as keyof RegisterForm] = '')
      );

      setTimeout(() => router.push('/auth/login'), 1500);
    } catch (err: any) {
      if (err?.data?.fields) {
        Object.assign(errors, err.data.fields);
      } else {
        toast.error(err?.statusMessage || 'Something went wrong');
      }
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
