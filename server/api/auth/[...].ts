import { NuxtAuthHandler } from '#auth';
import bcrypt from 'bcryptjs';
import * as CredentialsProvider from 'next-auth/providers/credentials';
import { User } from '~~/server/models/User';

export default NuxtAuthHandler({
  secret: useRuntimeConfig().authSecret,

  pages: {
    signIn: '/admin/login',
  },

  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {},
      async authorize(credentials: any) {
        if (!credentials?.email || !credentials?.password) return null;

        const user = await User.findOne({ email: credentials.email });
        if (!user) return null;

        const valid = await bcrypt.compare(credentials.password, user.password);
        if (!valid) return null;

        return {
          id: user._id.toString(),
          email: user.email,
          userName: user.userName,
        };
      },
    }),
  ],

  session: {
    strategy: 'jwt',
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.userName = user.userName;
      }
      return token;
    },
    async session({ session, token }) {
      session.user = {
        id: token.id as string,
        email: token.email as string,
        userName: token.userName as string,
      };
      return session;
    },
  },
});
