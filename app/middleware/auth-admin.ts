import { getServerSession } from '#auth';

export default defineNuxtRouteMiddleware(async (to: any, event: any) => {
  if (!to.path.startsWith('/admin')) return;

  try {
    const session = await getServerSession(event);

    const isAdmin = (session?.user as { admin?: boolean } | undefined)?.admin;

    if (!isAdmin) {
      return navigateTo('/admin/login');
    }
  } catch (err) {
    return navigateTo('/admin/login');
  }
});
