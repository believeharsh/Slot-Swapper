import axios, { type AxiosInstance, AxiosError, type InternalAxiosRequestConfig } from 'axios';
import type {
    AuthResponse,
    LoginCredentials,
    SignupCredentials,
    Event,
    CreateEventData,
    UpdateEventData,
    SwapRequest,
    CreateSwapRequestData,
    SwapResponseData,
    ApiResponse,
    User
} from '../types/index';

// Create axios instance
const api: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 seconds
});

// Request interceptor - Add token to requests
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle errors globally
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiResponse>) => {
    // Handle 401 Unauthorized - token expired or invalid
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }

    // Extract error message
    const message = 
      error.response?.data?.error || 
      error.response?.data?.message ||
      error.message ||
      'An error occurred';

    return Promise.reject(new Error(message));
  }
);

// ============================================
// AUTH API
// ============================================

export const authAPI = {
  signup: async (credentials: SignupCredentials): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/signup', credentials);
    return response.data;
  },

  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/login', credentials);
    return response.data;
  },

  getMe: async (): Promise<ApiResponse<User>> => {
    const response = await api.get<ApiResponse<User>>('/auth/me');
    return response.data;
  },
};

// ============================================
// EVENT API
// ============================================

export const eventAPI = {
  getMyEvents: async (): Promise<ApiResponse<Event[]>> => {
    const response = await api.get<ApiResponse<Event[]>>('/events');
    return response.data;
  },

  getEventById: async (id: string): Promise<ApiResponse<Event>> => {
    const response = await api.get<ApiResponse<Event>>(`/events/${id}`);
    return response.data;
  },

  createEvent: async (data: CreateEventData): Promise<ApiResponse<Event>> => {
    const response = await api.post<ApiResponse<Event>>('/events', data);
    return response.data;
  },

  updateEvent: async (id: string, data: UpdateEventData): Promise<ApiResponse<Event>> => {
    const response = await api.put<ApiResponse<Event>>(`/events/${id}`, data);
    return response.data;
  },

  deleteEvent: async (id: string): Promise<ApiResponse> => {
    const response = await api.delete<ApiResponse>(`/events/${id}`);
    return response.data;
  },
};

// ============================================
// SWAP API
// ============================================

export const swapAPI = {
  getSwappableSlots: async (): Promise<ApiResponse<Event[]>> => {
    const response = await api.get<ApiResponse<Event[]>>('/swappable-slots');
    return response.data;
  },

  createSwapRequest: async (data: CreateSwapRequestData): Promise<ApiResponse<SwapRequest>> => {
    const response = await api.post<ApiResponse<SwapRequest>>('/swap-request', data);
    return response.data;
  },

  getIncomingRequests: async (): Promise<ApiResponse<SwapRequest[]>> => {
    const response = await api.get<ApiResponse<SwapRequest[]>>('/swap-requests/incoming');
    return response.data;
  },

  getOutgoingRequests: async (): Promise<ApiResponse<SwapRequest[]>> => {
    const response = await api.get<ApiResponse<SwapRequest[]>>('/swap-requests/outgoing');
    return response.data;
  },

  respondToSwapRequest: async (requestId: string, data: SwapResponseData): Promise<ApiResponse<SwapRequest>> => {
    const response = await api.post<ApiResponse<SwapRequest>>(`/swap-response/${requestId}`, data);
    return response.data;
  },
};

export default api;