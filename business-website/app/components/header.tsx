"use client";
import Link from "next/link";
import { PrinterIcon as Printer3d } from "lucide-react";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth/next";
import { signIn, signOut, useSession } from "next-auth/react";
import federatedLogout from "../lib/federatedLogout";
export default function Header() {
  const { data: session, status } = useSession();
  return (
    <header className="bg-gray-800 text-white shadow-lg border-b border-blue-500">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-2 text-2xl font-bold">
          <Printer3d size={32} className="text-blue-500" />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
            3D Print Pro
          </span>
        </Link>
        <nav>
          <ul className="flex gap-6 text-lg">
            <li>
              <Link
                href="/"
                className="hover:text-blue-400 transition duration-300"
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                href="/print"
                className="hover:text-blue-400 transition duration-300"
              >
                Print
              </Link>
            </li>
            <li>
              <Link
                href="/contact"
                className="hover:text-blue-400 transition duration-300"
              >
                Contact
              </Link>
            </li>
            <li>
              <button
                className="hover:text-blue-400 transition duration-300"
                onClick={() =>
                  session ? federatedLogout() : signIn("keycloak")
                }
              >
                {session ? "Sign out" : "Sign in"}
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
