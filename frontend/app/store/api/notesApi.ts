import { baseApi } from "./baseApi";
import apiRoutes from "@/config/apiRoutes";
import {
  NoteMeetingModel,
  type CreateNoteApiResponse,
  type CreateNotePayload,
  type GetNotesListApiResponse,
  type RawNote,
  type RawNoteMeetingSummary,
  type RawNoteProjectSummary,
  type UpdateNoteApiResponse,
  type UpdateNotePayload,
} from "../../models/note.model";

// Keep the store holding plain, serializable {project, meeting, notes} JSON -
// Redux flags class instances (NoteModel/NoteMeetingModel have Date
// fields/methods) as non-serializable if stored directly. Convert to
// NoteMeetingModel where it's consumed (in the component) instead.
type RawNotesListWithContext = {
  project: RawNoteProjectSummary;
  meeting: RawNoteMeetingSummary;
  notes: RawNote[];
};

export const notesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getNotesList: builder.query<RawNotesListWithContext, string>({
      query: (meetingId) => apiRoutes.notes.list(meetingId),
      transformResponse: (response: GetNotesListApiResponse) => response.data,
      providesTags: (result, error, meetingId) => [{ type: "Note" as const, id: meetingId }],
    }),

    createNote: builder.mutation<RawNote, { meetingId: string; payload: CreateNotePayload }>({
      query: ({ meetingId, payload }) => ({
        url: apiRoutes.notes.create(meetingId),
        method: "POST",
        body: payload,
      }),
      transformResponse: (response: CreateNoteApiResponse) => response.note,
      invalidatesTags: (result, error, { meetingId }) => [{ type: "Note" as const, id: meetingId }],
    }),

    updateNote: builder.mutation<
      RawNote,
      { noteId: string; meetingId: string; payload: UpdateNotePayload }
    >({
      query: ({ noteId, payload }) => ({
        url: apiRoutes.notes.update(noteId),
        method: "PUT",
        body: payload,
      }),
      transformResponse: (response: UpdateNoteApiResponse) => response.note,
      invalidatesTags: (result, error, { meetingId }) => [{ type: "Note" as const, id: meetingId }],
    }),

    deleteNote: builder.mutation<void, { noteId: string; meetingId: string }>({
      query: ({ noteId }) => ({
        url: apiRoutes.notes.delete(noteId),
        method: "DELETE",
      }),
      invalidatesTags: (result, error, { meetingId }) => [{ type: "Note" as const, id: meetingId }],
    }),
  }),
  // Fast Refresh re-evaluates this module on save, re-running injectEndpoints
  // against the same shared `baseApi` - harmless in dev, so allow the override
  // there; keep it strict (default false) in production.
  overrideExisting: process.env.NODE_ENV === "development",
});

export const {
  useGetNotesListQuery,
  useCreateNoteMutation,
  useUpdateNoteMutation,
  useDeleteNoteMutation,
} = notesApi;

// Wraps useGetNotesListQuery so components only ever see NoteMeetingModel,
// never the raw store shape.
export function useGetNotesListAsModelQuery(meetingId: string, options?: { skip?: boolean }) {
  return notesApi.useGetNotesListQuery(meetingId, {
    ...options,
    selectFromResult: ({ data, ...rest }) => ({
      data: data ? NoteMeetingModel.fromApiList(data.project, data.meeting, data.notes) : undefined,
      ...rest,
    }),
  });
}
