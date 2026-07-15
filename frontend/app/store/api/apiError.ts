import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import type { SerializedError } from "@reduxjs/toolkit";

// RTK Query errors come in one of two shapes depending on where they failed:
// FetchBaseQueryError (the request went out, e.g. a 4xx/5xx or network failure)
// or SerializedError (something threw before/after the request itself).
// This pulls the backend's own `message` out when available, matching what
// the Axios interceptor already surfaces for non-RTK-Query calls.
export function getApiErrorMessage(
  error: FetchBaseQueryError | SerializedError | undefined
): string {
  if (!error) return "";

  if ("status" in error) {
    const data = error.data as { message?: string } | undefined;
    if (data?.message) return data.message;

    if (typeof error.status === "number") {
      return `Request failed with status ${error.status}`;
    }

    return "No response from server. Please check your connection.";
  }

  return error.message || "Unexpected error occurred.";
}
