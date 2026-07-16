"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Button, Input } from "antd";
import { toast } from "react-toastify";
import { FiEdit2, FiTrash2 } from "react-icons/fi";
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
import {
  useGetMeetingsListAsModelQuery,
  useDeleteMeetingAsModelMutation,
} from "../../../store/api/meetingsApi";
import { useGetProjectMembersAsModelsQuery } from "../../../store/api/invitesApi";
import { getApiErrorMessage } from "../../../store/api/apiError";
import type { MeetingModel } from "../../../models/meeting.model";

type Tab = "meetings" | "members" | "settings";

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
  const {
    data: meetingsData,
    isLoading: isMeetingsLoading,
    error: meetingsError,
  } = useGetMeetingsListAsModelQuery(params.id, {
    skip: !params.id,
  });
  const {
    data: membersData,
    isLoading: isMembersLoading,
    error: membersError,
  } = useGetProjectMembersAsModelsQuery(params.id, { skip: !params.id });
  const [updateProject, { isLoading: isSaving }] = useUpdateProjectAsModelMutation();
  const [deleteProject, { isLoading: isDeleting }] = useDeleteProjectMutation();
  const [deleteMeeting, { isLoading: isDeletingMeeting }] = useDeleteMeetingAsModelMutation();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isAddMemberModalOpen, setIsAddMemberModalOpen] = useState(false);
  const [isCreateMeetingModalOpen, setIsCreateMeetingModalOpen] = useState(false);
  const [editingMeeting, setEditingMeeting] = useState<MeetingModel | null>(null);
  const [meetingPendingDelete, setMeetingPendingDelete] = useState<MeetingModel | null>(null);
  const [settingsForm, setSettingsForm] = useState({
    projectName: "",
    projectKey: "",
    description: "",
  });

  useEffect(() => {
    if (error) toast.error(getApiErrorMessage(error));
  }, [error]);

  useEffect(() => {
    if (meetingsError) toast.error(getApiErrorMessage(meetingsError));
  }, [meetingsError]);

  useEffect(() => {
    if (membersError) toast.error(getApiErrorMessage(membersError));
  }, [membersError]);

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

  const handleDeleteMeeting = async () => {
    if (!meetingPendingDelete) return;

    try {
      await deleteMeeting(meetingPendingDelete.meetingId, meetingPendingDelete.projectId);
      toast.success("Meeting deleted successfully.");
      setMeetingPendingDelete(null);
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
          <Link href="/projects" className="project-back-link">
            ← All projects
          </Link>

          <div className="project-detail-header">
            <div>
              <h1 className="project-detail-title">{meetingsData?.project.projectName}</h1>
              <p className="project-detail-meta">
                {meetingsData?.project.projectKey} · {meetingsData?.project.description}
              </p>
            </div>
            <div className="project-detail-actions">
            {project.role === "owner" && (
              <>
                <Button onClick={() => setIsAddMemberModalOpen(true)}>Invite member</Button>
              </>
              )}
              <Button
                type="primary"
                onClick={() => {
                  setEditingMeeting(null);
                  setIsCreateMeetingModalOpen(true);
                }}
              >
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
              {isMeetingsLoading && <p className="members-footer-note">Loading meetings…</p>}

              {!isMeetingsLoading && (meetingsData?.meetings.length ?? 0) === 0 && (
                <p className="members-footer-note">No meetings yet.</p>
              )}

              {(meetingsData?.meetings ?? []).map((meeting) => {
                const { id, title, date, notesCount } = meeting.toListItem();
                return (
                  <div key={id} className="meeting-item">
                    <Link
                      href={`/projects/${params.id}/meetings/${id}`}
                      className="meeting-item-link"
                    >
                      <p className="meeting-item-title">{title}</p>
                      <p className="meeting-item-meta">
                        {date} · {notesCount} notes
                      </p>
                    </Link>
                    <div className="meeting-item-actions">
                      <Button
                        type="text"
                        size="small"
                        icon={<FiEdit2 />}
                        onClick={() => {
                          setEditingMeeting(meeting);
                          setIsCreateMeetingModalOpen(true);
                        }}
                      />
                      <Button
                        type="text"
                        size="small"
                        danger
                        icon={<FiTrash2 />}
                        onClick={() => setMeetingPendingDelete(meeting)}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {activeTab === "members" && (
            <div>
              <div className="members-header">
                <span className="members-count">{membersData?.length ?? 0} members</span>
              </div>

              {isMembersLoading && <p className="members-footer-note">Loading members…</p>}

              {!isMembersLoading && (membersData?.length ?? 0) === 0 && (
                <p className="members-footer-note">No members yet.</p>
              )}

              {!isMembersLoading && (membersData?.length ?? 0) > 0 && (
                <div className="member-list">
                  {membersData!.map((member) => {
                    const { id, name, email, role, initials } = member.toListItem();
                    return (
                      <div key={id} className="member-item">
                        <div className="member-item-left">
                          <span className="member-avatar">{initials}</span>
                          <div>
                            <p className="member-name">{name}</p>
                            <p className="member-email">{email}</p>
                          </div>
                        </div>
                        <span
                          className={`dashboard-role-badge${role === "Editor" ? " editor" : ""}`}
                        >
                          {role}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}

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
        projectId={params.id}
        meeting={editingMeeting ?? undefined}
        onClose={() => setIsCreateMeetingModalOpen(false)}
        onSaved={() => setIsCreateMeetingModalOpen(false)}
      />

      <ConfirmModal
        open={!!meetingPendingDelete}
        title="Delete meeting"
        message={`Are you sure you want to delete "${meetingPendingDelete?.title}"? This can't be undone.`}
        confirmText="Yes, delete"
        danger
        isLoading={isDeletingMeeting}
        onConfirm={handleDeleteMeeting}
        onCancel={() => setMeetingPendingDelete(null)}
      />
    </>
  );
}
