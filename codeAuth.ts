"use server";
import NextAuth from "next-auth";
import { authConfig } from "./auth.config";
import Credentials from "next-auth/providers/credentials";
import { z } from "zod";
import { sql } from "@vercel/postgres";

async function validateCode(code: string): Promise<boolean> {
  try {
    const codes = await sql`SELECT * FROM register_codes WHERE code = ${code}`;
    if (codes.rowCount && codes.rowCount > 0) {
      const firstCode = codes.rows[0];
      const isCodeValid = firstCode.code == code && !firstCode.used;
      if (isCodeValid) {
        await sql`UPDATE register_codes 
            SET (used) = ROW(TRUE)        
            WHERE code = ${code}`;
      }
      return isCodeValid;
    }
    return false;
  } catch (error) {
    console.error("Code not valid:", error);
    throw new Error("Code not valid.");
  }
}

export const { auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      async authorize(credentials) {
        const parsedCredentials = z
          .object({ code: z.string().min(6) })
          .safeParse(credentials);
        if (parsedCredentials.success) {
          const { code } = parsedCredentials.data;
          const validated = await validateCode(code);
          if (!validated) return null;
          const user = { id: code };
          return user;
        }
        return null;
      },
    }),
  ],
});
