"use client";

import { useAuth } from "context/AuthContext";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

export default function RegisterPage() {
  const { user } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const router = useRouter();
  const supabase = createClientComponentClient();

  useEffect(() => {
    if (user) {
      router.push("/about");
    }
  }, [user, router]);


  const handleRegister = async () => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      alert(error.message);
    } else if (data.user) {
      alert("✅ Registration successful. You are now logged in.");
      const { error: profileError } = await supabase
        .from("profiles")
        .update({ username, avatar_url: "https://api.dicebear.com/7.x/identicon/png?seed=" + data.user.id }) 
        .eq("id", data.user.id);
      if (profileError) {
        alert("Error updating profile: " + profileError.message);
      }
      router.push("/about");
    } else {
      alert("Registration email sent. Please check your inbox.");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-12 p-6 border rounded-xl shadow">
      <h2 className="text-xl font-bold mb-4 text-center">Register</h2>

      <input
        type="email"
        placeholder="Email"
        className="w-full p-2 border rounded mb-2"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        className="w-full p-2 border rounded mb-2"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <input
        type="text"
        placeholder="Username"
        className="w-full p-2 border rounded mb-2"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
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
