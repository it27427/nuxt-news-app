import { DefaultSession, DefaultUser } from 'next-auth';

declare module 'next-auth' {
  interface User extends DefaultUser {
    id: string;
    email: string;
    userName: string;
  }

  interface Session {
    user: {
      id: string;
      email: string;
      userName: string;
    } & DefaultSession['user'];
  }

  interface JWT {
    id: string;
    email: string;
    userName: string;
  }
}
