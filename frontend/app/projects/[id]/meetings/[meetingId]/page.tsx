"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Button } from "antd";
import Navbar from "../../../../components/Navbar";

type Note = {
  id: string;
  authorName: string;
  initials: string;
  role: string;
  text: string;
  mine: boolean;
};

type MeetingRecord = {
  title: string;
  date: string;
  notes: Note[];
};

const project = {
  name: "Acme website revamp",
};

const meetingsById: Record<string, MeetingRecord> = {
  "sprint-planning": {
    title: "Sprint planning",
    date: "Jul 1, 10:00 AM",
    notes: [
      {
        id: "note-1",
        authorName: "You",
        initials: "YO",
        role: "Editable",
        mine: true,
        text: "Discussed homepage redesign timeline. Need final assets from design by Thursday.",
      },
      {
        id: "note-2",
        authorName: "Priya Sharma",
        initials: "PS",
        role: "Editor",
        mine: false,
        text: "Backend API for checkout is ready for review. Blocked on staging credentials from ops.",
      },
      {
        id: "note-3",
        authorName: "Jordan Lee",
        initials: "JL",
        role: "Owner",
        mine: false,
        text: "Client approved the new palette. Moving forward with dark mode as a stretch goal.",
      },
    ],
  },
  "design-review": {
    title: "Design review",
    date: "Jun 24, 2:00 PM",
    notes: [
      {
        id: "note-1",
        authorName: "You",
        initials: "YO",
        role: "Editable",
        mine: true,
        text: "Walked through the new component library. A few spacing tweaks needed on cards.",
      },
      {
        id: "note-2",
        authorName: "Priya Sharma",
        initials: "PS",
        role: "Editor",
        mine: false,
        text: "Mobile nav still needs a design pass before dev starts.",
      },
      {
        id: "note-3",
        authorName: "Ravi Kumar",
        initials: "RK",
        role: "Editor",
        mine: false,
        text: "Shared the updated icon set in the shared drive.",
      },
      {
        id: "note-4",
        authorName: "Jordan Lee",
        initials: "JL",
        role: "Owner",
        mine: false,
        text: "Approved the revised layout for the pricing page.",
      },
    ],
  },
  kickoff: {
    title: "Kickoff",
    date: "Jun 10, 9:00 AM",
    notes: [
      {
        id: "note-1",
        authorName: "You",
        initials: "YO",
        role: "Editable",
        mine: true,
        text: "Introduced the team and reviewed the project timeline with the client.",
      },
      {
        id: "note-2",
        authorName: "Priya Sharma",
        initials: "PS",
        role: "Editor",
        mine: false,
        text: "Confirmed tech stack and repo access for the engineering team.",
      },
      {
        id: "note-3",
        authorName: "Ravi Kumar",
        initials: "RK",
        role: "Editor",
        mine: false,
        text: "Set up the shared design and content trackers.",
      },
      {
        id: "note-4",
        authorName: "Jordan Lee",
        initials: "JL",
        role: "Owner",
        mine: false,
        text: "Aligned on success metrics for the Q3 launch.",
      },
    ],
  },
};

export default function MeetingNotesPage() {
  const params = useParams<{ id: string; meetingId: string }>();
  const meeting = meetingsById[params.meetingId];
  const [notes, setNotes] = useState<Note[]>(meeting?.notes ?? []);

  const handleTextChange = (noteId: string, text: string) => {
    setNotes((prev) => prev.map((n) => (n.id === noteId ? { ...n, text } : n)));
  };

  const handleDelete = (noteId: string) => {
    setNotes((prev) => prev.filter((n) => n.id !== noteId));
  };

  if (!meeting) {
    return (
      <>
        <Navbar />
        <div className="container">
          <p className="coming-soon">Meeting not found</p>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="container">
        <div className="dashboard-card">
          <div className="meeting-notes-top">
            <Link href={`/projects/${params.id}`} className="project-back-link">
              ← {project.name}
            </Link>
            <Link href={`/projects/${params.id}`} className="meeting-notes-all-link">
              All meetings
            </Link>
          </div>

          <h1 className="project-detail-title">
            {meeting.title} · {meeting.date}
          </h1>

          <div className="note-list">
            {notes.map((note) =>
              note.mine ? (
                <div key={note.id} className="note-card mine">
                  <div className="note-card-header">
                    <div className="note-author">
                      <span className="member-avatar">{note.initials}</span>
                      <span className="note-author-name">{note.authorName}</span>
                      <span className="note-editable-badge">{note.role}</span>
                    </div>
                    <div className="note-actions">
                      <Button type="link" size="small">
                        Edit
                      </Button>
                      <Button
                        type="link"
                        size="small"
                        danger
                        onClick={() => handleDelete(note.id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                  <textarea
                    className="note-textarea"
                    value={note.text}
                    onChange={(e) => handleTextChange(note.id, e.target.value)}
                    rows={2}
                  />
                </div>
              ) : (
                <div key={note.id} className="note-card">
                  <div className="note-card-header">
                    <div className="note-author">
                      <span className="member-avatar">{note.initials}</span>
                      <span className="note-author-name">{note.authorName}</span>
                      <span className="note-role-text">{note.role}</span>
                    </div>
                  </div>
                  <p className="note-text">{note.text}</p>
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </>
  );
}
