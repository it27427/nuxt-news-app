<template>
  <BaseForm title="Login" submitText="Login" @submit="handleLogin">
    <BaseInput
      id="email"
      label="Email"
      type="email"
      placeholder="Enter your email"
      v-model="form.email"
      :error="errors.email"
    />

    <BaseInput
      id="password"
      label="Password"
      type="password"
      placeholder="Enter your password"
      v-model="form.password"
      :error="errors.password"
    />
  </BaseForm>
</template>

<script setup lang="ts">
  import BaseForm from '@/components/admin/common/BaseForm.vue';
  import BaseInput from '@/components/admin/common/BaseInput.vue';

  const form = reactive({
    email: '',
    password: '',
  });

  const errors = reactive({
    email: '',
    password: '',
  });

  function handleLogin() {
    errors.email = !form.email ? 'Email is required' : '';
    errors.password = !form.password ? 'Password is required' : '';

    if (!errors.email && !errors.password) {
      console.log('Login Submitted:', form);
      // Call API here
    }
  }
</script>
