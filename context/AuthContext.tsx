"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import type { User } from "@supabase/supabase-js";

interface AuthUser {
  id: string;
  email: string;
  username: string | null;
  avatar_url: string | null;
}

interface AuthContextType {
  user: AuthUser | null;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const supabase = createClientComponentClient();
  const [user, setUser] = useState<AuthUser | null>(null);

  const fetchUserWithProfile = async () => {
    const { data, error } = await supabase.auth.getUser();
    if (error || !data?.user) {
      setUser(null);
      return;
    }

    const baseUser = data.user;

    const { data: profile } = await supabase
      .from("profiles")
      .select("username, avatar_url")
      .eq("id", baseUser.id)
      .maybeSingle();

    setUser({
      id: baseUser.id,
      email: baseUser.email ?? "",
      username: profile?.username ?? null,
      avatar_url: profile?.avatar_url ?? null,
    });
  };

  useEffect(() => {
    fetchUserWithProfile();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        fetchUserWithProfile();
      } else {
        setUser(null);
      }
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, [supabase]);

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    window.location.href = "/auth/login";
  };

  return <AuthContext.Provider value={{ user, logout }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
