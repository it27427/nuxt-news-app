import { getServerSession } from '#auth';
import { sendRedirect } from 'h3';

export default defineEventHandler(async (event) => {
  const url = event.node.req.url || '';
  if (!url.startsWith('/admin')) return;
  if (url === '/admin/login') return;

  const session = await getServerSession(event);
  const user = session?.user as { role?: string } | undefined;

  if (!user || user.role !== 'admin') {
    return sendRedirect(event, '/admin/login');
  }
});
