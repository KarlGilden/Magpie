type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

type ContentType = 'application/json' | 'multipart/form-data' | 'application/x-www-form-urlencoded';

export interface FetchConfig {
  path: string;
  method?: HttpMethod;
  contentType?: ContentType;
  baseURL?: string;
  body?: unknown;
  headers?: Record<string, string>;
}

/**
 * Creates a fetch function that can be used as queryFn or mutationFn for React Query
 * @param config - Configuration object with path, method, contentType, and baseURL
 * @returns A function that can be used with useQuery or useMutation
 */
export const useFetch = () => {
  return async <T>({ 
    path, 
    method = 'GET', 
    contentType = 'application/json', 
    body, 
    headers: additionalHeaders 
  }: FetchConfig) => {
    
    const includeContentType = !!body && contentType !== 'multipart/form-data';

    const fetchPath = buildUrl(path);
    const fetchHeaders: Record<string, string> = {...additionalHeaders};
    // Only set Content-Type if body exists and not multipart/form-data
    if (includeContentType) {
        fetchHeaders['Content-Type'] = contentType;
    }

    const fetchOptions: RequestInit = {
      method,
      headers: fetchHeaders,
    };

    // Only include body if it exists
    if (body) {
      if (contentType === 'application/json') {
        fetchOptions.body = JSON.stringify(body);
      } else if (contentType === 'multipart/form-data') {
        // For FormData, let the browser set Content-Type with boundary
        fetchOptions.body = body as FormData;
      } else {
        fetchOptions.body = body as BodyInit;
      }
    }

    const response = await fetch(fetchPath, fetchOptions);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: response.statusText }));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    // Handle different response types
    const contentTypeHeader = response.headers.get('content-type');
    if (contentTypeHeader?.includes('application/json')) {
      return await response.json();
    }

    return await response.text();
  };
};

const buildUrl = (path: string) => {
    return import.meta.env.VITE_API_URL + path;
};
