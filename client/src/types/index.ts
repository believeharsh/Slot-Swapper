// ============================================
// USER & AUTH TYPES
// ============================================

export interface User {
  _id: string;
  name: string;
  email: string;
  createdAt: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupCredentials {
  name: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  message?: string;
  data: {
    user: User;
    token: string;
  };
}

// ============================================
// EVENT TYPES
// ============================================

// Use const object instead of enum (Vite compatible)
export const EventStatus = {
  BUSY: 'BUSY',
  SWAPPABLE: 'SWAPPABLE',
  SWAP_PENDING: 'SWAP_PENDING'
} as const;

// Type from the const object
export type EventStatus = typeof EventStatus[keyof typeof EventStatus];

export interface Event {
  _id: string;
  title: string;
  startTime: string;
  endTime: string;
  status: EventStatus;
  userId: string | User;
  createdAt: string;
  updatedAt: string;
}

export interface EventState {
  events: Event[];
  selectedEvent: Event | null;
  isLoading: boolean;
  error: string | null;
}

export interface CreateEventData {
  title: string;
  startTime: string;
  endTime: string;
}

export interface UpdateEventData {
  title?: string;
  startTime?: string;
  endTime?: string;
  status?: EventStatus;
}

// ============================================
// SWAP TYPES
// ============================================

// Use const object instead of enum (Vite compatible)
export const SwapRequestStatus = {
  PENDING: 'PENDING',
  ACCEPTED: 'ACCEPTED',
  REJECTED: 'REJECTED'
} as const;

// Type from the const object
export type SwapRequestStatus = typeof SwapRequestStatus[keyof typeof SwapRequestStatus];

export interface SwapRequest {
  message: any;
  _id: string;
  requesterId: User;
  requesterSlotId: Event;
  targetUserId: User;
  targetSlotId: Event;
  status: SwapRequestStatus;
  createdAt: string;
  updatedAt: string;
}

export interface SwapState {
  swappableSlots: Event[];
  incomingRequests: SwapRequest[];
  outgoingRequests: SwapRequest[];
  isLoading: boolean;
  error: string | null;
}

export interface CreateSwapRequestData {
  mySlotId: string;
  theirSlotId: string;
  message: string
}

export interface SwapResponseData {
  accepted: boolean;
}

// ============================================
// API RESPONSE TYPES
// ============================================

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
  count?: number;
}

// ============================================
// UI TYPES
// ============================================

export interface ToastNotification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  duration?: number;
}