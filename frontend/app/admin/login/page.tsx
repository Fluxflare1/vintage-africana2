"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000";

export default function AdminLogin() {
  const router = useRouter();
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");

    const form = e.currentTarget;
    const data = {
      email: form.email.value,
      password: form.password.value,
    };

    const res = await fetch(`${API_BASE}/api/auth/login/`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      setError("Invalid credentials");
      return;
    }

    router.push("/admin/app/dashboard");
  }

  return (
    <main style={{ height: "100vh", display: "grid", placeItems: "center" }}>
      <form onSubmit={onSubmit} style={{ width: 320 }}>
        <h2>Admin Login</h2>

        <input name="email" placeholder="Email" required />
        <input name="password" type="password" placeholder="Password" required />

        {error && <p style={{ color: "red" }}>{error}</p>}
        <button type="submit">Login</button>
      </form>
    </main>
  );
}
