"use client";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import LogoutButton from "./LogoutButton";

export default function Navbar() {
  const { user } = useAuth();
  return (
    <nav className="bg-blue-600 text-white px-6 py-4 shadow-md">
      <div className="flex justify-between items-center">
        <Link href="/" className="text-xl font-bold">SupportSpace</Link>
        <div className="space-x-4">
          <Link href="/" className="p-2 rounded-md transition-all delay-150 duration-300 ease-in-out hover:bg-indigo-500 hover:font-bold">Home</Link>
          <Link href="/about" className="p-2 rounded-md transition-all delay-150 duration-300 ease-in-out hover:bg-indigo-500 hover:font-bold">About</Link>
          <Link href="/chat" className="p-2 rounded-md transition-all delay-150 duration-300 ease-in-out hover:bg-indigo-500 hover:font-bold">Chat</Link>
            {user && (
            <LogoutButton className="p-2 rounded-md transition-all delay-150 duration-300 ease-in-out hover:bg-indigo-500 hover:font-bold cursor-pointer" />
            )}
          {!user && <Link href="/login" className="p-2 rounded-md transition-all delay-150 duration-300 ease-in-out hover:bg-indigo-500 hover:font-bold">Login</Link>}

          
        </div>
      </div>
    </nav>
  );
}
