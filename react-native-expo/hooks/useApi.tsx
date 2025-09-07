import { useCallback, useRef, useState } from "react";
import { Alert, Platform } from 'react-native';
import { getAuth } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FetchOptions, RequestStatusType } from "../models/Shared";
import { DEV_CONFIG, PROD_CONFIG } from '../config/env';

// Base URL configuration with environment-based settings
const getBaseUrl = (): string => {
  if (__DEV__) {
    // Development mode
    if (Platform.OS === 'web') {
      return `http://localhost:${DEV_CONFIG.LOCAL_PORT}`;
    } else {
      // For mobile devices (both iOS and Android), use the computer's IP
      return `http://${DEV_CONFIG.LOCAL_IP}:${DEV_CONFIG.LOCAL_PORT}`;
    }
  } else {
    // Production mode
    return PROD_CONFIG.API_URL;
  }
};

function useApi<T = unknown>() {
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
      'Content-Type': 'application/json',
    };

    try {
      // Get Firebase Auth token
      const auth = getAuth();
      if (auth.currentUser) {
        const token = await auth.currentUser.getIdToken();
        headers['Authorization'] = `Bearer ${token}`;
      }

      // Get user ID from AsyncStorage for additional context
      const userId = await AsyncStorage.getItem('userId');
      if (userId) {
        headers['X-User-ID'] = userId;
      }
    } catch (error) {
      console.warn('Failed to get auth headers:', error);
      // Continue without auth headers rather than failing
    }

    return headers;
  }, []);

  const main = useCallback(
    async (endpoint: string, options: FetchOptions = {}) => {
      const url = endpoint.startsWith('http') ? endpoint : `${baseApi}/${endpoint}`;
      
      if (inFlight.current) return;
      inFlight.current = true;
      
      try {
        setStatus(RequestStatusType.LOADING);
        const authHeaders = await getAuthHeaders();

        const fetchOptions = {
          ...options,
          headers: {
            ...authHeaders,
            'Access-Control-Allow-Origin': '*',
            ...options.headers,
          } as Record<string, string>,
        };

        if (options.body && !(options.body instanceof FormData)) {
          fetchOptions.headers['Content-Type'] = 'application/json';
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
        console.error('API FETCH ERROR:', url, error);
        
        // Handle specific error cases
        if (error.message?.includes('Failed to fetch') || error.message?.includes('Network request failed')) {
          showError('Network Error: Unable to connect to server');
        } else if (error.message?.includes('timeout')) {
          showError('Request timeout - please try again');
        } else {
          showError(error.message || 'An unexpected error occurred');
        }
        
        throw error;
      } finally {
        inFlight.current = false;
      }
    },
    [baseApi, getAuthHeaders, showError]
  );

  // Helper methods for different HTTP verbs
  const get = useCallback((endpoint: string) => 
    main(endpoint, { method: 'GET' }), [main]);

  const post = useCallback((endpoint: string, body?: any) => 
    main(endpoint, { 
      method: 'POST', 
      body: body ? JSON.stringify(body) : undefined 
    }), [main]);

  const put = useCallback((endpoint: string, body?: any) => 
    main(endpoint, { 
      method: 'PUT', 
      body: body ? JSON.stringify(body) : undefined 
    }), [main]);

  const del = useCallback((endpoint: string) => 
    main(endpoint, { method: 'DELETE' }), [main]);

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
