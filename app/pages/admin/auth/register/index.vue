<template>
  <div>
    <RegisterForm />
  </div>
</template>

<script setup lang="ts">
  import RegisterForm from '@/components/admin/auth/RegisterForm.vue';
  definePageMeta({
    layout: 'authentication',
  });
</script>
