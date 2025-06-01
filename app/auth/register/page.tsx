"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

export default function RegisterPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const supabase = createClientComponentClient();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) {
        router.push("/about");
      }
    });
  }, [router, supabase]);

  const handleRegister = async () => {
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email: `${username}@example.com`, // or use real email if required
      password,
    });

    if (signUpError || !signUpData.user) {
      alert(signUpError?.message || "Registration failed");
      return;
    }

    // ✅ Insert into profiles table
    const { error: profileError } = await supabase.from("profiles").insert({
      id: signUpData.user.id,
      username,
    });

    if (profileError) {
      alert("Profile creation failed");
      return;
    }

    // ✅ Auto-login user
    const { error: loginError } = await supabase.auth.signInWithPassword({
      email: `${username}@example.com`,
      password,
    });

    if (loginError) {
      alert("User registered, but login failed.");
    } else {
      router.push("/about");
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
