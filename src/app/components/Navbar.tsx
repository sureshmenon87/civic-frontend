"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "./AuthProvider";
import Avatar from "./Avatar";
import { useTheme } from "@/lib/useTheme";

export default function Navbar() {
  const { user, login, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const pathname = usePathname();
  const router = useRouter();

  const isActive = (p: string) => pathname === p;

  async function doLogout() {
    await logout();
    router.replace("/login");
  }

  return (
    <header className="flex items-center justify-between mb-6">
      <div>
        <Link href="/" className="text-2xl font-semibold underline">
          Civic Violation
        </Link>
      </div>

      <nav className="flex items-center gap-4">
        <Link
          href="/reports"
          className={`text-sm ${
            isActive("/reports") ? "font-semibold" : "text-slate-700"
          }`}
        >
          Reports
        </Link>
        <Link
          href="/about"
          className={`text-sm ${
            isActive("/about") ? "font-semibold" : "text-slate-700"
          }`}
        >
          About
        </Link>
        <Link
          href="/contact"
          className={`text-sm ${
            isActive("/contact") ? "font-semibold" : "text-slate-700"
          }`}
        >
          Contact
        </Link>

        {user ? (
          <>
            <Link
              href="/reports/create"
              className="px-3 py-1 bg-violet-600 text-white rounded"
            >
              Create
            </Link>
            <Avatar src={user.avatar} name={user.name} size={36} proxy={true} />
            <button onClick={doLogout} className="px-3 py-1 border rounded">
              Logout
            </button>
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="px-3 py-1 border rounded"
            >
              {theme === "dark" ? "Light" : "Dark"}
            </button>
          </>
        ) : (
          <button
            onClick={login}
            className="px-3 py-1 bg-blue-600 text-white rounded"
          >
            Login
          </button>
        )}
      </nav>
    </header>
  );
}
