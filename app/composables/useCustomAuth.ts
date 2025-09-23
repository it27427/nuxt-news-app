// composables/useCustomAuth.ts

export const useCustomAuth = () => {
  const router = useRouter();

  // User state ধরলাম (mock, আসল প্রজেক্টে API থেকে আসবে)
  const user = ref<{ role: string } | null>({
    role: 'super_admin', // default role, auth login হলে set হবে
  });

  const logout = () => {
    // custom logout logic
    user.value = null;
    router.push('/admin/login');
  };

  return { logout, user };
};
