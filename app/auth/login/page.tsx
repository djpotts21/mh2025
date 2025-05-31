"use client";

import { useAuth } from "context/AuthContext";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const { login, user } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  // Redirect if user already logged in
  useEffect(() => {
    if (user) {
      router.push("/about");
    }
  }, [user, router]); // ✅ added router to dependencies

  const handleLogin = async () => {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    const data = await res.json();

    if (res.ok) {
      login(data.token);
      router.push("/about");
    } else {
      alert(data.error);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-12 p-6 border rounded-xl shadow">
      <h2 className="text-xl font-bold mb-4 text-center">Login</h2>

      <input
        type="text"
        placeholder="Username"
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
