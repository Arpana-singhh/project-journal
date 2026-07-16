"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Button, Input } from "antd";
import { toast } from "react-toastify";
import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import type { SerializedError } from "@reduxjs/toolkit";
import Navbar from "../../../components/Navbar";
import ConfirmModal from "../../../components/ConfirmModal";
import AddMemberModal from "../../../components/AddMemberModal";
import CreateMeetingModal from "../../../components/CreateMeetingModal";
import {
  useGetProjectByIdAsModelQuery,
  useUpdateProjectAsModelMutation,
  useDeleteProjectMutation,
} from "../../../store/api/projectsApi";
import { getApiErrorMessage } from "../../../store/api/apiError";

type Tab = "meetings" | "members" | "settings";

type Meeting = {
  id: string;
  title: string;
  date: string;
  notesCount: number;
};

type Member = {
  id: string;
  name: string;
  email: string;
  role: "Owner" | "Editor";
  initials: string;
};

// Dummy data until the members/meetings APIs are ready.
const meetings: Meeting[] = [
  { id: "sprint-planning", title: "Sprint planning", date: "Jul 1, 10:00 AM", notesCount: 3 },
  { id: "design-review", title: "Design review", date: "Jun 24, 2:00 PM", notesCount: 4 },
  { id: "kickoff", title: "Kickoff", date: "Jun 10, 9:00 AM", notesCount: 4 },
];

// Dummy data until the members API is ready.
const members: Member[] = [
  { id: "jordan", name: "Jordan Lee", email: "jordan@acme.com", role: "Owner", initials: "JL" },
  { id: "you", name: "You", email: "you@acme.com", role: "Editor", initials: "YO" },
  { id: "priya", name: "Priya Sharma", email: "priya@acme.com", role: "Editor", initials: "PS" },
  { id: "ravi", name: "Ravi Kumar", email: "ravi@acme.com", role: "Editor", initials: "RK" },
];

const TABS: { id: Tab; label: string }[] = [
  { id: "meetings", label: "Meetings" },
  { id: "members", label: "Members" },
  { id: "settings", label: "Settings" },
];

export default function ProjectDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>("meetings");
  const { data: project, isLoading, error } = useGetProjectByIdAsModelQuery(params.id, {
    skip: !params.id,
  });
  const [updateProject, { isLoading: isSaving }] = useUpdateProjectAsModelMutation();
  const [deleteProject, { isLoading: isDeleting }] = useDeleteProjectMutation();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isAddMemberModalOpen, setIsAddMemberModalOpen] = useState(false);
  const [isCreateMeetingModalOpen, setIsCreateMeetingModalOpen] = useState(false);
  const [settingsForm, setSettingsForm] = useState({
    projectName: "",
    projectKey: "",
    description: "",
  });

  useEffect(() => {
    if (error) toast.error(getApiErrorMessage(error));
  }, [error]);

  useEffect(() => {
    if (project) {
      setSettingsForm({
        projectName: project.projectName,
        projectKey: project.projectKey,
        description: project.description,
      });
    }
  }, [project?.projectId]);

  const handleSaveSettings = async () => {
    if (!params.id) return;

    try {
      const updated = await updateProject(params.id, settingsForm);
      toast.success(`Project "${updated.projectName}" updated successfully.`);
    } catch (err) {
      toast.error(getApiErrorMessage(err as FetchBaseQueryError | SerializedError));
    }
  };

  const handleDeleteProject = async () => {
    if (!params.id) return;

    try {
      await deleteProject(params.id).unwrap();
      toast.success("Project deleted successfully.");
      setIsDeleteModalOpen(false);
      router.push("/projects");
    } catch (err) {
      toast.error(getApiErrorMessage(err as FetchBaseQueryError | SerializedError));
    }
  };

  if (isLoading || !project) {
    return (
      <>
        <Navbar />
        <div className="container">
          <div className="dashboard-card">Loading project…</div>
        </div>
      </>
    );
  }

  const visibleTabs = TABS.filter((tab) => tab.id !== "settings" || project.role === "owner");

  return (
    <>
      <Navbar />
      <div className="container">
        <div className="dashboard-card">
          <Link href="/dashboard" className="project-back-link">
            ← All projects
          </Link>

          <div className="project-detail-header">
            <div>
              <h1 className="project-detail-title">{project.projectName}</h1>
              <p className="project-detail-meta">
                {project.projectKey} · {project.description}
              </p>
            </div>
            <div className="project-detail-actions">
            {project.role === "owner" && (
              <>
                <Button onClick={() => setIsAddMemberModalOpen(true)}>Invite member</Button>
              </>
              )}
              <Button type="primary" onClick={() => setIsCreateMeetingModalOpen(true)}>
                + New meeting
              </Button>
            </div>
          </div>

          <div className="project-tabs">
            {visibleTabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                className={`project-tab${activeTab === tab.id ? " active" : ""}`}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {activeTab === "meetings" && (
            <div className="meeting-list">
              {meetings.map((meeting) => (
                <Link
                  key={meeting.id}
                  href={`/projects/${params.id}/meetings/${meeting.id}`}
                  className="meeting-item"
                >
                  <div>
                    <p className="meeting-item-title">{meeting.title}</p>
                    <p className="meeting-item-meta">
                      {meeting.date} · {meeting.notesCount} notes
                    </p>
                  </div>
                  <span className="meeting-item-arrow">→</span>
                </Link>
              ))}
            </div>
          )}

          {activeTab === "members" && (
            <div>
              <div className="members-header">
                <span className="members-count">{members.length} members</span>
                <Button onClick={() => setIsAddMemberModalOpen(true)}>Invite member</Button>
              </div>
              <div className="member-list">
                {members.map((member) => (
                  <div key={member.id} className="member-item">
                    <div className="member-item-left">
                      <span className="member-avatar">{member.initials}</span>
                      <div>
                        <p className="member-name">{member.name}</p>
                        <p className="member-email">{member.email}</p>
                      </div>
                    </div>
                    <span
                      className={`dashboard-role-badge${
                        member.role === "Editor" ? " editor" : ""
                      }`}
                    >
                      {member.role}
                    </span>
                  </div>
                ))}
              </div>
              <p className="members-footer-note">
                Only the owner can invite members or remove them from a project.
              </p>
            </div>
          )}

          {activeTab === "settings" && project.role === "owner" && (
            <div className="settings-form">
              <label className="modal-label" htmlFor="project-name">
                Project name
              </label>
              <Input
                id="project-name"
                value={settingsForm.projectName}
                onChange={(e) =>
                  setSettingsForm((prev) => ({ ...prev, projectName: e.target.value }))
                }
              />

              <div className="modal-field-row">
                <div className="modal-field-col">
                  <label className="modal-label" htmlFor="project-key">
                    Project key
                  </label>
                  <Input
                    id="project-key"
                    value={settingsForm.projectKey}
                    onChange={(e) =>
                      setSettingsForm((prev) => ({ ...prev, projectKey: e.target.value }))
                    }
                  />
                </div>
              </div>

              <label className="modal-label" htmlFor="description">
                Description
              </label>
              <Input.TextArea
                id="description"
                rows={3}
                value={settingsForm.description}
                onChange={(e) =>
                  setSettingsForm((prev) => ({ ...prev, description: e.target.value }))
                }
              />

              <div className="settings-save-row">
                <Button type="primary" loading={isSaving} onClick={handleSaveSettings}>
                  Save changes
                </Button>
              </div>

              <div className="danger-zone">
                <p className="danger-zone-title">Danger zone</p>
                <p className="danger-zone-text">
                  Deleting a project removes all its meetings and notes. This can&apos;t be undone.
                </p>
                <Button danger onClick={() => setIsDeleteModalOpen(true)}>
                  Delete project
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      <ConfirmModal
        open={isDeleteModalOpen}
        title="Delete project"
        message={`Are you sure you want to delete "${project.projectName}"? This can't be undone.`}
        confirmText="Yes, delete"
        danger
        isLoading={isDeleting}
        onConfirm={handleDeleteProject}
        onCancel={() => setIsDeleteModalOpen(false)}
      />

      <AddMemberModal
        open={isAddMemberModalOpen}
        projectId={params.id}
        onClose={() => setIsAddMemberModalOpen(false)}
      />

      <CreateMeetingModal
        open={isCreateMeetingModalOpen}
        onClose={() => setIsCreateMeetingModalOpen(false)}
        onCreate={() => {
          setIsCreateMeetingModalOpen(false);
        }}
      />
    </>
  );
}
