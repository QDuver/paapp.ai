import { useCallback, useRef, useState } from "react";
import { getFirebaseAuth } from "../services/Firebase";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { FetchOptions, RequestStatusType } from "../models/Shared";
import { getBaseUrl } from "../utils/utils";

// Base URL configuration with environment-based settings

function useApi<T = unknown>(skipAuth: boolean = false) {
  const baseApi = getBaseUrl();
  const [data, setData] = useState<T>();
  const [status, setStatus] = useState<RequestStatusType | undefined>();
  const inFlight = useRef(false);

  const showError = useCallback((message: string): void => {
    // Alert.alert('Error', message, [
    //   { text: 'OK', onPress: () => setRequestError(null) }
    // ]);
  }, []);

  const getAuthHeaders = useCallback(async (): Promise<Record<string, string>> => {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (skipAuth) {
      // Use hardcoded token when skipAuth is true
      headers["Authorization"] = "Bearer umileigiudber2rbzjguipjfys23";
      return headers;
    }

    const auth = getFirebaseAuth();
    if (auth?.currentUser) {
      const token = await auth.currentUser.getIdToken();
      headers["Authorization"] = `Bearer ${token}`;
    }

    return headers;
  }, [skipAuth]);

  const main = useCallback(
    async (endpoint: string, options: FetchOptions = {}) => {
      const url = endpoint.startsWith("http") ? endpoint : `${baseApi}/${endpoint}`;

      if (inFlight.current) return;
      inFlight.current = true;

      try {
        setStatus(RequestStatusType.LOADING);
        const authHeaders = await getAuthHeaders();

        const fetchOptions = {
          ...options,
          headers: {
            ...authHeaders,
            "Access-Control-Allow-Origin": "*",
            ...options.headers,
          } as Record<string, string>,
        };

        if (options.body && !(options.body instanceof FormData)) {
          fetchOptions.headers["Content-Type"] = "application/json";
        }

        const response = await fetch(url, fetchOptions);

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

        const result = await response.json();
        setData(result);
        setStatus(RequestStatusType.SUCCESS);
        return result;
      } catch (error: any) {
        setStatus(RequestStatusType.FAILURE);
        console.error("API FETCH ERROR:", url, error);

        // Handle specific error cases
        if (error.message?.includes("Failed to fetch") || error.message?.includes("Network request failed")) {
          showError("Network Error: Unable to connect to server");
        } else if (error.message?.includes("timeout")) {
          showError("Request timeout - please try again");
        } else {
          showError(error.message || "An unexpected error occurred");
        }

        throw error;
      } finally {
        inFlight.current = false;
      }
    },
    [baseApi, getAuthHeaders, showError]
  );

  // Helper methods for different HTTP verbs
  const get = useCallback((endpoint: string) => main(endpoint, { method: "GET" }), [main]);

  const post = useCallback(
    (endpoint: string, body?: any) =>
      main(endpoint, {
        method: "POST",
        body: body ? JSON.stringify(body) : undefined,
      }),
    [main]
  );

  const put = useCallback(
    (endpoint: string, body?: any) =>
      main(endpoint, {
        method: "PUT",
        body: body ? JSON.stringify(body) : undefined,
      }),
    [main]
  );

  const del = useCallback((endpoint: string) => main(endpoint, { method: "DELETE" }), [main]);

  return {
    get,
    post,
    put,
    delete: del,
    data,
    status,
    setStatus,
  };
}
export default useApi;
