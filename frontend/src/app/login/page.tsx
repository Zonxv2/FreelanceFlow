"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "../services/api";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setError("");
    setLoading(true);

    try {
      console.log("LOGIN V2");
      const response = await api.post(
        "/auth/login",
        { email, password }
      );

      localStorage.setItem("token", response.data.token);
      router.push("/");

    } catch (error) {
      setError("Invalid email or password 😢");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-6">

      <div className="border rounded-2xl p-8 w-full max-w-md flex flex-col gap-4 md:max-w-lg md:p-10">

        <h1 className="text-3xl font-bold mb-4">
          Login
        </h1>

        {error && (
          <p className="text-red-500 text-sm text-center">
            {error}
          </p>
        )}

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border p-3 rounded-xl"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border p-3 rounded-xl"
        />

        <button
          onClick={handleLogin}
          disabled={loading}
          className="bg-black text-white p-3 rounded-xl disabled:opacity-50"
        >
          {loading ? "Loading..." : "Login"}
        </button>

        <p className="mt-4 text-center">
          No account?{" "}
          <a href="/register" className="text-blue-500">
            Register
          </a>
        </p>

      </div>
    </div>
  );
}
