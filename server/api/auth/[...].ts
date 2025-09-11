import { NuxtAuthHandler } from '#auth';
import { compare } from 'bcryptjs';
import { Model } from 'mongoose';
import type { Session } from 'next-auth';
import type { JWT } from 'next-auth/jwt';
import CredentialsProviderCJS from 'next-auth/providers/credentials';
import { connectDB } from '~~/server/db/db';
import { User } from '~~/server/models/User';

const CredentialsProvider =
  (CredentialsProviderCJS as any).default || CredentialsProviderCJS;

export default NuxtAuthHandler({
  secret: useRuntimeConfig().auth.secret,
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

        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        // Fix for the Mongoose callable error.
        // We explicitly cast the User model to a Mongoose Model type.
        const user = await (User as Model<any>).findOne({
          email: credentials.email,
        });

        if (!user) {
          return null;
        }

        const isValid = await compare(credentials.password, user.password);
        if (!isValid) {
          return null;
        }

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
    async session({ session, token }: { session: Session; token: JWT }) {
      return {
        ...session,
        user: {
          email: session.user?.email,
          admin: token.admin || false,
        },
      };
    },
    async jwt({ token, user }: { token: JWT; user?: any }) {
      if (user) {
        token.admin = (user as any).admin || false;
        token.id = (user as any).id;
      }
      return token;
    },
  },
});
