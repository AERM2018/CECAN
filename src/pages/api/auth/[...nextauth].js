import NextAuth from "next-auth";
import { IAuthResponse } from "interfaces/IAuth.response.interface";
import CredentialsProvider from "next-auth/providers/credentials";
import cecanApi from "api/cecanApi";

export default NextAuth({
  providers: [
    CredentialsProvider({
      id: "credentials",
      async authorize(credentials) {
        try {
          console.log({ credentials });
          console.log("caca");
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
          console.log({ data: res.data });
          return res.data;
        } catch (error) {
          console.log({ error });
          return null;
        }
      },
    }),
  ],
  pages: {
    signIn: "/login",
    error: "/login",
  },
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
