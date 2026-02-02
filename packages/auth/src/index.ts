import { Database } from "bun:sqlite";
import { env } from "@08001/env/server";
import { betterAuth } from "better-auth";
import { nextCookies } from "better-auth/next-js";

const db = new Database("auth.db");

export const auth = betterAuth({
  database: db,
  trustedOrigins: [env.CORS_ORIGIN],
  secret: env.BETTER_AUTH_SECRET,
  baseURL: env.BETTER_AUTH_URL,
  socialProviders: {
    google: {
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
    },
  },
  plugins: [nextCookies()],
});

export type Session = typeof auth.$Infer.Session.session;
export type User = typeof auth.$Infer.Session.user;
