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
  }),
  overrideExisting: process.env.NODE_ENV === "development",
});

export const { useCreateInviteLinkMutation } = invitesApi;
