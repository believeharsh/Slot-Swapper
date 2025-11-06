import { Request } from 'express';
import { Document, Types } from 'mongoose';

// ============================================
// USER TYPES
// ============================================

export interface IUser extends Document {
  _id: Types.ObjectId;
  name: string;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

export interface IUserResponse {
  _id: string;
  name: string;
  email: string;
  createdAt: Date;
}

// ============================================
// EVENT TYPES
// ============================================

export enum EventStatus {
  BUSY = 'BUSY',
  SWAPPABLE = 'SWAPPABLE',
  SWAP_PENDING = 'SWAP_PENDING'
}

export interface IEvent extends Document {
  _id: Types.ObjectId;
  title: string;
  startTime: Date;
  endTime: Date;
  status: EventStatus;
  userId: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export interface IEventResponse {
  _id: string;
  title: string;
  startTime: Date;
  endTime: Date;
  status: EventStatus;
  userId: string;
  owner?: IUserResponse;
  createdAt: Date;
  updatedAt: Date;
}

// ============================================
// SWAP REQUEST TYPES
// ============================================

export enum SwapRequestStatus {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED'
}

export interface ISwapRequest extends Document {
  _id: Types.ObjectId;
  requesterId: Types.ObjectId;
  requesterSlotId: Types.ObjectId;
  targetUserId: Types.ObjectId;
  targetSlotId: Types.ObjectId;
  status: SwapRequestStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface ISwapRequestResponse {
  _id: string;
  requester: IUserResponse;
  requesterSlot: IEventResponse;
  targetUser: IUserResponse;
  targetSlot: IEventResponse;
  status: SwapRequestStatus;
  createdAt: Date;
  updatedAt: Date;
}

// ============================================
// REQUEST TYPES
// ============================================

export interface AuthRequest extends Request {
  user?: {
    userId: string;
    email: string;
  };
}

// ============================================
// API RESPONSE TYPES
// ============================================

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}