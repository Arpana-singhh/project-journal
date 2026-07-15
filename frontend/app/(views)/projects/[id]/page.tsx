"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Button, Input } from "antd";
import { toast } from "react-toastify";
import Navbar from "../../../components/Navbar";
import { ProjectService } from "../../../service/api/project.services";
import { ProjectModel } from "../../../models/project.model";

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
  const [activeTab, setActiveTab] = useState<Tab>("meetings");
  const [project, setProject] = useState<ProjectModel | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadProject = async () => {
    if (!params.id) return;

    try {
      const data = await ProjectService.getProjectById(params.id);
      setProject(data);
    } catch (err) {
      toast.error((err as { message?: string })?.message || "Could not load project.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadProject();
  }, [params.id]);

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
                <Button>Invite member</Button>
              </>
              )}
              <Button type="primary">+ New meeting</Button>
            </div>
          </div>

          <div className="project-tabs">
            {TABS.map((tab) => (
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
                <Button>Invite member</Button>
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

          {activeTab === "settings" && (
            <div className="settings-form">
              <label className="modal-label" htmlFor="project-name">
                Project name
              </label>
              <Input id="project-name" defaultValue={project.projectName} />

              <div className="modal-field-row">
                <div className="modal-field-col">
                  <label className="modal-label" htmlFor="project-key">
                    Project key
                  </label>
                  <Input id="project-key" defaultValue={project.projectKey} />
                </div>
              </div>

              <label className="modal-label" htmlFor="description">
                Description
              </label>
              <Input.TextArea
                id="description"
                rows={3}
                defaultValue={project.description}
              />

              <div className="settings-save-row">
                <Button type="primary">Save changes</Button>
              </div>

              <div className="danger-zone">
                <p className="danger-zone-title">Danger zone</p>
                <p className="danger-zone-text">
                  Deleting a project removes all its meetings and notes. This can&apos;t be undone.
                </p>
                <Button danger>Delete project</Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
