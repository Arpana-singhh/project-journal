"use client";

import { useEffect, useState } from "react";
import { Modal, Input, Button } from "antd";
import { toast } from "react-toastify";
import { FiCopy, FiShare2 } from "react-icons/fi";
import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import type { SerializedError } from "@reduxjs/toolkit";
import { useCreateInviteLinkMutation } from "../store/api/invitesApi";
import { getApiErrorMessage } from "../store/api/apiError";

type AddMemberModalProps = {
  open: boolean;
  projectId: string;
  onClose: () => void;
};

export default function AddMemberModal({ open, projectId, onClose }: AddMemberModalProps) {
  const [createInviteLink, { isLoading }] = useCreateInviteLinkMutation();
  const [inviteLink, setInviteLink] = useState("");

  useEffect(() => {
    if (!open) {
      setInviteLink("");
      return;
    }

    createInviteLink({ projectId })
      .unwrap()
      .then(setInviteLink)
      .catch((err) => {
        toast.error(getApiErrorMessage(err as FetchBaseQueryError | SerializedError));
      });
  }, [open, projectId]);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(inviteLink);
    toast.success("Invite link copied to clipboard.");
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: "Join my project", url: inviteLink });
      } catch {
        // User dismissed the native share sheet - nothing to do.
      }
      return;
    }

    await handleCopy();
  };

  return (
    <Modal title="Invite a member" open={open} onCancel={onClose} footer={null} destroyOnHidden>
      <p className="modal-field-hint">Anyone with this link can join the project as an editor.</p>

      <Input value={inviteLink} readOnly placeholder={isLoading ? "Generating link…" : ""} />

      <div className="modal-actions">
        <Button icon={<FiCopy />} onClick={handleCopy} disabled={!inviteLink}>
          Copy
        </Button>
        <Button type="primary" icon={<FiShare2 />} onClick={handleShare} disabled={!inviteLink}>
          Share
        </Button>
      </div>
    </Modal>
  );
}
