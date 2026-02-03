import { env } from "@08001/env/server";
import { betterAuth } from "better-auth";
import { nextCookies } from "better-auth/next-js";
import { genericOAuth } from "better-auth/plugins";

export const auth = betterAuth({
  trustedOrigins: [env.CORS_ORIGIN],
  secret: env.BETTER_AUTH_SECRET,
  baseURL: env.BETTER_AUTH_URL,
  socialProviders: {
    google: {
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
    },
  },
  plugins: [
    nextCookies(),
    genericOAuth({
      config: [
        {
          providerId: "soundcloud",
          clientId: env.SOUNDCLOUD_CLIENT_ID,
          clientSecret: env.SOUNDCLOUD_CLIENT_SECRET,
          authorizationUrl: "https://secure.soundcloud.com/authorize",
          tokenUrl: "https://secure.soundcloud.com/oauth/token",
          userInfoUrl: "https://api.soundcloud.com/me",
          pkce: true,
          mapProfileToUser: (profile) => ({
            id: String(profile.id),
            name: profile.username || profile.full_name,
            email: profile.email,
            image: profile.avatar_url,
          }),
        },
      ],
    }),
  ],
});

export type Session = typeof auth.$Infer.Session.session;
export type User = typeof auth.$Infer.Session.user;
