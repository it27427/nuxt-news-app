import { getServerSession } from '#auth';
import { navigateTo } from '#imports';

export default defineNuxtRouteMiddleware(async (to) => {
  if (to.path.startsWith('/admin')) {
    const event = useRequestEvent();
    if (!event) throw new Error('No request event available');

    const session = await getServerSession(event);

    if (!session) {
      return navigateTo('/admin/login');
    }
  }
});
