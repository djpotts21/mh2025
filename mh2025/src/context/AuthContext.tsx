"use client";
import { createContext, useContext, useEffect, useState } from "react";
import jwt from "jsonwebtoken";

interface AuthContextType {
  user: { userId: string; username: string } | null;
  login: (token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<AuthContextType["user"]>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwt.decode(token) as { userId: string; username: string };
        setUser(decoded);
      } catch {
        setUser(null);
      }
    }
  }, []);

  const login = (token: string) => {
    localStorage.setItem("token", token);
    const decoded = jwt.decode(token) as { userId: string; username: string };
    setUser(decoded);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    window.location.href = "/login";
  };

  return <AuthContext.Provider value={{ user, login, logout }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
