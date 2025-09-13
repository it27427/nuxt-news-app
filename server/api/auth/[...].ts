import { NuxtAuthHandler } from '#auth';
import { compare } from 'bcryptjs';
import { Model } from 'mongoose';
import { connectDB } from '~~/server/db/db';
import { User } from '~~/server/models/User';

import CredentialsProviderCJS from 'next-auth/providers/credentials';
const CredentialsProvider =
  (CredentialsProviderCJS as any).default || CredentialsProviderCJS;

const config = useRuntimeConfig();

export default NuxtAuthHandler({
  secret: config.auth.secret,
  pages: {
    signIn: '/admin/login',
  },
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials: any) {
        await connectDB();

        if (!credentials?.email || !credentials?.password) return null;

        const user = await (User as Model<any>).findOne({
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
    maxAge: 60 * 60,
  },
  callbacks: {
    async session({ session, token }) {
      if (token) {
        (session.user as any) = {
          id: token.id as string,
          email: token.email as string,
          admin: token.admin as boolean,
        };
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = (user as any).id;
        token.email = user.email;
        token.admin = (user as any).admin || false;
      }
      return token;
    },
    // async redirect({ url, baseUrl }) {
    //   return '/admin/dashboard';
    // },
  },
});
