import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  pages: {
    signIn: "/login",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      // throw new Error(`${auth?.user?.email}`);
      const hasActiveUser = !!auth?.user;
      const isOnDashboard = nextUrl.pathname.startsWith("/dashboard");
      const isOnRegister = nextUrl.pathname.endsWith("/register");
      const isOnCode = nextUrl.pathname.endsWith("/register/code");

      if (isOnRegister) {
        if (!hasActiveUser) {
          return Response.redirect(new URL("/register/code", nextUrl));
        }
        if (hasActiveUser && auth?.user?.email) {
          return Response.redirect(new URL("/dashboard", nextUrl));
        }
        return true;
      }
      if (isOnCode) {
        if (hasActiveUser && !auth?.user?.email) {
          return Response.redirect(new URL("/register", nextUrl));
        }
        if (hasActiveUser && auth?.user?.email) {
          return Response.redirect(new URL("/dashboard", nextUrl));
        }
        return true;
      }
      if (isOnDashboard) {
        if (hasActiveUser) {
          return auth?.user?.email
            ? true
            : Response.redirect(new URL("/register", nextUrl));
        }
        return false; // Redirect unauthenticated users to login page
      } else if (hasActiveUser && auth?.user?.email) {
        return Response.redirect(new URL("/dashboard", nextUrl));
      }
      return true;
    },
  },
  providers: [], // Add providers with an empty array for now
} satisfies NextAuthConfig;
