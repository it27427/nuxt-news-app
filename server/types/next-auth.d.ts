import 'next-auth';

declare module 'next-auth' {
  interface Session {
    admin?: {
      id: string;
      email: string;
      userName: string;
    };
  }

  interface JWT {
    admin?: {
      id: string;
      email: string;
      userName: string;
    };
  }

  interface User {
    userName?: string;
  }
}
