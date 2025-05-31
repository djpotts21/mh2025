"use client";
import { useAuth } from "context/AuthContext";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const { login, user } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  // Redirect to /about if already logged in
  useEffect(() => {
    if (user) {
      router.push("/about");
    }
  }, [user, router]); // ✅ added router to dependencies

  const handleRegister = async () => {
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    const data = await res.json();

    if (res.ok) {
      alert(`✅ Registration successful!\n\nYour recovery key is:\n${data.recoveryKey}\n\nSave it safely.`);

      // Auto-login
      const loginRes = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const loginData = await loginRes.json();

      if (loginRes.ok) {
        login(loginData.token);
        router.push("/about");
      } else {
        alert("User registered, but login failed.");
      }
    } else {
      alert(data.error || "Something went wrong");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-12 p-6 border rounded-xl shadow">
      <h2 className="text-xl font-bold mb-4 text-center">Register</h2>

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
        onClick={handleRegister}
        className="w-full bg-green-600 text-white p-2 rounded mb-2"
      >
        Register
      </button>

      <p className="text-sm text-center mt-4">
        Already have an account?{" "}
        <a className="font-bold" href="/auth/login">
          Login
        </a>
      </p>
    </div>
  );
}
