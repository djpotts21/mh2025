"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import bcrypt from "bcryptjs";

export default function RecoverPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [recoveryKey, setRecoveryKey] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const [validated, setValidated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [newKey, setNewKey] = useState("");

  const handleVerify = async () => {
    setLoading(true);

    try {
      const res = await fetch("/api/auth/verify-recovery", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ username, recoveryKey }),
      });

      const text = await res.text();
      let data: any = {};
      try {
        data = JSON.parse(text);
      } catch (err) {
        console.error("Invalid JSON:", err);
        alert("Unexpected response from server.");
        setLoading(false);
        return;
      }

      if (res.status === 429) {
        alert("🚫 Too many failed attempts. This account is temporarily locked. Try again in 15 minutes.");
      } else if (!res.ok) {
        alert(data.error || "Invalid recovery key");
      } else {
        setValidated(true); // ✅ Success
      }
    } catch (err) {
      console.error("Request failed:", err);
      alert("Network error. Please try again.");
    }

    setLoading(false);
  };

  const handleReset = async () => {
    setLoading(true);
    const res = await fetch("/api/auth/reset-password", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ username, newPassword }),
    });

    const data = await res.json();
    if (res.ok) {
      localStorage.setItem("token", data.token); // ✅ now we have a valid token for reset-password
      setValidated(true);
    } else {
      alert(data.error || "Something went wrong");
    }

    setLoading(false);
  };

  return (
    <div className="max-w-md mx-auto mt-12 p-6 border rounded-xl shadow">
      <h2 className="text-xl font-bold mb-4 text-center">Recover Account</h2>

      <input
        type="text"
        placeholder="Username"
        className="w-full p-2 border rounded mb-2"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        disabled={validated}
      />

      <input
        type="text"
        placeholder="Recovery Key"
        className={`w-full p-2 border rounded mb-2 transition-all duration-300 ${
          validated ? "bg-green-100 blur-sm" : ""
        }`}
        value={recoveryKey}
        onChange={(e) => setRecoveryKey(e.target.value)}
        disabled={validated}
      />

      {!validated && (
        <button
          onClick={handleVerify}
          className="w-full bg-blue-600 text-white p-2 rounded mb-2"
          disabled={loading}
        >
          {loading ? "Verifying..." : "Verify Recovery Key"}
        </button>
      )}

      {validated && (
        <>
          <input
            type="password"
            placeholder="New Password"
            className="w-full p-2 border rounded mb-2"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <button
            onClick={handleReset}
            className="w-full bg-green-600 text-white p-2 rounded mb-2"
            disabled={loading}
          >
            {loading ? "Updating..." : "Reset Password"}
          </button>
        </>
      )}

      {newKey && (
        <div className="mt-4 bg-green-100 border border-green-500 text-green-700 p-4 rounded">
          <strong>✅ Password reset successful!</strong>
          <p>Your new recovery key is:</p>
          <pre className="mt-2 p-2 bg-white border rounded font-mono">{newKey}</pre>
        </div>
      )}
    </div>
  );
}
