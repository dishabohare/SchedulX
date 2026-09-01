// Centralized Axios API instance prepared for Spring Boot backend integration
// Interceptors automatically append Authorization: Bearer <JWT_TOKEN>

// Note: Using standard fetch / mock setup for demo, but structured for easy axios client drop-in
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

export const getAuthToken = (): string | null => {
  return localStorage.getItem('schedulex_token');
};

export const createApiHeaders = (): Record<string, string> => {
  const token = getAuthToken();
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

export const apiConfig = {
  baseURL: API_BASE_URL,
  getHeaders: createApiHeaders,
};
