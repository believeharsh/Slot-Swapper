// src/pages/Requests/RequestsPage.tsx
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../../store';
import {
  fetchIncomingRequests,
  fetchOutgoingRequests,
  respondToSwapRequest,
} from '../../store/slices/swapSlice';
import type { SwapRequest } from '../../types';
import { useDocumentTitle } from '../../hooks/useDocumentTitle';

const RequestsPage: React.FC = () => {
  useDocumentTitle('Swap Request');

  const dispatch = useDispatch<AppDispatch>();
  const { incomingRequests, outgoingRequests, isLoading, error } = useSelector(
    (state: RootState) => state.swap
  );

  // modal state
  const [selectedRequest, setSelectedRequest] = useState<SwapRequest | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  // local loading state for accept/reject inside modal
  const [actionLoading, setActionLoading] = useState(false);
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  useEffect(() => {
    dispatch(fetchIncomingRequests());
    dispatch(fetchOutgoingRequests());
  }, [dispatch]);

  const openModal = (req: SwapRequest) => {
    setSelectedRequest(req);
    setActionMessage(null);
    setModalOpen(true);
  };

  const closeModal = () => {
    setSelectedRequest(null);
    setModalOpen(false);
    setActionLoading(false);
    setActionMessage(null);
  };

  const handleRespond = async (requestId: string, accept: boolean) => {
    setActionLoading(true);
    setActionMessage(null);

    try {
      await dispatch(respondToSwapRequest({ requestId, accepted: accept })).unwrap();
      setActionMessage(accept ? 'Request accepted' : 'Request rejected');
      // incomingRequests reducer already removes the request on success,
      // but refresh incoming/outgoing if you want
      dispatch(fetchIncomingRequests());
      dispatch(fetchOutgoingRequests());
      setTimeout(() => closeModal(), 900);
    } catch (err: any) {
      setActionMessage(err?.message || 'Action failed');
      setActionLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Swap Requests</h2>
        <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
          Manage incoming and outgoing swap requests
        </p>
      </div>

      {error && (
        <div className="p-2 rounded-md" style={{ background: 'var(--color-bg-error)', color: 'var(--color-error)' }}>
          {error}
        </div>
      )}

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Incoming */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold">Incoming</h3>
            <button
              className="text-sm px-3 py-1 rounded-md"
              style={{ border: '1px solid var(--color-border)', color: 'var(--color-text-primary)' }}
              onClick={() => dispatch(fetchIncomingRequests())}
            >
              Refresh
            </button>
          </div>

          {isLoading && incomingRequests.length === 0 ? (
            <p>Loading incoming requests...</p>
          ) : incomingRequests.length === 0 ? (
            <div className="p-4 rounded-md" style={{ background: 'var(--bg-card)', border: '1px solid var(--color-border)' }}>
              <p style={{ color: 'var(--color-text-secondary)' }}>No incoming requests</p>
            </div>
          ) : (
            <div className="space-y-3">
              {incomingRequests.map((req: SwapRequest) => (
                <div
                  key={req._id}
                  className="p-4 rounded-md flex flex-col md:flex-row md:items-center md:justify-between gap-3"
                  style={{ background: 'var(--bg-card)', border: '1px solid var(--color-border)' }}
                >
                  <div>
                    <div className="font-medium">
                      From: {typeof req.requesterId === 'string' ? req.requesterId : req.requesterId.name}
                    </div>
                    <div className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                      Wants: {req.targetSlotId?.title ?? 'slot'}
                    </div>
                    <div className="text-xs mt-1" style={{ color: 'var(--color-text-secondary)' }}>
                      Sent: {new Date(req.createdAt).toLocaleString()}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => openModal(req)}
                      className="px-3 py-1 rounded-md text-sm"
                      style={{ background: 'transparent', border: '1px solid var(--color-border)', color: 'var(--color-text-primary)' }}
                    >
                      View
                    </button>

                    <button
                      onClick={() => handleRespond(req._id, true)}
                      className="px-3 py-1 rounded-md text-sm"
                      style={{ background: 'var(--color-primary-500)', color: 'white' }}
                    >
                      Accept
                    </button>

                    <button
                      onClick={() => handleRespond(req._id, false)}
                      className="px-3 py-1 rounded-md text-sm"
                      style={{ background: 'var(--color-error)', color: 'white' }}
                    >
                      Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Outgoing */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold">Outgoing</h3>
            <button
              className="text-sm px-3 py-1 rounded-md"
              style={{ border: '1px solid var(--color-border)', color: 'var(--color-text-primary)' }}
              onClick={() => dispatch(fetchOutgoingRequests())}
            >
              Refresh
            </button>
          </div>

          {isLoading && outgoingRequests.length === 0 ? (
            <p>Loading outgoing requests...</p>
          ) : outgoingRequests.length === 0 ? (
            <div className="p-4 rounded-md" style={{ background: 'var(--bg-card)', border: '1px solid var(--color-border)' }}>
              <p style={{ color: 'var(--color-text-secondary)' }}>No outgoing requests</p>
            </div>
          ) : (
            <div className="space-y-3">
              {outgoingRequests.map((req: SwapRequest) => (
                <div
                  key={req._id}
                  className="p-4 rounded-md flex items-center justify-between"
                  style={{ background: 'var(--bg-card)', border: '1px solid var(--color-border)' }}
                >
                  <div>
                    <div className="font-medium">To: {typeof req.targetUserId === 'string' ? req.targetUserId : req.targetUserId.name}</div>
                    <div className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                      Requested: {req.targetSlotId?.title ?? 'slot'}
                    </div>
                    <div className="text-xs mt-1" style={{ color: 'var(--color-text-secondary)' }}>
                      Status: {req.status}
                    </div>
                  </div>

                  <div className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                    Sent: {new Date(req.createdAt).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      {/* Detail Modal */}
      {modalOpen && selectedRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.5)' }}>
          <div className="w-full max-w-xl p-6 rounded-lg" style={{ background: 'var(--bg-surface)', border: '1px solid var(--color-border)' }}>
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-xl font-semibold">Request Details</h3>
                <p className="text-sm mt-1" style={{ color: 'var(--color-text-secondary)' }}>
                  From: {typeof selectedRequest.requesterId === 'string' ? selectedRequest.requesterId : selectedRequest.requesterId.name}
                </p>
              </div>
              <button
                onClick={closeModal}
                className="px-2 py-1 rounded-md"
                style={{ border: '1px solid var(--color-border)', color: 'var(--color-text-primary)' }}
              >
                Close
              </button>
            </div>

            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div style={{ border: '1px solid var(--color-border)', padding: 12, borderRadius: 8, background: 'var(--bg-card)' }}>
                <div className="text-sm text-[var(--color-text-secondary)]">Requester Slot</div>
                <div className="font-medium mt-1">{selectedRequest.requesterSlotId?.title ?? '—'}</div>
                <div className="text-xs mt-1" style={{ color: 'var(--color-text-secondary)' }}>
                  {selectedRequest.requesterSlotId ? `${new Date(selectedRequest.requesterSlotId.startTime).toLocaleString()} — ${new Date(selectedRequest.requesterSlotId.endTime).toLocaleString()}` : '—'}
                </div>
              </div>

              <div style={{ border: '1px solid var(--color-border)', padding: 12, borderRadius: 8, background: 'var(--bg-card)' }}>
                <div className="text-sm text-[var(--color-text-secondary)]">Target Slot</div>
                <div className="font-medium mt-1">{selectedRequest.targetSlotId?.title ?? '—'}</div>
                <div className="text-xs mt-1" style={{ color: 'var(--color-text-secondary)' }}>
                  {selectedRequest.targetSlotId ? `${new Date(selectedRequest.targetSlotId.startTime).toLocaleString()} — ${new Date(selectedRequest.targetSlotId.endTime).toLocaleString()}` : '—'}
                </div>
              </div>

              <div className="md:col-span-2">
                <div className="text-sm text-[var(--color-text-secondary)]">Message</div>
                <div className="mt-1 p-3 rounded-md" style={{ background: 'var(--bg-card)', border: '1px solid var(--color-border)' }}>
                  {selectedRequest.message ?? <span style={{ color: 'var(--color-text-secondary)' }}>No message provided</span>}
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              {actionMessage && (
                <div className="px-3 py-1 rounded-md" style={{ background: 'transparent', color: 'var(--color-text-secondary)' }}>
                  {actionMessage}
                </div>
              )}

              <button
                onClick={() => handleRespond(selectedRequest._id, false)}
                disabled={actionLoading}
                className="px-4 py-2 rounded-md"
                style={{ background: 'var(--color-error)', color: 'white' }}
              >
                {actionLoading ? 'Rejecting...' : 'Reject'}
              </button>

              <button
                onClick={() => handleRespond(selectedRequest._id, true)}
                disabled={actionLoading}
                className="px-4 py-2 rounded-md"
                style={{ background: 'var(--color-primary-500)', color: 'white' }}
              >
                {actionLoading ? 'Accepting...' : 'Accept'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RequestsPage;
