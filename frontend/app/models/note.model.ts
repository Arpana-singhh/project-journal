// Raw shape of a single note's author, as populated by the Express API
// (see backend/controller/noteController.js, which populates authorId with
// 'name email avatar' on every note-returning endpoint).
export type RawNoteAuthor = {
  _id: string;
  name: string;
  email: string;
  avatar: string;
};

// Raw shape of a single note object as returned by the Express API.
// Nothing outside the service layer should ever touch this type directly.
export type RawNote = {
  meetingId: string;
  projectId: string;
  authorId: RawNoteAuthor;
  content: string;
  createdAt: string;
  updatedAt: string;
  noteId: string;
};

// The project/meeting summaries returned alongside notes - same for every
// note in a GetNotesList response, so the API sends them once at the top
// level instead of repeating them inside each note.
export type RawNoteProjectSummary = {
  projectName: string;
  projectKey: string;
  description?: string;
};

export type RawNoteMeetingSummary = {
  title: string;
  meetingDateTime: string;
  notesCount: number;
};

export type GetNotesListApiResponse = {
  success: boolean;
  message: string;
  data: {
    project: RawNoteProjectSummary;
    meeting: RawNoteMeetingSummary;
    notes: RawNote[];
  };
};

export type CreateNoteApiResponse = {
  success: boolean;
  message: string;
  note: RawNote;
};

export type UpdateNoteApiResponse = {
  success: boolean;
  message: string;
  note: RawNote;
};

export type CreateNotePayload = {
  content: string;
};

export type UpdateNotePayload = {
  content: string;
};

export class NoteModel {
  noteId: string;
  meetingId: string;
  projectId: string;
  author: {
    id: string;
    name: string;
    email: string;
    avatar: string;
  };
  content: string;
  createdAt: Date;
  updatedAt: Date;

  constructor(raw: RawNote) {
    this.noteId = raw.noteId;
    this.meetingId = raw.meetingId;
    this.projectId = raw.projectId;
    this.author = {
      id: raw.authorId._id,
      name: raw.authorId.name,
      email: raw.authorId.email,
      avatar: raw.authorId.avatar,
    };
    this.content = raw.content;
    this.createdAt = new Date(raw.createdAt);
    this.updatedAt = new Date(raw.updatedAt);
  }

  static fromApi(raw: RawNote): NoteModel {
    return new NoteModel(raw);
  }

  static fromApiList(rawList: RawNote[]): NoteModel[] {
    return (rawList ?? []).map((raw) => NoteModel.fromApi(raw));
  }

  // Shape used by the note card UI (meeting notes page). `currentUserId` is
  // compared against the author to decide whether the card belongs to the
  // logged-in user ("mine").
  toCard(currentUserId: string) {
    return {
      id: this.noteId,
      authorName: this.author.name,
      avatar: this.author.avatar,
      initials: this.author.name
        .split(" ")
        .filter(Boolean)
        .map((part) => part[0])
        .slice(0, 2)
        .join("")
        .toUpperCase(),
      text: this.content,
      mine: this.author.id === currentUserId,
    };
  }
}

// Wraps the project/meeting summaries the API sends once alongside notes
// (see GetNotesListApiResponse) together with the converted NoteModel(s),
// so `project`/`meeting` aren't duplicated onto every single note instance.
export class NoteMeetingModel {
  project: {
    projectName: string;
    projectKey: string;
    description: string;
  };
  meeting: {
    title: string;
    meetingDateTime: Date;
    notesCount: number;
  };
  notes: NoteModel[];

  constructor(
    project: RawNoteProjectSummary,
    meeting: RawNoteMeetingSummary,
    rawNotes: RawNote[]
  ) {
    this.project = {
      projectName: project.projectName,
      projectKey: project.projectKey,
      description: project.description ?? "",
    };
    this.meeting = {
      title: meeting.title,
      meetingDateTime: new Date(meeting.meetingDateTime),
      notesCount: meeting.notesCount,
    };
    this.notes = NoteModel.fromApiList(rawNotes);
  }

  // Use for GetNotesListApiResponse - project + meeting + a list of notes.
  static fromApiList(
    project: RawNoteProjectSummary,
    meeting: RawNoteMeetingSummary,
    rawNotes: RawNote[]
  ): NoteMeetingModel {
    return new NoteMeetingModel(project, meeting, rawNotes);
  }
}
