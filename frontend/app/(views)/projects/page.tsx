"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "react-toastify";
import { FiPlus, FiUsers } from "react-icons/fi";
import Navbar from "../../components/Navbar";
import CreateProjectModal from "../../components/CreateProjectModal";
import { ProjectService } from "../../service/api/project.services";
import { ProjectModel } from "../../models/project.model";

export default function ProjectsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [projects, setProjects] = useState<ProjectModel[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadProjects = async () => {
    try {
      const data = await ProjectService.getAllProjects();
      setProjects(data);
    } catch (err) {
      toast.error((err as { message?: string })?.message || "Could not load projects.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const ownedCount = projects.filter((p) => p.role === "owner").length;
  const joinedCount = projects.length - ownedCount;

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
            {!isLoading &&
              projects.map((project) => {
                const card = project.toCard();
                return (
                  <Link
                    key={card.id}
                    href={`/projects/${card.id}`}
                    className="dashboard-project-card"
                  >
                    <div className="dashboard-project-card-top">
                      <h2 className="dashboard-project-name">{card.title}</h2>
                      <span
                        className={`dashboard-role-badge${
                          card.role === "editor" ? " editor" : ""
                        }`}
                      >
                        {card.role === "owner" ? "Owner" : "Editor"}
                      </span>
                    </div>
                    <p className="dashboard-project-meta">{card.subtitle}</p>
                    <div className="dashboard-project-footer">
                      {card.memberCount === 0 && card.role === "owner" ? (
                        <button
                          type="button"
                          className="dashboard-add-member-btn"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                          }}
                        >
                          <FiPlus /> Add member
                        </button>
                      ) : (
                        <span>
                          <FiUsers /> {card.memberCount} members
                        </span>
                      )}
                      <span>
                        Last:{" "}
                        {card.updatedAt.toLocaleDateString(undefined, {
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                    </div>
                  </Link>
                );
              })}
          </div>
        </div>
      </div>

      <CreateProjectModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreate={() => {
          setIsModalOpen(false);
          loadProjects();
        }}
      />
    </>
  );
}
