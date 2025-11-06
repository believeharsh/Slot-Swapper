import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from './useRedux';
import {
  fetchSwappableSlots,
  createSwapRequest,
  fetchIncomingRequests,
  fetchOutgoingRequests,
  respondToSwapRequest,
  clearError,
  clearSwappableSlots,
} from '../store/slices/swapSlice';
import type { CreateSwapRequestData } from '../types';

export const useSwaps = () => {
  const dispatch = useAppDispatch();
  const { swappableSlots, incomingRequests, outgoingRequests, isLoading, error } = useAppSelector(
    (state) => state.swap
  );

  const handleFetchSwappableSlots = useCallback(async () => {
    const result = await dispatch(fetchSwappableSlots());
    return result;
  }, [dispatch]);

  const handleCreateSwapRequest = useCallback(
    async (data: CreateSwapRequestData) => {
      const result = await dispatch(createSwapRequest(data));
      return result;
    },
    [dispatch]
  );

  const handleFetchIncomingRequests = useCallback(async () => {
    const result = await dispatch(fetchIncomingRequests());
    return result;
  }, [dispatch]);

  const handleFetchOutgoingRequests = useCallback(async () => {
    const result = await dispatch(fetchOutgoingRequests());
    return result;
  }, [dispatch]);

  const handleRespondToSwapRequest = useCallback(
    async (requestId: string, accepted: boolean) => {
      const result = await dispatch(respondToSwapRequest({ requestId, accepted }));
      return result;
    },
    [dispatch]
  );

  const handleClearError = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  const handleClearSwappableSlots = useCallback(() => {
    dispatch(clearSwappableSlots());
  }, [dispatch]);

  return {
    swappableSlots,
    incomingRequests,
    outgoingRequests,
    isLoading,
    error,
    fetchSwappableSlots: handleFetchSwappableSlots,
    createSwapRequest: handleCreateSwapRequest,
    fetchIncomingRequests: handleFetchIncomingRequests,
    fetchOutgoingRequests: handleFetchOutgoingRequests,
    respondToSwapRequest: handleRespondToSwapRequest,
    clearError: handleClearError,
    clearSwappableSlots: handleClearSwappableSlots,
  };
};