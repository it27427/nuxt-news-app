import { NuxtAuthHandler } from '#auth';
import { compare } from 'bcrypt';
import CredentialsProvider from 'next-auth/providers/credentials';
import { connectToDatabase } from '~~/server/utils/mongo';

export default NuxtAuthHandler({
  secret: useRuntimeConfig().authSecret,
  providers: [
    //@ts-expect-error
    CredentialsProvider.default({
      name: 'credentials',
      credentials: {},
      async authorize(credentials: { username: string; password: string }) {
        // TODO: Fetch User From Database
        const db = await connectToDatabase();
        const user = await db.collection('users').findOne({
          username: credentials.username,
          role: 'admin',
        });

        if (!user) return null;
        const isValid = await compare(credentials.password, user.password);
        if (!isValid) return null;

        return {
          id: user._id.toString(),
          username: user.username,
          role: user.role,
        };
      },
    }),
  ],

  session: {
    strategy: 'jwt',
  },

  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
        token = {
          ...token,
          ...user,
        };
      }

      return token;
    },

    async session({ session, token }) {
      session.user = {
        ...token,
        ...session.user,
      };

      return session;
    },
  },

  pages: {
    signIn: '/admin/login',
  },
});
