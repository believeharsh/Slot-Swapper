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

const RequestsPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { incomingRequests, outgoingRequests, isLoading, error } = useSelector(
    (state: RootState) => state.swap
  );
  // const { user } = useSelector((s: RootState) => s.auth);s

  // local map of requestId -> loading state / message
  const [processing, setProcessing] = useState<Record<string, boolean>>({});
  const [messageMap, setMessageMap] = useState<Record<string, string>>({});

  useEffect(() => {
    dispatch(fetchIncomingRequests());
    dispatch(fetchOutgoingRequests());
  }, [dispatch]);

  const setProc = (id: string, v: boolean) =>
    setProcessing(prev => ({ ...prev, [id]: v }));

  const setMsg = (id: string, msg: string) =>
    setMessageMap(prev => ({ ...prev, [id]: msg }));

  const handleRespond = async (requestId: string, accept: boolean) => {
    setProc(requestId, true);
    setMsg(requestId, '');
    try {
      await dispatch(respondToSwapRequest({ requestId, accepted: accept })).unwrap();
      setMsg(requestId, accept ? 'Accepted' : 'Rejected');
      // incomingRequests reducer already removes the request on success.
    } catch (err: any) {
      setMsg(requestId, err?.message || 'Action failed');
    } finally {
      setProc(requestId, false);
      // clear message after 1.2s
      setTimeout(() => setMsg(requestId, ''), 1200);
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
          <h3 className="text-lg font-semibold mb-3">Incoming</h3>

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
                    <div className="font-medium">{/* show requester and brief */}From: {typeof req.requesterId === 'string' ? req.requesterId : req.requesterId.name}</div>
                    <div className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                      Wants: {typeof req.targetSlotId !== 'undefined' && req.targetSlotId ? (req.targetSlotId.title ?? 'their slot') : 'slot'}
                    </div>
                    <div className="text-xs mt-1" style={{ color: 'var(--color-text-secondary)' }}>
                      Sent: {new Date(req.createdAt).toLocaleString()}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {messageMap[req._id] ? (
                      <div className="text-sm px-3 py-1 rounded-md" style={{ background: 'transparent', color: 'var(--color-text-secondary)' }}>
                        {messageMap[req._id]}
                      </div>
                    ) : (
                      <>
                        <button
                          onClick={() => handleRespond(req._id, true)}
                          disabled={processing[req._id]}
                          className="px-3 py-1 rounded-md text-sm"
                          style={{ background: 'var(--color-primary-500)', color: 'white' }}
                        >
                          {processing[req._id] ? 'Accepting...' : 'Accept'}
                        </button>

                        <button
                          onClick={() => handleRespond(req._id, false)}
                          disabled={processing[req._id]}
                          className="px-3 py-1 rounded-md text-sm"
                          style={{ background: 'var(--color-error)', color: 'white' }}
                        >
                          {processing[req._id] ? 'Rejecting...' : 'Reject'}
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Outgoing */}
        <section>
          <h3 className="text-lg font-semibold mb-3">Outgoing</h3>

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
                      Requested: {typeof req.targetSlotId !== 'undefined' && req.targetSlotId ? (req.targetSlotId.title ?? 'slot') : 'slot'}
                    </div>
                    <div className="text-xs mt-1 font-text-secondary" style={{ color: 'var(--color-text-secondary)' }}>
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
    </div>
  );
};

export default RequestsPage;
