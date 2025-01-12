// src/components/SessionGuard.tsx
"use client";
import { signIn, useSession } from "next-auth/react";
import { ReactNode, useEffect } from "react";

export default function SessionGuard({ children }: { children: ReactNode }) {
  const { data } = useSession();
  useEffect(() => {
    //@ts-expect-error this error type is used in callback in auth config
    if (data?.error === "RefreshAccessTokenError") {
      signIn("keycloak");
    }
  }, [data]);

  return <>{children}</>;
}
