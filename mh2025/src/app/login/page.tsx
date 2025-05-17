"use client";
import { useState } from "react";

export default function LoginPage() {
  const [isRegister, setIsRegister] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const endpoint = isRegister ? "/api/auth/register" : "/api/auth/login";

    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.error || "Something went wrong");
      return;
    }

    if (isRegister) {
      alert(`🎉 Registered! Your recovery key is:\n\n${data.recoveryKey}\n\nSave it safely!`);
    } else {
      localStorage.setItem("token", data.token);
      alert("✅ Logged in successfully!");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-12 p-6 border rounded-xl shadow">
      <h2 className="text-xl font-bold mb-4 text-center">
        {isRegister ? "Register" : "Login"}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Username"
          className="w-full p-2 border rounded"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full p-2 border rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded">
          {isRegister ? "Register" : "Login"}
        </button>
      </form>
      <p className="text-sm text-center mt-4">
        {isRegister ? (
          <span>
            Already have an account?{" "}
            <button className="underline text-blue-600" onClick={() => setIsRegister(false)}>
              Login
            </button>
          </span>
        ) : (
          <span>
            Don’t have an account?{" "}
            <button className="underline text-blue-600" onClick={() => setIsRegister(true)}>
              Register
            </button>
          </span>
        )}
      </p>
    </div>
  );
}
