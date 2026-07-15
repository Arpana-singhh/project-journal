import { baseApi } from "./baseApi";
import apiRoutes from "@/config/apiRoutes";
import {
  ProjectModel,
  type CreateProjectApiResponse,
  type CreateProjectPayload,
  type GetAllProjectsApiResponse,
  type GetProjectByIdApiResponse,
  type RawProject,
  type UpdateProjectApiResponse,
  type UpdateProjectPayload,
} from "../../models/project.model";

export const projectsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Keep the store holding plain, serializable RawProject JSON - Redux
    // flags class instances (ProjectModel has Date fields/methods) as
    // non-serializable if stored directly. Convert to ProjectModel where it's
    // consumed (in the component) instead.
    getAllProjects: builder.query<RawProject[], void>({
      query: () => apiRoutes.projects.list,
      transformResponse: (response: GetAllProjectsApiResponse) => response.projects,
      providesTags: (result) =>
        result
          ? [
              ...result.map((project) => ({ type: "Project" as const, id: project.projectId })),
              { type: "Project" as const, id: "LIST" },
            ]
          : [{ type: "Project" as const, id: "LIST" }],
    }),

    getProjectById: builder.query<RawProject, string>({
      query: (projectId) => apiRoutes.projects.getById(projectId),
      transformResponse: (response: GetProjectByIdApiResponse) => response.project,
      providesTags: (result, error, projectId) => [{ type: "Project" as const, id: projectId }],
    }),

    createProject: builder.mutation<RawProject, CreateProjectPayload>({
      query: (payload) => ({
        url: apiRoutes.projects.create,
        method: "POST",
        body: payload,
      }),
      transformResponse: (response: CreateProjectApiResponse) => response.project,
      // The list's cache no longer matches once a new project exists - refetch it.
      invalidatesTags: [{ type: "Project" as const, id: "LIST" }],
    }),

    updateProject: builder.mutation<RawProject, { projectId: string; payload: UpdateProjectPayload }>({
      query: ({ projectId, payload }) => ({
        url: apiRoutes.projects.getById(projectId),
        method: "PUT",
        body: payload,
      }),
      transformResponse: (response: UpdateProjectApiResponse) => response.project,
      // Invalidate both this project's own cache entry and the list, since
      // projectName/projectKey shown in the list card can also change.
      invalidatesTags: (result, error, { projectId }) => [
        { type: "Project" as const, id: projectId },
        { type: "Project" as const, id: "LIST" },
      ],
    }),

    deleteProject: builder.mutation<void, string>({
      query: (projectId) => ({
        url: apiRoutes.projects.getById(projectId),
        method: "DELETE",
      }),
      // Only invalidate the list, not the deleted project's own tag - a
      // still-mounted detail page (mid-navigation-away) would otherwise
      // refetch a project that no longer exists and surface a 404 toast.
      invalidatesTags: [{ type: "Project" as const, id: "LIST" }],
    }),
  }),
  // Fast Refresh re-evaluates this module on save, re-running injectEndpoints
  // against the same shared `baseApi` - harmless in dev, so allow the override
  // there; keep it strict (default false) in production.
  overrideExisting: process.env.NODE_ENV === "development",
});

export const {
  useGetAllProjectsQuery,
  useGetProjectByIdQuery,
  useCreateProjectMutation,
  useUpdateProjectMutation,
  useDeleteProjectMutation,
} = projectsApi;

// Wraps useGetAllProjectsQuery so components only ever see ProjectModel,
// never the raw store shape.
export function useGetAllProjectsAsModelsQuery() {
  return projectsApi.useGetAllProjectsQuery(undefined, {
    selectFromResult: ({ data, ...rest }) => ({
      data: data ? ProjectModel.fromApiList(data) : undefined,
      ...rest,
    }),
  });
}

// Same wrapping for a single project - see useGetAllProjectsAsModelsQuery above.
export function useGetProjectByIdAsModelQuery(projectId: string, options?: { skip?: boolean }) {
  return projectsApi.useGetProjectByIdQuery(projectId, {
    ...options,
    selectFromResult: ({ data, ...rest }) => ({
      data: data ? ProjectModel.fromApi(data) : undefined,
      ...rest,
    }),
  });
}

// Mutations don't return their payload through `data` the way queries do -
// components call the trigger function directly and use its resolved value,
// so the ProjectModel conversion wraps the trigger itself instead of the result.
export function useCreateProjectAsModelMutation() {
  const [trigger, result] = projectsApi.useCreateProjectMutation();

  const createProject = async (payload: CreateProjectPayload) => {
    const raw = await trigger(payload).unwrap();
    return ProjectModel.fromApi(raw);
  };

  return [createProject, result] as const;
}

// Same trigger-wrapping as useCreateProjectAsModelMutation above.
export function useUpdateProjectAsModelMutation() {
  const [trigger, result] = projectsApi.useUpdateProjectMutation();

  const updateProject = async (projectId: string, payload: UpdateProjectPayload) => {
    const raw = await trigger({ projectId, payload }).unwrap();
    return ProjectModel.fromApi(raw);
  };

  return [updateProject, result] as const;
}
