import axios from "axios";

// Server-side callers (e.g. NextAuth's `authorize()`) talk to Express directly
// using the private API_BASE_URL. Browser callers must never know that URL,
// so they always go through the same-origin `/api/backend` proxy instead,
// which attaches the backend Authorization header for them server-side.
const isServer = typeof window === "undefined";

const apiClient = axios.create({
  baseURL: isServer
    ? process.env.API_BASE_URL || "http://localhost:5000/api"
    : "/api/backend",
  headers: { Accept: "application/json" },
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const { status, data } = error.response;

      if (status === 401) {
        // handle unauthenticated access (e.g. redirect to login)
      }

      return Promise.reject({
        success: false,
        status,
        message: data?.message || "Something went wrong. Please try again.",
      });
    }

    if (error.request) {
      return Promise.reject({
        success: false,
        status: null,
        message: "No response from server. Please check your connection.",
      });
    }

    return Promise.reject({
      success: false,
      status: null,
      message: error.message || "Unexpected error occurred.",
    });
  }
);

export default apiClient;
