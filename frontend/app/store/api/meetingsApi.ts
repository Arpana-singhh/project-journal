import { baseApi } from "./baseApi";
import apiRoutes from "@/config/apiRoutes";
import {
  MeetingProjectModel,
  type CreateMeetingApiResponse,
  type CreateMeetingPayload,
  type GetMeetingsApiResponse,
  type RawMeeting,
  type RawMeetingProjectSummary,
  type UpdateMeetingApiResponse,
  type UpdateMeetingPayload,
} from "../../models/meeting.model";

// Keep the store holding plain, serializable {project, meeting(s)} JSON -
// Redux flags class instances (MeetingModel/MeetingProjectModel have Date
// fields/methods) as non-serializable if stored directly. Convert to
// MeetingProjectModel where it's consumed (in the component) instead.
type RawMeetingWithProject = {
  project: RawMeetingProjectSummary;
  meeting: RawMeeting;
};

type RawMeetingsListWithProject = {
  project: RawMeetingProjectSummary;
  meetings: RawMeeting[];
};

export const meetingsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getMeetingsList: builder.query<RawMeetingsListWithProject, string>({
      query: (projectId) => apiRoutes.meetings.list(projectId),
      transformResponse: (response: GetMeetingsApiResponse) => ({
        project: response.project,
        meetings: response.meetings,
      }),
      providesTags: (result, error, projectId) => [{ type: "Meeting" as const, id: projectId }],
    }),

    createMeeting: builder.mutation<
      RawMeetingWithProject,
      { projectId: string; payload: CreateMeetingPayload }
    >({
      query: ({ projectId, payload }) => ({
        url: apiRoutes.meetings.create(projectId),
        method: "POST",
        body: payload,
      }),
      transformResponse: (response: CreateMeetingApiResponse) => ({
        project: response.project,
        meeting: response.meeting,
      }),
      invalidatesTags: (result, error, { projectId }) => [{ type: "Meeting" as const, id: projectId }],
    }),

    updateMeeting: builder.mutation<
      RawMeetingWithProject,
      { meetingId: string; projectId: string; payload: UpdateMeetingPayload }
    >({
      query: ({ meetingId, payload }) => ({
        url: apiRoutes.meetings.update(meetingId),
        method: "PUT",
        body: payload,
      }),
      transformResponse: (response: UpdateMeetingApiResponse) => ({
        project: response.project,
        meeting: response.meeting,
      }),
      invalidatesTags: (result, error, { projectId }) => [{ type: "Meeting" as const, id: projectId }],
    }),

    deleteMeeting: builder.mutation<void, { meetingId: string; projectId: string }>({
      query: ({ meetingId }) => ({
        url: apiRoutes.meetings.delete(meetingId),
        method: "DELETE",
      }),
      invalidatesTags: (result, error, { projectId }) => [{ type: "Meeting" as const, id: projectId }],
    }),
  }),
  // Fast Refresh re-evaluates this module on save, re-running injectEndpoints
  // against the same shared `baseApi` - harmless in dev, so allow the override
  // there; keep it strict (default false) in production.
  overrideExisting: process.env.NODE_ENV === "development",
});

export const {
  useGetMeetingsListQuery,
  useCreateMeetingMutation,
  useUpdateMeetingMutation,
  useDeleteMeetingMutation,
} = meetingsApi;

// Wraps useGetMeetingsListQuery so components only ever see
// MeetingProjectModel, never the raw store shape.
export function useGetMeetingsListAsModelQuery(projectId: string, options?: { skip?: boolean }) {
  return meetingsApi.useGetMeetingsListQuery(projectId, {
    ...options,
    selectFromResult: ({ data, ...rest }) => ({
      data: data ? MeetingProjectModel.fromApiList(data.project, data.meetings) : undefined,
      ...rest,
    }),
  });
}

// Mutations don't return their payload through `data` the way queries do -
// components call the trigger function directly and use its resolved value,
// so the MeetingProjectModel conversion wraps the trigger itself instead of
// the result.
export function useCreateMeetingAsModelMutation() {
  const [trigger, result] = meetingsApi.useCreateMeetingMutation();

  const createMeeting = async (projectId: string, payload: CreateMeetingPayload) => {
    const raw = await trigger({ projectId, payload }).unwrap();
    return MeetingProjectModel.fromApi(raw.project, raw.meeting);
  };

  return [createMeeting, result] as const;
}

// Same trigger-wrapping as useCreateMeetingAsModelMutation above.
export function useUpdateMeetingAsModelMutation() {
  const [trigger, result] = meetingsApi.useUpdateMeetingMutation();

  const updateMeeting = async (
    meetingId: string,
    projectId: string,
    payload: UpdateMeetingPayload
  ) => {
    const raw = await trigger({ meetingId, projectId, payload }).unwrap();
    return MeetingProjectModel.fromApi(raw.project, raw.meeting);
  };

  return [updateMeeting, result] as const;
}

export function useDeleteMeetingAsModelMutation() {
  const [trigger, result] = meetingsApi.useDeleteMeetingMutation();

  const deleteMeeting = async (meetingId: string, projectId: string) => {
    await trigger({ meetingId, projectId }).unwrap();
  };

  return [deleteMeeting, result] as const;
}
