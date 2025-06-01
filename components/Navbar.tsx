"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "context/AuthContext";
import HueverseLogo from "@/components/HueverseLogo";

export default function Navbar() {
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu if clicked outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav
      className="px-6 py-4 shadow-md"
      style={{ backgroundColor: "var(--background)", color: "var(--foreground)" }}
    >
      <div className="flex justify-between items-center">
        <HueverseLogo />
        <div className="space-x-4 flex items-center">
          <Link href="/" className="p-2 rounded-md transition-all hover:bg-indigo-500 hover:font-bold">Home</Link>
          <Link href="/about" className="p-2 rounded-md transition-all hover:bg-indigo-500 hover:font-bold">About</Link>
          <Link href="/feed" className="p-2 rounded-md transition-all hover:bg-indigo-500 hover:font-bold">Feed</Link>
          <Link href="/chat" className="p-2 rounded-md transition-all hover:bg-indigo-500 hover:font-bold">Chat</Link>

          {user ? (
            <div className="relative" ref={menuRef}>
              <img
                src={user.avatar_url || "/default-avatar.png"}
                alt="User Avatar"
                className="w-10 h-10 rounded-full cursor-pointer"
                onClick={() => setMenuOpen(prev => !prev)}
              />
              {menuOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-lg z-50">
                  <Link
                    href={`/profile/${user.id}`}
                    className="block px-4 py-2 text-sm hover:bg-indigo-500 hover:text-white transition"
                    onClick={() => setMenuOpen(false)}
                  >
                    Profile
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      setMenuOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-sm hover:bg-red-500 hover:text-white transition"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link href="/auth/register" className="p-2 rounded-md transition-all hover:bg-indigo-500 hover:font-bold">Register</Link>
              <Link href="/auth/login" className="p-2 rounded-md transition-all hover:bg-indigo-500 hover:font-bold">Login</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
