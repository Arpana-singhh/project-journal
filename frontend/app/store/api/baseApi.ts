import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Single RTK Query API slice for the whole app. Feature files (projectsApi.ts,
// invitesApi.ts, ...) extend this via injectEndpoints instead of creating
// their own createApi, so everything shares one cache/reducer/middleware.
export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({ baseUrl: "/api/backend" }),
  tagTypes: ["Project", "Meeting", "Member", "Note"],
  endpoints: () => ({}),
});
