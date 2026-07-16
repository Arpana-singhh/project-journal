import { baseApi } from "./baseApi";
import apiRoutes from "@/config/apiRoutes";

type CreateInviteLinkApiResponse = {
  success: boolean;
  message: string;
  inviteLink: string;
};

type CreateInviteLinkPayload = {
  projectId: string;
  expiresInDays?: number;
  maxMembers?: number;
};

type ProjectMember = {
  projectMemberId: string;
  projectId: string;
  memberId: string;
  role: "owner" | "editor";
  joinedAt: string;
};

type AcceptInviteApiResponse = {
  success: boolean;
  message: string;
  member: ProjectMember;
};

export const invitesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createInviteLink: builder.mutation<string, CreateInviteLinkPayload>({
      query: ({ projectId, ...body }) => ({
        url: apiRoutes.invites.create(projectId),
        method: "POST",
        body,
      }),
      transformResponse: (response: CreateInviteLinkApiResponse) => response.inviteLink,
      // Creating a link makes the owner a member (memberCount goes to 1) -
      // refresh this project's own cache so the "Add member" UI updates.
      invalidatesTags: (result, error, { projectId }) => [{ type: "Project" as const, id: projectId }],
    }),
    acceptInvite: builder.mutation<ProjectMember, string>({
      query: (token) => ({
        url: apiRoutes.invites.accept(token),
        method: "POST",
      }),
      transformResponse: (response: AcceptInviteApiResponse) => response.member,
      invalidatesTags: (result) =>
        result ? [{ type: "Project" as const, id: result.projectId }] : [],
    }),
  }),
  overrideExisting: process.env.NODE_ENV === "development",
});

export const { useCreateInviteLinkMutation, useAcceptInviteMutation } = invitesApi;
