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
        type="text"
      />

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
  const formTitle = ref('Register');

  interface RegisterForm {
    name: string;
    email: string;
    password: string;
  }

  interface RegisterFormErrors {
    name?: string;
    email?: string;
    password?: string;
  }

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

  const loading = ref(false);

  async function handleRegister() {
    loading.value = true;
    errors.name = '';
    errors.email = '';
    errors.password = '';

    try {
      const res = await $fetch<{ success: boolean; message: string }>(
        '/api/auth/register',
        {
          method: 'POST',
          body: { ...form },
        }
      );

      toast.success(res.message);

      // Reset form
      form.name = '';
      form.email = '';
      form.password = '';

      setTimeout(() => {
        router.push('/auth/login');
      }, 1000);
    } catch (err: any) {
      if (err?.data?.field) {
        Object.assign(errors, err.data.field);
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
