"use client";

import { useEffect, useState } from "react";
import { Modal, Input, Button, Dropdown } from "antd";
import type { MenuProps } from "antd";
import { toast } from "react-toastify";
import { FiCopy, FiShare2, FiMail } from "react-icons/fi";
import { FaWhatsapp, FaLinkedin, FaXTwitter } from "react-icons/fa6";
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
    }
  };

  const shareText = "Join my project";
  const shareMenuItems: MenuProps["items"] = [
    {
      key: "whatsapp",
      label: "WhatsApp",
      icon: <FaWhatsapp color="#25d366" />,
      onClick: () =>
        window.open(
          `https://wa.me/?text=${encodeURIComponent(`${shareText}: ${inviteLink}`)}`,
          "_blank"
        ),
    },
    {
      key: "email",
      label: "Email",
      icon: <FiMail color="#666666" />,
      onClick: () =>
        window.open(
          `mailto:?subject=${encodeURIComponent(shareText)}&body=${encodeURIComponent(inviteLink)}`,
          "_blank"
        ),
    },
    {
      key: "twitter",
      label: "Twitter",
      icon: <FaXTwitter color="#000000" />,
      onClick: () =>
        window.open(
          `https://twitter.com/intent/tweet?text=${encodeURIComponent(`${shareText}: ${inviteLink}`)}`,
          "_blank"
        ),
    },
    {
      key: "linkedin",
      label: "LinkedIn",
      icon: <FaLinkedin color="#0a66c2" />,
      onClick: () =>
        window.open(
          `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(inviteLink)}`,
          "_blank"
        ),
    },
    {
      key: "copy",
      label: "Copy link",
      icon: <FiCopy color="#666666" />,
      onClick: handleCopy,
    },
  ];

  const canNativeShare = typeof navigator !== "undefined" && !!navigator.share;

  return (
    <Modal title="Invite a member" open={open} onCancel={onClose} footer={null} destroyOnHidden>
      <p className="modal-field-hint">Anyone with this link can join the project as an editor.</p>

      <Input value={inviteLink} readOnly placeholder={isLoading ? "Generating link…" : ""} />

      <div className="modal-actions">
        <Button icon={<FiCopy />} onClick={handleCopy} disabled={!inviteLink}>
          Copy
        </Button>
        {canNativeShare ? (
          <Button type="primary" icon={<FiShare2 />} onClick={handleShare} disabled={!inviteLink}>
            Share
          </Button>
        ) : (
          <Dropdown menu={{ items: shareMenuItems }} trigger={["click"]} disabled={!inviteLink}>
            <Button type="primary" icon={<FiShare2 />} disabled={!inviteLink}>
              Share
            </Button>
          </Dropdown>
        )}
      </div>
    </Modal>
  );
}
