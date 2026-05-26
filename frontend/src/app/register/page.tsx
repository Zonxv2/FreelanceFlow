"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "../services/api";

export default function RegisterPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      console.log("REGISTER V2");
      await api.post(
      "/auth/register",
      { name, email, password }
    );

      router.push("/login");

    } catch (error) {
      setError("Registration failed. Email may already be in use 😢");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-6">
      
      <form
        onSubmit={handleRegister}
        className="border p-8 rounded-2xl w-full max-w-md md:max-w-lg md:p-10"
      >

        <h1 className="text-3xl font-bold mb-6">
          Register
        </h1>

        {error && (
          <p className="text-red-500 text-sm text-center mb-4">
            {error}
          </p>
        )}

        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border p-3 w-full mb-4 rounded-xl"
        />

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border p-3 w-full mb-4 rounded-xl"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border p-3 w-full mb-6 rounded-xl"
        />

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-500 text-white w-full p-3 rounded-xl disabled:opacity-50"
        >
          {loading ? "Loading..." : "Register"}
        </button>

      </form>

    </div>
  );
}
