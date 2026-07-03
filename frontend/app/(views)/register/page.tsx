"use client";

import { useState, type FormEvent } from "react";
import AuthLayout from "../../components/AuthLayout";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!name || !email || !password) {
      setError("Please fill in all fields.");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    setError("");
    setIsSubmitting(true);
    try {
      // TODO: wire up to auth API once available
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Start a project diary for your team."
      footerText="Already have an account?"
      footerLinkHref="/login"
      footerLinkText="Log in"
    >
      <form onSubmit={handleSubmit} noValidate>
        <label htmlFor="name" className="auth-label">
          Name
        </label>
        <input
          id="name"
          name="name"
          type="text"
          className="auth-input"
          placeholder="Jordan Lee"
          value={name}
          onChange={(e) => setName(e.target.value)}
          autoComplete="name"
        />

        <label htmlFor="email" className="auth-label">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          className="auth-input"
          placeholder="name@company.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
        />

        <label htmlFor="password" className="auth-label">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          className="auth-input"
          placeholder="At least 8 characters"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="new-password"
        />

        {error && <p className="auth-error">{error}</p>}

        <button type="submit" className="auth-button" disabled={isSubmitting}>
          {isSubmitting ? "Creating account..." : "Create account"}
        </button>
      </form>
    </AuthLayout>
  );
}
