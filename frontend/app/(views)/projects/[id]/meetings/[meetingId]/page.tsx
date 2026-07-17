"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { Button } from "antd";
import { toast } from "react-toastify";
import { FiEdit2, FiTrash2 } from "react-icons/fi";
import DOMPurify from "dompurify";
import Navbar from "../../../../../components/Navbar";
import ConfirmModal from "../../../../../components/ConfirmModal";
import RichTextEditor from "../../../../../components/RichTextEditor";
import {
  useGetNotesListAsModelQuery,
  useCreateNoteMutation,
  useUpdateNoteMutation,
  useDeleteNoteMutation,
} from "../../../../../store/api/notesApi";
import { getApiErrorMessage } from "../../../../../store/api/apiError";

// Quill's empty state is "<p><br></p>", not "" - .trim() alone can't tell
// that apart from real content, so strip tags first.
const isEmptyNote = (html: string) => !html.replace(/<[^>]*>/g, "").trim();

export default function MeetingNotesPage() {
  const params = useParams<{ id: string; meetingId: string }>();
  const { data: session } = useSession();
  const currentUserId = session?.user?.id;

  const {
    data: notesData,
    isLoading,
    error,
  } = useGetNotesListAsModelQuery(params.meetingId, { skip: !params.meetingId });
  const [createNote, { isLoading: isCreating }] = useCreateNoteMutation();
  const [updateNote, { isLoading: isUpdating }] = useUpdateNoteMutation();
  const [deleteNote, { isLoading: isDeleting }] = useDeleteNoteMutation();

  const [draftContent, setDraftContent] = useState("");
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState("");
  const [notePendingDelete, setNotePendingDelete] = useState<string | null>(null);

  useEffect(() => {
    if (error) toast.error(getApiErrorMessage(error));
  }, [error]);

  const notes = (notesData?.notes.map((note) => note.toCard(currentUserId ?? "")) ?? []).sort(
    (a, b) => Number(b.mine) - Number(a.mine)
  );
  const hasOwnNote = notes.some((note) => note.mine);

  const handleAddNote = async () => {
    if (isEmptyNote(draftContent) || !params.meetingId) return;

    try {
      await createNote({ meetingId: params.meetingId, payload: { content: draftContent } }).unwrap();
      setDraftContent("");
      toast.success("Note added successfully.");
    } catch (err) {
      toast.error(getApiErrorMessage(err as Parameters<typeof getApiErrorMessage>[0]));
    }
  };

  const handleStartEdit = (noteId: string, currentText: string) => {
    setEditingNoteId(noteId);
    setEditContent(currentText);
  };

  const handleSaveEdit = async () => {
    if (!editingNoteId || isEmptyNote(editContent)) return;

    try {
      await updateNote({
        noteId: editingNoteId,
        meetingId: params.meetingId,
        payload: { content: editContent },
      }).unwrap();
      setEditingNoteId(null);
      toast.success("Note updated successfully.");
    } catch (err) {
      toast.error(getApiErrorMessage(err as Parameters<typeof getApiErrorMessage>[0]));
    }
  };

  const handleDeleteNote = async () => {
    if (!notePendingDelete) return;

    try {
      await deleteNote({ noteId: notePendingDelete, meetingId: params.meetingId }).unwrap();
      toast.success("Note deleted successfully.");
      setNotePendingDelete(null);
    } catch (err) {
      toast.error(getApiErrorMessage(err as Parameters<typeof getApiErrorMessage>[0]));
    }
  };

  if (isLoading || !notesData) {
    return (
      <>
        <Navbar />
        <div className="container">
          <div className="dashboard-card">Loading notes…</div>
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
              ← {notesData.project.projectName}
            </Link>
            <Link href={`/projects/${params.id}`} className="meeting-notes-all-link">
              All meetings
            </Link>
          </div>

          <h1 className="project-detail-title">
            {notesData.meeting.title} ·{" "}
            {notesData.meeting.meetingDateTime.toLocaleString(undefined, {
              month: "short",
              day: "numeric",
              hour: "numeric",
              minute: "2-digit",
            })}
          </h1>

          <div className="note-list">
            {notes.map((note) => {
              const isEditing = editingNoteId === note.id;

              return (
                <div key={note.id} className={`note-card${note.mine ? " mine" : ""}`}>
                  <div className="note-card-header">
                    <div className="note-author">
                      <span className="member-avatar">{note.initials}</span>
                      <span className="note-author-name">{note.authorName}</span>
                      {note.mine && <span className="note-editable-badge">You</span>}
                    </div>
                    {note.mine && !isEditing && (
                      <div className="note-actions">
                        <Button
                          type="text"
                          size="small"
                          icon={<FiEdit2 />}
                          onClick={() => handleStartEdit(note.id, note.text)}
                        />
                        <Button
                          type="text"
                          size="small"
                          danger
                          icon={<FiTrash2 />}
                          onClick={() => setNotePendingDelete(note.id)}
                        />
                      </div>
                    )}
                  </div>

                  {isEditing ? (
                    <>
                      <RichTextEditor value={editContent} onChange={setEditContent} />
                      <div className="modal-actions">
                        <Button size="small" onClick={() => setEditingNoteId(null)}>
                          Cancel
                        </Button>
                        <Button
                          type="primary"
                          size="small"
                          loading={isUpdating}
                          disabled={isEmptyNote(editContent)}
                          onClick={handleSaveEdit}
                        >
                          Save
                        </Button>
                      </div>
                    </>
                  ) : (
                    <div
                      className="note-text"
                      dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(note.text) }}
                    />
                  )}
                </div>
              );
            })}

            {notes.length === 0 && <p className="members-footer-note">No notes yet.</p>}

            {!hasOwnNote && (
              <div className="note-card mine">
                <div className="note-card-header">
                  <div className="note-author">
                    <span className="note-author-name">Add your note</span>
                  </div>
                </div>
                <RichTextEditor
                  value={draftContent}
                  onChange={setDraftContent}
                  placeholder="What happened in this meeting, from your side?"
                />
                <div className="modal-actions">
                  <Button
                    type="primary"
                    loading={isCreating}
                    disabled={isEmptyNote(draftContent)}
                    onClick={handleAddNote}
                  >
                    Add note
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <ConfirmModal
        open={!!notePendingDelete}
        title="Delete note"
        message="Are you sure you want to delete this note? This can't be undone."
        confirmText="Yes, delete"
        danger
        isLoading={isDeleting}
        onConfirm={handleDeleteNote}
        onCancel={() => setNotePendingDelete(null)}
      />
    </>
  );
}
