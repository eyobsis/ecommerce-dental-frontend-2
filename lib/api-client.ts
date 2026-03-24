import { env } from "@/config/env";

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}
export const defaultHeaders = {
  "Content-Type": "application/json",
};

export const apiClient = async <T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> => {
  const isFormData = options.body instanceof FormData;
  const isJsonBody = options.body && !(options.body instanceof FormData);

  // Define headers, depending on whether we're sending FormData or JSON
  const headers: HeadersInit = isFormData
    ? options.headers || {} // Don't set Content-Type for FormData (browser handles it)
    : {
        ...defaultHeaders,
        ...(options.headers || {}),
      };
  console.log("headers sending ", headers);

  console.log("Current cookies:", document.cookie);
  // If body is JSON, stringify it
  if (isJsonBody && options.body) {
    options.body = JSON.stringify(options.body);
  }

  try {
    const res = await fetch(`${env.baseUrl}${endpoint}`, {
      ...options,
      headers,
      credentials: "include",
    });

    if (!res.ok) {
      const error = await res.json();
      throw new ApiError(error.message || "API request failed", res.status);
    }

    // Return the response as JSON (assuming response is JSON)
    return res.json();
  } catch (error) {
    // Handle any errors that may occur during the request
    throw new Error(
      error instanceof Error ? error.message : "API request failed",
    );
  }
};
