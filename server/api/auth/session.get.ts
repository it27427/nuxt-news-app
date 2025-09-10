import { getServerSession } from '#auth';

export default defineEventHandler(async (event) => {
  try {
    const session = await getServerSession(event);
    return {
      user: session?.user || null,
    };
  } catch (err) {
    return {
      user: null,
    };
  }
});
