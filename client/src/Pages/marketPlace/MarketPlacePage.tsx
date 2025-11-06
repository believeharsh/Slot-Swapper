// src/pages/Marketplace/MarketplacePage.tsx
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../../store';
import {
  fetchSwappableSlots,
  createSwapRequest,
} from '../../store/slices/swapSlice';
import { fetchMyEvents } from '../../store/slices/eventSlice';
import type { Event, CreateSwapRequestData } from '../../types';

const MarketplacePage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { swappableSlots, isLoading: swappablesLoading, error: swapError } = useSelector(
    (state: RootState) => state.swap
  );
  const { events: myEvents, isLoading: myEventsLoading } = useSelector(
    (state: RootState) => state.events
  );
  const { user } = useSelector((s: RootState) => s.auth);

  const [showRequestModal, setShowRequestModal] = useState(false);
  const [targetSlot, setTargetSlot] = useState<Event | null>(null);
  const [offeredSlotId, setOfferedSlotId] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    dispatch(fetchSwappableSlots());
    // fetch user's events so they can offer one when making a request
    dispatch(fetchMyEvents());
  }, [dispatch]);

  const openRequestModal = (slot: Event) => {
    setTargetSlot(slot);
    setOfferedSlotId(null);
    setMessage('');
    setShowRequestModal(true);
    setSuccessMsg(null);
  };

  const closeModal = () => {
    setShowRequestModal(false);
    setTargetSlot(null);
    setOfferedSlotId(null);
    setMessage('');
    setSubmitting(false);
  };

  const handleRequestSwap = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!targetSlot) return;
    setSubmitting(true);
    try {
      const payload: CreateSwapRequestData = {
        mySlotId: offeredSlotId || '',
        theirSlotId: targetSlot._id,
        // message: message || undefined,
      };
      // If user didn't choose an offered slot, you may send mySlotId as '' - backend can interpret as no offer
      await dispatch(createSwapRequest(payload)).unwrap();
      setSuccessMsg('Swap request sent');
      // Optionally refresh incoming/outgoing slots here
      setTimeout(() => closeModal(), 900);
    } catch (err: any) {
      // error handled in slice - show brief message
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Marketplace</h2>
        <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
          Browse slots others marked as swappable
        </p>
      </div>

      {swapError && (
        <div className="p-2 rounded-md" style={{ background: 'var(--color-bg-error)', color: 'var(--color-error)' }}>
          {swapError}
        </div>
      )}

      {/* Loading / Empty */}
      {swappablesLoading ? (
        <p>Loading available slots...</p>
      ) : swappableSlots.length === 0 ? (
        <div className="p-6 rounded-lg" style={{ background: 'var(--bg-card)', border: '1px solid var(--color-border)' }}>
          <p style={{ color: 'var(--color-text-secondary)' }}>No swappable slots right now. Try again later.</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {swappableSlots.map((slot) => (
            <div
              key={slot._id}
              className="p-4 rounded-lg flex flex-col justify-between"
              style={{ background: 'var(--bg-card)', border: '1px solid var(--color-border)' }}
            >
              <div>
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium">{slot.title}</h3>
                  <span className="text-xs px-2 py-1 rounded-full" style={{ border: '1px solid var(--color-border)', color: 'var(--color-text-secondary)' }}>
                    {slot.status}
                  </span>
                </div>
                <p className="text-sm mt-2" style={{ color: 'var(--color-text-secondary)' }}>
                  {new Date(slot.startTime).toLocaleString()} — {new Date(slot.endTime).toLocaleString()}
                </p>
                <p className="text-xs mt-2" style={{ color: 'var(--color-text-secondary)' }}>
                  Owner: {typeof slot.userId === 'string' ? slot.userId : slot.userId.name}
                </p>
              </div>

              <div className="flex items-center justify-end gap-2 mt-4">
                <button
                  onClick={() => openRequestModal(slot)}
                  className="px-3 py-1 rounded-md"
                  style={{ background: 'var(--color-primary-500)', color: 'white' }}
                >
                  Request Swap
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Request Modal */}
      {showRequestModal && targetSlot && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.5)' }}>
          <div className="w-full max-w-lg p-6 rounded-lg" style={{ background: 'var(--bg-surface)', border: '1px solid var(--color-border)' }}>
            <h3 className="text-xl font-semibold mb-2">Request Swap</h3>
            <p className="text-sm mb-4" style={{ color: 'var(--color-text-secondary)' }}>
              Requesting <strong>{targetSlot.title}</strong> • {new Date(targetSlot.startTime).toLocaleString()}
            </p>

            {/* If user's events still loading, show small note */}
            {myEventsLoading && <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>Loading your slots...</p>}

            <form onSubmit={(e) => handleRequestSwap(e)}>
              <div className="mb-3">
                <label className="block text-sm mb-1">Offer one of your slots (optional)</label>
                <select
                  value={offeredSlotId ?? ''}
                  onChange={(e) => setOfferedSlotId(e.target.value || null)}
                  className="w-full px-3 py-2 rounded-md"
                  style={{ background: 'var(--bg-card)', border: '1px solid var(--color-border)', color: 'var(--color-text-primary)' }}
                >
                  <option value="">No offer — just request</option>
                  {myEvents
                    .filter(ev => ev._id !== targetSlot._id) // don't offer same slot
                    .map(ev => (
                    <option key={ev._id} value={ev._id}>
                      {ev.title} — {new Date(ev.startTime).toLocaleString()}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-3">
                <label className="block text-sm mb-1">Message (optional)</label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full px-3 py-2 rounded-md"
                  rows={3}
                  style={{ background: 'var(--bg-card)', border: '1px solid var(--color-border)', color: 'var(--color-text-primary)' }}
                />
              </div>

              {successMsg && (
                <div className="mb-3 p-2 rounded-md" style={{ background: 'var(--color-bg-success)', color: 'var(--color-success)' }}>
                  {successMsg}
                </div>
              )}

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 rounded-md"
                  style={{ background: 'transparent', border: '1px solid var(--color-border)', color: 'var(--color-text-primary)' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 rounded-md"
                  style={{ background: 'var(--color-primary-500)', color: 'white' }}
                >
                  {submitting ? 'Sending...' : 'Send Request'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MarketplacePage;
