import axios from "axios";

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000/api",
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
