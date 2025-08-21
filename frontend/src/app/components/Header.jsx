// src/app/components/Header.jsx
"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Header() {
  const pathname = usePathname();
  const isActive = (href) => pathname === href;
  const base = "px-3 py-1.5 rounded-md text-sm font-medium transition-colors duration-200";
  const active = "bg-white/10 text-white";
  const inactive = "text-gray-400 hover:bg-white/10 hover:text-white";

  return (
    <header className="sticky top-0 z-10 bg-gray-900/50 backdrop-blur-lg border-b border-white/10">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-2">
            <svg className="w-8 h-8 text-indigo-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.745 3.745 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.745 3.745 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z" />
            </svg>
            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-indigo-400">
              Priority Tasks
            </h1>
          </div>
          <nav className="flex items-center space-x-2 bg-gray-800/50 p-1 rounded-lg">
            <Link href="/dashboard" className={`${base} ${isActive("/dashboard") ? active : inactive}`}>Dashboard</Link>
            <Link href="/completed" className={`${base} ${isActive("/completed") ? active : inactive}`}>Completed</Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
