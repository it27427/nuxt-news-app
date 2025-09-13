import { DefaultSession, DefaultUser } from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      email: string;
      admin: boolean;
    } & DefaultSession['user'];
  }

  interface User extends DefaultUser {
    id: string;
    admin: boolean;
  }

  interface JWT {
    id: string;
    email: string;
    admin: boolean;
  }
}
