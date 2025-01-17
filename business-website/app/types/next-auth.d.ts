// next-auth.d.ts

import { DefaultSession } from "next-auth";
import { JWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session extends DefaultSession {
    accessToken?: string;
    error?: string;
    user?: Record<string, unknown>; // Or specify a type for your decoded user if you have one
  }

  interface Token extends JWT {
    accessToken?: string;
    error?: string;
    decoded?: Record<string, unknown>; // Or specify a type for your decoded token if you have one
  }
}
