"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import AuthLayout from "../../components/AuthLayout";

const POST_LOGIN_REDIRECT_KEY = "postLoginRedirectUrl";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // The proxy redirects here with ?callbackUrl=<protected path the user was
  // trying to reach> (e.g. an /invite link) when it bounces an unauthorized
  // request. Stash it so it survives even if the user reloads this page.
  useEffect(() => {
    const callbackUrl = new URLSearchParams(window.location.search).get("callbackUrl");
    if (callbackUrl) {
      sessionStorage.setItem(POST_LOGIN_REDIRECT_KEY, callbackUrl);
    }
  }, []);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!email || !password) {
      setError("Please enter your email and password.");
      return;
    }

    setError("");
    setIsSubmitting(true);
    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("Invalid email or password.");
        return;
      }

      const redirectUrl = sessionStorage.getItem(POST_LOGIN_REDIRECT_KEY);
      if (redirectUrl) {
        sessionStorage.removeItem(POST_LOGIN_REDIRECT_KEY);
        router.push(redirectUrl);
      } else {
        router.push("/dashboard");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLayout
      title="Log in"
      subtitle="Pick up where your team left off."
      footerText="New here?"
      footerLinkHref="/register"
      footerLinkText="Create an account"
    >
      <form onSubmit={handleSubmit} noValidate>
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
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
        />

        {error && <p className="auth-error">{error}</p>}

        <button type="submit" className="auth-button" disabled={isSubmitting}>
          {isSubmitting ? "Logging in..." : "Log in"}
        </button>
      </form>
    </AuthLayout>
  );
}
