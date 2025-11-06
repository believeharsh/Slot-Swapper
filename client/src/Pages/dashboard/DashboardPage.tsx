// src/pages/Dashboard/DashboardPage.tsx
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../../store/index';
import {
  fetchMyEvents,
  createEvent,
  updateEvent,
  deleteEvent,
  setSelectedEvent,
  clearSelectedEvent,
} from '../../store/slices/eventSlice';
import type { CreateEventData, UpdateEventData, Event } from '../../types';
import { EventStatus } from '../../types';

const DashboardPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { events, isLoading, selectedEvent, error } = useSelector(
    (state: RootState) => state.events
  );

  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');

  // Fetch events on mount
  useEffect(() => {
    dispatch(fetchMyEvents());
  }, [dispatch]);

  // Open modal for new or edit
  const openModal = (event?: Event) => {
    if (event) {
      dispatch(setSelectedEvent(event));
      setTitle(event.title);
      setStartTime(event.startTime.slice(0, 16)); // convert ISO to local input format
      setEndTime(event.endTime.slice(0, 16));
    } else {
      dispatch(clearSelectedEvent());
      setTitle('');
      setStartTime('');
      setEndTime('');
    }
    setShowModal(true);
  };

  // Submit form (create or update)
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (selectedEvent) {
      const data: UpdateEventData = { title, startTime, endTime };
      dispatch(updateEvent({ id: selectedEvent._id, data }));
    } else {
      const data: CreateEventData = { title, startTime, endTime };
      dispatch(createEvent(data));
    }

    setShowModal(false);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this event?')) {
      dispatch(deleteEvent(id));
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">My Events</h2>
        <button
          onClick={() => openModal()}
          className="px-4 py-2 rounded-md font-medium"
          style={{
            background: 'var(--color-primary-500)',
            color: 'white',
          }}
        >
          + Create Event
        </button>
      </div>

      {/* Loading state */}
      {isLoading && <p>Loading events...</p>}

      {/* Error */}
      {error && (
        <div
          className="p-2 rounded-md text-sm"
          style={{ background: 'var(--color-bg-error)', color: 'var(--color-error)' }}
        >
          {error}
        </div>
      )}

      {/* Events list */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {events.length === 0 && !isLoading ? (
          <p className="text-sm text-[var(--color-text-secondary)]">No events yet. Create one!</p>
        ) : (
          events.map((event) => (
            <div
              key={event._id}
              className="p-4 rounded-lg shadow-md flex flex-col justify-between"
              style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--color-border)',
              }}
            >
              <div>
                <h3 className="text-lg font-medium mb-1">{event.title}</h3>
                <p className="text-sm text-[var(--color-text-secondary)]">
                  {new Date(event.startTime).toLocaleString()} —{' '}
                  {new Date(event.endTime).toLocaleString()}
                </p>
                <span
                  className={`inline-block mt-2 px-2 py-1 rounded-md text-xs font-medium ${
                    event.status === EventStatus.BUSY
                      ? 'bg-gray-700 text-gray-300'
                      : event.status === EventStatus.SWAPPABLE
                      ? 'bg-blue-600 text-white'
                      : 'bg-yellow-600 text-white'
                  }`}
                >
                  {event.status}
                </span>
              </div>

              <div className="flex justify-end mt-4 gap-2">
                <button
                  onClick={() => openModal(event)}
                  className="px-3 py-1 text-sm rounded-md"
                  style={{ background: 'var(--color-primary-600)', color: 'white' }}
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(event._id)}
                  className="px-3 py-1 text-sm rounded-md"
                  style={{ background: 'var(--color-error)', color: 'white' }}
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div
            className="p-6 rounded-lg w-full max-w-md"
            style={{ background: 'var(--bg-surface)', border: '1px solid var(--color-border)' }}
          >
            <h3 className="text-xl font-medium mb-4">
              {selectedEvent ? 'Edit Event' : 'Create Event'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm mb-1">Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-md outline-none"
                  style={{
                    background: 'var(--bg-card)',
                    border: '1px solid var(--color-border)',
                    color: 'var(--color-text-primary)',
                  }}
                  required
                />
              </div>
              <div>
                <label className="block text-sm mb-1">Start Time</label>
                <input
                  type="datetime-local"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="w-full px-3 py-2 rounded-md outline-none"
                  style={{
                    background: 'var(--bg-card)',
                    border: '1px solid var(--color-border)',
                    color: 'var(--color-text-primary)',
                  }}
                  required
                />
              </div>
              <div>
                <label className="block text-sm mb-1">End Time</label>
                <input
                  type="datetime-local"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="w-full px-3 py-2 rounded-md outline-none"
                  style={{
                    background: 'var(--bg-card)',
                    border: '1px solid var(--color-border)',
                    color: 'var(--color-text-primary)',
                  }}
                  required
                />
              </div>

              <div className="flex justify-end gap-2 mt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-md"
                  style={{ background: 'var(--color-border)', color: 'var(--color-text-primary)' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-md"
                  style={{
                    background: 'var(--color-primary-500)',
                    color: 'white',
                  }}
                >
                  {selectedEvent ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;
