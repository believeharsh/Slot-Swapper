import { useCallback, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from './useRedux';
import {
  fetchMyEvents,
  fetchEventById,
  createEvent,
  updateEvent,
  deleteEvent,
  clearError,
  clearSelectedEvent,
  setSelectedEvent,
} from '../store/slices/eventSlice';
import type { CreateEventData, UpdateEventData, Event } from '../types/index';

export const useEvents = () => {
  const dispatch = useAppDispatch();
  const { events, selectedEvent, isLoading, error } = useAppSelector((state) => state.events);

  const handleFetchMyEvents = useCallback(async () => {
    const result = await dispatch(fetchMyEvents());
    return result;
  }, [dispatch]);

  const handleFetchEventById = useCallback(
    async (id: string) => {
      const result = await dispatch(fetchEventById(id));
      return result;
    },
    [dispatch]
  );

  const handleCreateEvent = useCallback(
    async (data: CreateEventData) => {
      const result = await dispatch(createEvent(data));
      return result;
    },
    [dispatch]
  );

  const handleUpdateEvent = useCallback(
    async (id: string, data: UpdateEventData) => {
      const result = await dispatch(updateEvent({ id, data }));
      return result;
    },
    [dispatch]
  );

  const handleDeleteEvent = useCallback(
    async (id: string) => {
      const result = await dispatch(deleteEvent(id));
      return result;
    },
    [dispatch]
  );

  const handleClearError = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  const handleClearSelectedEvent = useCallback(() => {
    dispatch(clearSelectedEvent());
  }, [dispatch]);

  const handleSetSelectedEvent = useCallback(
    (event: Event | null) => {
      dispatch(setSelectedEvent(event));
    },
    [dispatch]
  );

  // Auto-fetch events on mount
  useEffect(() => {
    handleFetchMyEvents();
  }, []);

  return {
    events,
    selectedEvent,
    isLoading,
    error,
    fetchMyEvents: handleFetchMyEvents,
    fetchEventById: handleFetchEventById,
    createEvent: handleCreateEvent,
    updateEvent: handleUpdateEvent,
    deleteEvent: handleDeleteEvent,
    clearError: handleClearError,
    clearSelectedEvent: handleClearSelectedEvent,
    setSelectedEvent: handleSetSelectedEvent,
  };
};