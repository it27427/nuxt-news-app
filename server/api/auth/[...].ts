import { NuxtAuthHandler } from '#auth';
import { compare } from 'bcryptjs';
import CredentialsProviderCJS from 'next-auth/providers/credentials';
import { db } from '~~/server/db/db';

const CredentialsProvider =
  (CredentialsProviderCJS as any).default || CredentialsProviderCJS;

export default NuxtAuthHandler({
  secret: useRuntimeConfig().auth.secret,
  pages: {
    signIn: '/admin/login',
  },
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials: any) {
        if (!credentials?.email || !credentials?.password) return null;

        const usersCollection = await db.user();
        const user = await usersCollection.findOne({
          email: credentials.email,
        });
        if (!user) return null;

        const isValid = await compare(credentials.password, user.password);
        if (!isValid) return null;

        return {
          id: user._id.toString(),
          email: user.email,
          admin: user.admin || false,
        };
      },
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async session({ session, token }) {
      return {
        ...session,
        user: {
          email: session.user?.email,
          admin: token.admin || false,
        },
      };
    },
    async jwt({ token, user }) {
      if (user) {
        token.admin = (user as any).admin || false;
        token.id = (user as any).id;
      }
      return token;
    },
  },
});
