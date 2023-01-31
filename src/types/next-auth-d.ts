import NextAuth, { DefaultSession } from "next-auth";
import { AuthState } from "store/auth/authSlice";

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: AuthState & DefaultSession["user"];
  }
}
