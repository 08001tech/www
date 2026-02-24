import { sentinelClient } from "@better-auth/infra/client";
import { genericOAuthClient } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL,
  plugins: [sentinelClient(), genericOAuthClient()],
});

export const { signIn, signUp, signOut, useSession } = authClient;
