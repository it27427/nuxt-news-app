export default defineNuxtRouteMiddleware(async (to) => {
  if (!to.path.startsWith('/admin')) return;

  const { data: session, error } = await useFetch('/api/auth/session');

  const isAdmin = (session.value?.user as { admin?: boolean } | undefined)
    ?.admin;

  if (error.value || !isAdmin) {
    return navigateTo('/admin/login');
  }
});
