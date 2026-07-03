import Link from "next/link";
import type { ReactNode } from "react";

type AuthLayoutProps = {
  title: string;
  subtitle: string;
  footerText: string;
  footerLinkHref: string;
  footerLinkText: string;
  children: ReactNode;
};

export default function AuthLayout({
  title,
  subtitle,
  footerText,
  footerLinkHref,
  footerLinkText,
  children,
}: AuthLayoutProps) {
  return (
    <div className="auth-page">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-sm-10 col-md-6">
            <div className="auth-brand">
              <span className="auth-logo-badge">PJ</span>
              <span>Project Journal</span>
            </div>

            <div className="auth-card">
              <h1 className="auth-title">{title}</h1>
              <p className="auth-subtitle">{subtitle}</p>
              {children}
            </div>

            <p className="auth-footer">
              {footerText}{" "}
              <Link href={footerLinkHref} className="auth-link">
                {footerLinkText}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
