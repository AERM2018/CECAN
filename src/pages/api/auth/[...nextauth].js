import NextAuth from "next-auth";
import { IAuthResponse } from "interfaces/IAuth.response.interface";
import CredentialsProvider from "next-auth/providers/credentials";
import cecanApi from "api/cecanApi";

export default NextAuth({
  session: {
    strategy: "jwt",
  },
  providers: [
    CredentialsProvider({
      id: "login",
      async authorize(credentials) {
        try {
          const response = await fetch(
            `${process.env.API_BASE_URL}/auth/login`,
            {
              headers: {
                cookie: "",
              },
              method: "POST",
              body: JSON.stringify({
                username: credentials.username,
                password: credentials.password,
              }),
            }
          );
          const res = await response.json();
          return res.data;
        } catch (error) {
          console.log({ error });
          return {};
        }
      },
    }),
  ],
  callbacks: {
    jwt: async ({ token, user }) => {
      if (user) {
        token = user;
      }
      return token;
    },
    session: async ({ session, token }) => {
      // session callback is called whenever a session for that particular user is checked
      // in above function we created token.user=user
      session.user = token;
      // you might return this in new version
      return session;
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  // jwt: {
  //   encode: (token) => {
  //     console.log({ token });
  //   },
  // },
  // callbacks: {
  //   async signIn({ user }) {
  //     if (user) return true;

  //     return false;
  //   },
  //   async session({ session }) {
  //     session.user.isLoggedIn = true;
  //     return session;
  //   },
  //   async jwt({ token, user }) {
  //     return token;
  //   },
  // },
});
