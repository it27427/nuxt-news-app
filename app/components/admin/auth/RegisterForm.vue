<template>
  <BaseForm title="Register" submitText="Register" @submit="handleRegister">
    <BaseInput
      id="name"
      label="Full Name"
      type="text"
      placeholder="Enter your full name"
      v-model="form.name"
      :error="errors.name"
    />

    <BaseInput
      id="email"
      label="Email Address"
      type="email"
      placeholder="Enter your email address"
      v-model="form.email"
      :error="errors.email"
    />

    <BaseInput
      id="phone"
      label="Phone Number"
      type="tel"
      placeholder="Enter your phone number"
      v-model="form.phone"
      :error="errors.phone"
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
    name: '',
    email: '',
    phone: '',
    password: '',
  });

  const errors = reactive({
    name: '',
    email: '',
    phone: '',
    password: '',
  });

  function handleRegister() {
    errors.name = !form.name ? 'Name is required' : '';
    errors.email = !form.email ? 'Email is required' : '';
    errors.phone = !form.phone ? 'Phone number is required' : '';
    errors.password = !form.password ? 'Password is required' : '';

    if (!errors.email && !errors.password) {
      console.log('Login Submitted:', form);
      // Call API here
    }
  }
</script>
