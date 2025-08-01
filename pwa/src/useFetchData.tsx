import { useState, useMemo, useCallback, useRef } from 'react';
import { RequestStatusType } from './types/generic';

export interface FetchOptions extends RequestInit {}

function useFetchData<T = unknown>() {
  const [data, setData] = useState<T>();
  const [url, setUrl] = useState<string | string[]>();
  const [requestStatus, setRequestStatus] = useState<RequestStatusType | undefined>();
  const [requestError, setRequestError] = useState<unknown>(null);
  const inFlightRequests = useRef(new Set<string>());

  // Generate a unique key for a request based on URL and options
  const generateRequestKey = useCallback((apiUrl: string | string[], options: FetchOptions = {}) => {
    const urlString = Array.isArray(apiUrl) ? apiUrl.join('|') : apiUrl;
    const optionsString = JSON.stringify({
      method: options.method || 'GET',
      body: options.body,
      // Include other relevant options that differentiate requests
      headers: options.headers,
    });
    return `${urlString}::${optionsString}`;
  }, []);

  /**
   * Fetch data from one or multiple URLs.
   * If `url` is a string, fetches a single resource.
   * If `url` is a string array, fetches all resources in parallel and returns an array of results.
   */

  const fetchData = useCallback(
    async (apiUrl: string | string[], options: FetchOptions = {}) => {
      setUrl(apiUrl);

      const requestKey = generateRequestKey(apiUrl, options);

      if (inFlightRequests.current.has(requestKey)) {
        return;
      }

      inFlightRequests.current.add(requestKey);

      try {
        setRequestStatus(RequestStatusType.LOADING);

        const fetchOptions = {
          ...options,
          headers: {
            'Access-Control-Allow-Origin': '*',
            // Authorization: `Bearer ${accessToken}`,
          } as Record<string, string>,
        };

        if (!(options.body instanceof FormData)) {
          fetchOptions.headers['Content-Type'] = 'application/json';
        }

        let result;
        if (Array.isArray(apiUrl)) {
          const responses = await Promise.all(apiUrl.map((u) => fetch(u, fetchOptions)));
          const results = await Promise.all(responses.map((res) => res.json()));
          result = results;
        } else {
          const response = await fetch(apiUrl, fetchOptions);
          if (!response.ok) {
            throw new Error(`Error: ${response.status} - ${response.statusText}`);
          }
          result = await response.json();
        }

        setData(result);
        setRequestStatus(RequestStatusType.SUCCESS);
      } catch (error) {
        setRequestStatus(RequestStatusType.FAILURE);
        setRequestError(error);
      } finally {
        inFlightRequests.current.delete(requestKey);
      }
    },
    [generateRequestKey]
  );

  return { fetchData, data, requestStatus, requestError, setData, url };
}
export default useFetchData;
