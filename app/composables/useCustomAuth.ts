import { useRouter } from 'vue-router';

export const useCustomAuth = () => {
  const router = useRouter();

  const logout = () => {
    // আপনার নিজের কাস্টম লগআউট লজিক
    router.push('/admin/login');
  };

  return { logout };
};
