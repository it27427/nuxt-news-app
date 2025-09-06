<template>
  <div>
    <LoginForm />
  </div>
</template>

<script setup lang="ts">
  import LoginForm from '@/components/admin/auth/LoginForm.vue';
  definePageMeta({
    layout: 'authentication',
  });
</script>
