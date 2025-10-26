import { getFirebaseAuth } from "../services/Firebase";
import { FetchOptions } from "../models/Shared";
import { getBaseUrl } from "./utils";

interface ApiClientOptions {
  onError?: (error: Error) => void;
  silent?: boolean;
}

async function getAuthHeaders(): Promise<Record<string, string>> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  const auth = getFirebaseAuth();
  if (auth?.currentUser) {
    try {
      const token = await auth.currentUser.getIdToken();
      headers["Authorization"] = `Bearer ${token}`;
    } catch (error) {
      console.error("[AUTH] Failed to get ID token:", error);
    }
  } else {
    console.warn("[AUTH] No currentUser available when making API request");
  }

  return headers;
}

async function request<T = unknown>(endpoint: string, options: FetchOptions & ApiClientOptions = {}): Promise<T | null> {
  const baseApi = await getBaseUrl();
  const url = endpoint.startsWith("http") ? endpoint : `${baseApi}/${endpoint}`;
  const { onError, silent = false, ...fetchOptions } = options;

  try {
    const authHeaders = await getAuthHeaders();

    const finalOptions: RequestInit = {
      ...fetchOptions,
      headers: {
        ...authHeaders,
        ...fetchOptions.headers,
      } as Record<string, string>,
    };

    if (fetchOptions.body && !(fetchOptions.body instanceof FormData)) {
      (finalOptions.headers as Record<string, string>)["Content-Type"] = "application/json";
    }

    const response = await fetch(url, finalOptions);

    if (!response.ok) {
      let errorMessage = `Error: ${response.status} - ${response.statusText}`;
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorMessage;
      } catch {
        // Use default error message if JSON parsing fails
      }
      throw new Error(errorMessage);
    }

    return await response.json();
  } catch (error: any) {
    if (!silent) {
      console.error("API Request Failed:", url, error.message || error);
    }

    if (onError) {
      onError(error);
    }

    return null;
  }
}

export const apiClient = {
  get: <T = unknown>(endpoint: string, options?: ApiClientOptions): Promise<T | null> =>
    request<T>(endpoint, { ...options, method: "GET" }),

  post: <T = unknown>(endpoint: string, body?: any, options?: ApiClientOptions): Promise<T | null> =>
    request<T>(endpoint, {
      ...options,
      method: "POST",
      body: body ? JSON.stringify(body) : undefined,
    }),

  put: <T = unknown>(endpoint: string, body?: any, options?: ApiClientOptions): Promise<T | null> =>
    request<T>(endpoint, {
      ...options,
      method: "PUT",
      body: body ? JSON.stringify(body) : undefined,
    }),

  delete: <T = unknown>(endpoint: string, options?: ApiClientOptions): Promise<T | null> =>
    request<T>(endpoint, { ...options, method: "DELETE" }),
};
