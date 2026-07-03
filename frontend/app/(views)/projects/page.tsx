"use client";

import { useState } from "react";
import Link from "next/link";
import Navbar from "../../components/Navbar";
import CreateProjectModal from "../../components/CreateProjectModal";

type Project = {
  id: string;
  name: string;
  key: string;
  organization: string;
  role: "Owner" | "Editor";
  members: number;
  lastUpdated: string;
};

const projects: Project[] = [
  {
    id: "acme-web",
    name: "Acme website revamp",
    key: "ACME-WEB",
    organization: "Acme Corp",
    role: "Owner",
    members: 4,
    lastUpdated: "Jul 1",
  },
  {
    id: "mobile",
    name: "Mobile app sprint",
    key: "MOBILE",
    organization: "Northwind Inc",
    role: "Owner",
    members: 6,
    lastUpdated: "Jun 29",
  },
  {
    id: "onboard",
    name: "Client onboarding flow",
    key: "ONBOARD",
    organization: "Fenwick Ltd",
    role: "Editor",
    members: 3,
    lastUpdated: "Jun 27",
  },
];

const ownedCount = projects.filter((p) => p.role === "Owner").length;
const joinedCount = projects.length - ownedCount;

export default function ProjectsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <Navbar />
      <div className="container">
        <div className="dashboard-card">
          <div className="dashboard-header">
            <div>
              <h1 className="dashboard-title">Your projects</h1>
              <p className="dashboard-subtitle">
                {projects.length} projects — {ownedCount} owned, {joinedCount} joined
              </p>
            </div>
            <button
              type="button"
              className="dashboard-new-btn"
              onClick={() => setIsModalOpen(true)}
            >
              + New project
            </button>
          </div>

          <div className="dashboard-project-grid">
            {projects.map((project) => (
              <Link
                key={project.id}
                href={`/projects/${project.id}`}
                className="dashboard-project-card"
              >
                <div className="dashboard-project-card-top">
                  <h2 className="dashboard-project-name">{project.name}</h2>
                  <span
                    className={`dashboard-role-badge${
                      project.role === "Editor" ? " editor" : ""
                    }`}
                  >
                    {project.role}
                  </span>
                </div>
                <p className="dashboard-project-meta">
                  {project.key} · {project.organization}
                </p>
                <div className="dashboard-project-footer">
                  <span>{project.members} members</span>
                  <span>Last: {project.lastUpdated}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      <CreateProjectModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreate={() => setIsModalOpen(false)}
      />
    </>
  );
}
