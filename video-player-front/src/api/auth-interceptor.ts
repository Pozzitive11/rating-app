import { env } from "@/config/env";
import { tokenUtils } from "@/features/auth/utils/token.utils";

const API_BASE_URL = env.API_BASE_URL;

export interface ApiClientOptions extends RequestInit {
  skipAuth?: boolean; // Option to skip adding auth token
}

/**
 * Custom fetch wrapper that automatically adds Bearer token to requests
 */
export const apiClient = async (
  endpoint: string,
  options: ApiClientOptions = {}
): Promise<Response> => {
  const {
    skipAuth = false,
    headers = {},
    ...restOptions
  } = options;

  // Build headers
  const requestHeaders: HeadersInit = {
    "Content-Type": "application/json",
    ...headers,
  };

  // Add Bearer token if available and not skipped
  if (!skipAuth) {
    const token = tokenUtils.getAccessToken();
    if (token) {
      (
        requestHeaders as Record<string, string>
      ).Authorization = `Bearer ${token}`;
    }
  }

  // Make the request
  const response = await fetch(
    `${API_BASE_URL}${endpoint}`,
    {
      ...restOptions,
      headers: requestHeaders,
    }
  );

  // Handle 401 Unauthorized - token might be expired
  if (response.status === 401 && !skipAuth) {
    // Optionally: handle token refresh or redirect to login
    tokenUtils.clearTokens();
    // You might want to redirect to login page here
    // window.location.href = '/login';
  }

  return response;
};

/**
 * Helper function for GET requests
 */
export const apiGet = async <T>(
  endpoint: string,
  options?: ApiClientOptions
): Promise<T> => {
  const response = await apiClient(endpoint, {
    ...options,
    method: "GET",
  });

  if (!response.ok) {
    const errorData = await response
      .json()
      .catch(() => ({}));
    throw new Error(
      errorData.message ||
        `Request failed: ${response.statusText}`
    );
  }

  return response.json();
};

/**
 * Helper function for POST requests
 */
export const apiPost = async <T>(
  endpoint: string,
  data?: unknown,
  options?: ApiClientOptions
): Promise<T> => {
  const response = await apiClient(endpoint, {
    ...options,
    method: "POST",
    body: data ? JSON.stringify(data) : undefined,
  });

  if (!response.ok) {
    const errorData = await response
      .json()
      .catch(() => ({}));
    throw new Error(
      errorData.message ||
        `Request failed: ${response.statusText}`
    );
  }

  return response.json();
};

/**
 * Helper function for PUT requests
 */
export const apiPut = async <T>(
  endpoint: string,
  data?: unknown,
  options?: ApiClientOptions
): Promise<T> => {
  const response = await apiClient(endpoint, {
    ...options,
    method: "PUT",
    body: data ? JSON.stringify(data) : undefined,
  });

  if (!response.ok) {
    const errorData = await response
      .json()
      .catch(() => ({}));
    throw new Error(
      errorData.message ||
        `Request failed: ${response.statusText}`
    );
  }

  return response.json();
};

/**
 * Helper function for DELETE requests
 */
export const apiDelete = async <T>(
  endpoint: string,
  options?: ApiClientOptions
): Promise<T> => {
  const response = await apiClient(endpoint, {
    ...options,
    method: "DELETE",
  });

  if (!response.ok) {
    const errorData = await response
      .json()
      .catch(() => ({}));
    throw new Error(
      errorData.message ||
        `Request failed: ${response.statusText}`
    );
  }

  return response.json();
};
