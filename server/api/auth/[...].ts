// import { NuxtAuthHandler } from '@sidebase/nuxt-auth'
// import CredentialsProvider from '@auth/core/providers/credentials'
// import { compare, hash } from 'bcrypt'
// import { db } from '~/server/db' // your database connection

// export default NuxtAuthHandler({
//   providers: [
//     CredentialsProvider({
//       name: 'Credentials',
//       credentials: {
//         email: { label: 'Email', type: 'email' },
//         password: { label: 'Password', type: 'password' },
//       },
//       async authorize(credentials) {
//         if (!credentials?.email || !credentials?.password) return null

//         // Look up user in DB
//         const user = await db.user.findUnique({ where: { email: credentials.email } })
//         if (!user) return null

//         // Compare password
//         const isValid = await compare(credentials.password, user.password)
//         if (!isValid) return null

//         // Return user object for session
//         return {
//           id: user.id,
//           name: user.name,
//           email: user.email,
//         }
//       },
//     }),
//   ],

//   session: {
//     strategy: 'jwt',
//   },

//   pages: {
//     signIn: '/login', // optional, frontend login page
//   },
// })
