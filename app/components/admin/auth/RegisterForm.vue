<template>
  <div>
    <BaseForm title="Register" submitText="Register" @submit="handleRegister">
      <div class="grid grid-cols-2 gap-4">
        <BaseInput
          id="firstName"
          label="First Name"
          type="text"
          placeholder="Enter your first name"
          v-model="form.firstName"
          :error="errors.firstName"
        />

        <BaseInput
          id="lastName"
          label="Last Name"
          type="text"
          placeholder="Enter your last name"
          v-model="form.lastName"
          :error="errors.lastName"
        />
      </div>

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

      <BaseInput
        id="confirmPassword"
        label="Confirm Password"
        type="password"
        placeholder="Confirm your password"
        v-model="form.confirmPassword"
        :error="errors.confirmPassword"
      />

      <BaseButton label="Register" type="submit" variant="primary" />
    </BaseForm>
  </div>
</template>

<script setup lang="ts">
  import BaseForm from '@/components/admin/common/BaseForm.vue';
  import BaseInput from '@/components/admin/common/BaseInput.vue';

  const form = reactive({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });

  const errors = reactive({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });

  function handleRegister() {
    // Simple validation
    errors.firstName = !form.firstName ? 'First name is required' : '';
    errors.lastName = !form.lastName ? 'Last name is required' : '';
    errors.email = !form.email ? 'Email is required' : '';
    errors.password = !form.password ? 'Password is required' : '';
    errors.confirmPassword =
      form.confirmPassword !== form.password ? 'Passwords do not match' : '';

    // Only submit if no errors
    if (
      !errors.firstName &&
      !errors.lastName &&
      !errors.email &&
      !errors.password &&
      !errors.confirmPassword
    ) {
      const fullName = `${form.firstName} ${form.lastName}`.trim();

      const payload = {
        fullName,
        email: form.email,
        password: form.password,
      };

      console.log('Register Submitted:', payload);
      // 👉 Here you can call your API (Prisma / Supabase / REST) to store in DB
    }
  }
</script>
