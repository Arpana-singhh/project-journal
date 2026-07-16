"use client";

import { Suspense, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-toastify";
import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import type { SerializedError } from "@reduxjs/toolkit";
import Navbar from "../../components/Navbar";
import { useAcceptInviteMutation } from "../../store/api/invitesApi";
import { getApiErrorMessage } from "../../store/api/apiError";

function AcceptInvite() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [acceptInvite] = useAcceptInviteMutation();
  const hasRequested = useRef(false);

  useEffect(() => {
    if (!token) {
      toast.error("Invite link is missing a token.");
      router.replace("/dashboard");
      return;
    }

    if (hasRequested.current) return;
    hasRequested.current = true;

    acceptInvite(token)
      .unwrap()
      .then((member) => {
        toast.success("Joined project successfully.");
        router.replace(`/projects/${member.projectId}`);
      })
      .catch((err) => {
        toast.error(getApiErrorMessage(err as FetchBaseQueryError | SerializedError));
        router.replace("/dashboard");
      });
  }, [token, acceptInvite, router]);

  return (
    <div className="invite-card">
      <div className="invite-icon-badge">
        <div className="invite-spinner" />
      </div>
      <p className="invite-title">Joining project…</p>
      <p className="invite-subtitle">Hang tight, we're adding you to the project.</p>
    </div>
  );
}

export default function InvitePage() {
  return (
    <>
      <Navbar />
      <div className="container invite-page">
        <Suspense
          fallback={
            <div className="invite-card">
              <div className="invite-icon-badge">
                <div className="invite-spinner" />
              </div>
              <p className="invite-title">Loading…</p>
            </div>
          }
        >
          <AcceptInvite />
        </Suspense>
      </div>
    </>
  );
}
