"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "context/AuthContext";

export default function RecoverPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [username, setUsername] = useState("");
  const [recoveryKey, setRecoveryKey] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const [validated, setValidated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [newKey, setNewKey] = useState("");
  const [countdown, setCountdown] = useState<number | null>(null);

  const handleVerify = async () => {
    setLoading(true);

    try {
      const res = await fetch("/api/auth/verify-recovery", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
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
        localStorage.setItem("token", data.token);
        setValidated(true);
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
      body: JSON.stringify({ newPassword }),
    });

    const data = await res.json();

    if (res.ok) {
      localStorage.setItem("token", data.token);
      login(data.token);
      setNewKey(data.recoveryKey);
      setCountdown(30); // start the countdown
    } else {
      alert(data.error || "Something went wrong");
    }

    setLoading(false);
  };

  useEffect(() => {
    if (countdown === null) return;

    if (countdown === 0) {
      router.push("/chat");
      return;
    }

    const timer = setTimeout(() => {
      setCountdown((prev) => (prev !== null ? prev - 1 : null));
    }, 1000);

    return () => clearTimeout(timer);
  }, [countdown, router]);

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
        className={`w-full p-2 border rounded mb-2 transition-all duration-300 ${validated ? "bg-green-100 blur-[1.5px] text-black select-none cursor-not-allowed" : ""
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
        <div
          className={`mt-4 p-4 rounded text-center border ${countdown !== null && countdown <= 15
              ? "bg-red-100 border-red-500 text-red-700"
              : "bg-green-100 border-green-500 text-green-700"
            }`}
        >
          <strong>✅ Password reset successful!</strong>
          <p>Your new recovery key is:</p>
          <pre className="mt-2 p-2 bg-white border rounded font-mono">{newKey}</pre>

          {countdown !== null && (
            <p className="text-sm mt-2">
              Automatically logging in in {countdown} second{countdown !== 1 ? "s" : ""}...
            </p>
          )}
        </div>
      )}
    </div>
  );
}
