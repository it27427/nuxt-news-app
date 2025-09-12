import { DefaultJWT, DefaultSession } from '@sidebase/nuxt-auth';

declare module '@sidebase/nuxt-auth' {
  interface Session extends DefaultSession {
    user?: {
      id: string;
      email: string;
      admin: boolean;
    } & DefaultSession['user'];
  }

  interface JWT extends DefaultJWT {
    id: string;
    email: string;
    admin: boolean;
  }
}
