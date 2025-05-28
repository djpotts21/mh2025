"use client";
import { useAuth } from "context/AuthContext";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";



export default function LoginPage() {

  // Constants

  const { login } = useAuth(); 
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const { user } = useAuth(); 

  // Redirect to chat if user is already logged in
  // This effect runs when the component mounts and checks if the user is logged in
  useEffect(() => {
    if (user) {
      router.push("/about");
    }
  }, [user]);


  // Login function
  // This function sends a POST request to the server with the username and password

  const handleLogin = async () => {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    const data = await res.json();

    if (res.ok) {
      login(data.token); // 👈 this updates AuthContext, causing Navbar to re-render
      router.push("/about");      // 👈 redirect to chat or wherever you want
    } else {
      alert(data.error);
    }
  };
  return (
    <div className="max-w-md mx-auto mt-12 p-6 border rounded-xl shadow">
      <h2 className="text-xl font-bold mb-4 text-center">
        Login
      </h2>
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
      <button type="submit" onClick={handleLogin} className="w-full bg-blue-600 text-white p-2 rounded mb-2">
        Login
      </button>
      <p className="text-sm text-center mt-4">
        <span>
          Don’t have an account?{" "}
          <a className="font-bold" href="/auth/register">
            Register
          </a>
        </span>
      </p>
      <p className="text-sm text-center mt-4">
        <span>
          Forgot your password?{" "}
          <a className="font-bold" href="/auth/recover-account">
            Recover Account
          </a>
        </span>
      </p>
    </div>
  );
}
