"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getCsrf } from "@/lib/admin-api";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetch("/api/auth/me", { credentials: "include" }).then((response) => {
      if (response.ok) router.replace("/admin");
    });
  }, [router]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      const csrf = await getCsrf();
      const response = await fetch("/api/auth/login", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          [csrf.headerName]: csrf.token,
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        setError(response.status === 401 ? "Email or password is incorrect." : "Login failed. Is the Java backend running?");
        return;
      }

      router.replace("/admin");
      router.refresh();
    } catch {
      setError("Cannot reach the Java backend. Start it and try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="admin-login-page">
      <section className="admin-login-card">
        <Link className="brand admin-login-brand" href="/" aria-label="Go to NiveshLabs website">
          <span className="brand-mark" aria-hidden="true"><i /><i /><i /></span>
          <span className="brand-name">Nivesh<span>Labs</span></span>
        </Link>
        <p className="admin-eyebrow">SECURE ADMIN</p>
        <h1>Sign in</h1>
        <p>Use your NiveshLabs administrator account.</p>

        <form className="admin-login-form" onSubmit={handleSubmit}>
          <label htmlFor="admin-email">Email</label>
          <input
            id="admin-email"
            type="email"
            autoComplete="username"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
          <label htmlFor="admin-password">Password</label>
          <input
            id="admin-password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
          {error && <p className="admin-form-error" role="alert">{error}</p>}
          <button type="submit" disabled={submitting}>
            {submitting ? "Signing in…" : "Sign in"}
          </button>
        </form>
      </section>
    </main>
  );
}
