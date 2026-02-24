"use client";

import { useState } from "react";
import { authClient, signIn } from "@/lib/auth-client";

export default function SignInPage() {
  const [loadingProvider, setLoadingProvider] = useState<string | null>(null);

  const handleGoogleSignIn = async () => {
    setLoadingProvider("google");
    try {
      await signIn.social({
        provider: "google",
        callbackURL: "/",
      });
    } catch {
      setLoadingProvider(null);
    }
  };

  const handleSoundCloudSignIn = async () => {
    setLoadingProvider("soundcloud");
    try {
      await authClient.signIn.oauth2({
        providerId: "soundcloud",
        callbackURL: "/",
      });
    } catch {
      setLoadingProvider(null);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="flex flex-col gap-3">
        <button
          className="flex items-center justify-center gap-3 rounded-md bg-white px-4 py-3 font-medium text-black transition-colors hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-white/50 disabled:cursor-not-allowed disabled:opacity-50"
          disabled={loadingProvider !== null}
          onClick={handleGoogleSignIn}
          type="button"
        >
          <svg aria-hidden="true" className="h-5 w-5" viewBox="0 0 24 24">
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              fill="currentColor"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="currentColor"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              fill="currentColor"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="currentColor"
            />
          </svg>
          {loadingProvider === "google"
            ? "signing in..."
            : "continue with google"}
        </button>

        <button
          className="flex items-center justify-center gap-3 rounded-md bg-[#ff5500] px-4 py-3 font-medium text-white transition-colors hover:bg-[#ff7700] focus:outline-none focus:ring-2 focus:ring-[#ff5500]/50 disabled:cursor-not-allowed disabled:opacity-50"
          disabled={loadingProvider !== null}
          onClick={handleSoundCloudSignIn}
          type="button"
        >
          <svg
            aria-hidden="true"
            className="h-5 w-5"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M1.175 12.225c-.051 0-.094.046-.101.1l-.233 2.154.233 2.105c.007.058.05.098.101.098.05 0 .09-.04.099-.098l.255-2.105-.27-2.154c-.009-.06-.052-.1-.084-.1zm-.899 1.448c-.044 0-.079.046-.086.1l-.168 1.9.168 1.9c.007.054.042.1.086.1.044 0 .079-.046.086-.1l.19-1.9-.19-1.9c-.007-.054-.042-.1-.086-.1zm1.81-1.474c-.062 0-.111.06-.118.125l-.204 2.154.204 2.048c.007.065.056.125.118.125s.111-.06.118-.125l.231-2.048-.231-2.154c-.007-.065-.056-.125-.118-.125zm.89-.518c-.073 0-.131.065-.139.144l-.178 2.672.178 2.031c.008.079.066.144.139.144.072 0 .13-.065.138-.144l.204-2.031-.204-2.672c-.008-.079-.066-.144-.138-.144zm.903-.316c-.083 0-.148.079-.155.168l-.153 2.988.153 2.003c.007.089.072.168.155.168.082 0 .147-.079.155-.168l.178-2.003-.178-2.988c-.008-.089-.073-.168-.155-.168zm.905-.258c-.094 0-.166.089-.174.197l-.127 3.246.127 1.966c.008.108.08.197.174.197.093 0 .165-.089.173-.197l.143-1.966-.143-3.246c-.008-.108-.08-.197-.173-.197zm.904-.101c-.103 0-.184.103-.191.227l-.102 3.347.102 1.938c.007.123.088.227.191.227.104 0 .184-.104.192-.227l.115-1.938-.115-3.347c-.008-.124-.088-.227-.192-.227zm.904-.072c-.113 0-.201.113-.209.256l-.076 3.42.076 1.91c.008.143.096.256.209.256.114 0 .201-.113.209-.256l.089-1.91-.089-3.42c-.008-.143-.095-.256-.209-.256zm2.618-.129c-.003-.016-.016-.028-.032-.028-.009 0-.016.005-.022.012-.005.006-.187 1.49-.187 3.66 0 2.163.182 3.652.187 3.661.006.007.013.011.022.011.016 0 .029-.012.032-.028l.074-.42.125-3.223-.13-3.225-.069-.42zm-1.713.075c-.124 0-.22.127-.228.286l-.051 3.493.051 1.875c.008.159.104.286.228.286.123 0 .219-.127.227-.286l.058-1.875-.058-3.493c-.008-.159-.104-.286-.227-.286zm.904-.043c-.134 0-.238.133-.245.31l-.026 3.536.026 1.845c.007.176.111.31.245.31s.237-.134.244-.31l.032-1.845-.032-3.536c-.007-.177-.11-.31-.244-.31zm5.158-.036c-.179 0-.323.1-.398.255-.128-.041-.27-.064-.42-.064-1.192 0-2.165 1.036-2.165 2.318 0 .097.003.192.016.284l-.008.002c-.091 0-.161.132-.168.31l-.007.004-.015 3.266.015 1.828c.007.178.077.31.168.31l2.579.001c1.035 0 1.879-.902 1.879-2.007V12.24c0-1.106-.844-2.008-1.879-2.008l.003-.002z" />
          </svg>
          {loadingProvider === "soundcloud"
            ? "signing in..."
            : "continue with soundcloud"}
        </button>
      </div>
    </div>
  );
}
