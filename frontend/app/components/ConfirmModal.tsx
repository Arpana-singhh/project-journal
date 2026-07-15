"use client";

import { Modal } from "antd";

type ConfirmModalProps = {
  open: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  danger?: boolean;
  isLoading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

// Generic Yes/Cancel confirmation dialog - use for any "are you sure?" flow
// (delete project, remove member, etc.) instead of writing a one-off Modal.
export default function ConfirmModal({
  open,
  title,
  message,
  confirmText = "Yes",
  cancelText = "Cancel",
  danger = false,
  isLoading = false,
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  return (
    <Modal
      open={open}
      title={title}
      onCancel={onCancel}
      onOk={onConfirm}
      okText={confirmText}
      cancelText={cancelText}
      okButtonProps={{ danger, loading: isLoading }}
      destroyOnHidden
    >
      <p>{message}</p>
    </Modal>
  );
}
