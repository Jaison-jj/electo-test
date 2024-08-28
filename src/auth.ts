// import NextAuth from 'next-auth';
// import { Session } from 'next-auth';
// import FacebookProvider from 'next-auth/providers/facebook';
// import GoogleProvider from 'next-auth/providers/google';

// interface CustomSession extends Session {
//   accessToken?: string;
//   account?: any; // Add a custom property to store account data
// }

// export const {
//   handlers: { GET, POST },
//   auth,
//   signIn,
//   signOut,
// } = NextAuth({
//   providers: [
//     GoogleProvider({
//       clientId: process.env.GOOGLE_CLIENT_ID,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//     }),
//     FacebookProvider({
//       clientId: process.env.FACEBOOK_CLIENT_ID,
//       clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
//     }),
//   ],
//   callbacks: {
//     async session({ session, token, user }) {
//       const customSession = session as CustomSession; // Bypass TypeScript error
//       session.user.id = token.id as any;
//       customSession.accessToken = token.accessToken as any;
//       customSession.account = token.account; // Include the account data in the session
//       return session;
//     },
//     async jwt({ token, user, account, profile }) {
//       if (user) {
//         token.id = user.id;
//       }
//       if (account) {
//         token.accessToken = account.access_token;
//         token.account = account; // Store account data in the token
//       }
//       // console.log({ user, account, profile });
//       return token;
//     },
//   },
// });
