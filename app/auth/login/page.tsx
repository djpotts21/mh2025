"use client";

import { useAuth } from "context/AuthContext";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

export default function LoginPage() {
  const { user } = useAuth(); // no login() needed anymore
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const supabase = createClientComponentClient();

  useEffect(() => {
    if (user) {
      router.push("/about");
    }
  }, [user, router]);

  const handleLogin = async () => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: username,
      password,
    });

    if (error) {
      alert(error.message);
    } else {
      router.push("/about");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-12 p-6 border rounded-xl shadow">
      <h2 className="text-xl font-bold mb-4 text-center">Login</h2>

      <input
        type="text"
        placeholder="Email"
        className="w-full p-2 border rounded mb-2"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />

      <input
        type="password"
        placeholder="Password"
        className="w-full p-2 border rounded mb-2"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button
        type="submit"
        onClick={handleLogin}
        className="w-full bg-blue-600 text-white p-2 rounded mb-2"
      >
        Login
      </button>

      <p className="text-sm text-center mt-4">
        Don’t have an account?{" "}
        <a className="font-bold" href="/auth/register">
          Register
        </a>
      </p>

      <p className="text-sm text-center mt-4">
        Forgot your password?{" "}
        <a className="font-bold" href="/auth/recover-account">
          Recover Account
        </a>
      </p>
    </div>
  );
}
