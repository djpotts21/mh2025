"use client";
import { useAuth } from "@/context/AuthContext";

interface LogoutButtonProps {
  className?: string;
}

export default function LogoutButton({ className }: LogoutButtonProps) {
  const { logout } = useAuth();

  return (
    <button onClick={logout} className={className}>
      Logout
    </button>
  );
}