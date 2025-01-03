import Link from "next/link";
import { PrinterIcon as Printer3d } from "lucide-react";

export default function Header() {
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
                href="#services"
                className="hover:text-blue-400 transition duration-300"
              >
                MyPrint
              </Link>
            </li>
            <li>
              <Link
                href="#contact"
                className="hover:text-blue-400 transition duration-300"
              >
                Contact
              </Link>
            </li>
            <li>
              <Link
                href="/sign-in"
                className="hover:text-blue-400 transition duration-300"
              >
                Sign In
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
