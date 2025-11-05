export const ButtonExamples = () => {
  return (
    <div className="space-y-4 bg-primary-900">
      {/* Primary Button */}
      <button className="btn btn-primary font-mono">
        Request Swap
      </button>

      {/* Secondary Button */}
      <button className="btn btn-secondary">
        Cancel
      </button>

      {/* Success Button */}
      <button className="btn btn-success">
        Accept Swap
      </button>

      {/* Error Button */}
      <button className="btn btn-error">
        Reject
      </button>

      {/* Ghost Button */}
      <button className="btn btn-ghost">
        View Details
      </button>

      {/* Small Button */}
      <button className="btn btn-primary btn-sm">
        Quick Action
      </button>

      {/* With Loading Spinner */}
      <button className="btn btn-primary" disabled>
        <span className="spinner mr-2"></span>
        Loading...
      </button>
    </div>
  );
};

// Example 2: Event Card
export const EventCard = ({ event }: { event: any }) => {
  return (
    <div className={`event-card bg-card ${
      event.status === 'BUSY' ? 'event-card-busy' :
      event.status === 'SWAPPABLE' ? 'event-card-swappable' :
      'event-card-pending'
    }`}>
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-lg font-semibold text-text-primary">
          {event.title}
        </h3>
        <span className={`badge ${
          event.status === 'BUSY' ? 'badge-busy' :
          event.status === 'SWAPPABLE' ? 'badge-swappable' :
          'badge-pending'
        }`}>
          {event.status}
        </span>
      </div>

      <div className="space-y-2 text-sm text-text-secondary">
        <div className="flex items-center gap-2">
          <span>📅</span>
          <span>{new Date(event.startTime).toLocaleDateString()}</span>
        </div>
        <div className="flex items-center gap-2">
          <span>🕐</span>
          <span>
            {new Date(event.startTime).toLocaleTimeString()} - 
            {new Date(event.endTime).toLocaleTimeString()}
          </span>
        </div>
      </div>

      <div className="mt-4 flex gap-2">
        {event.status === 'BUSY' && (
          <button className="btn btn-primary btn-sm">
            Make Swappable
          </button>
        )}
        {event.status === 'SWAPPABLE' && (
          <button className="btn btn-secondary btn-sm">
            Remove from Swappable
          </button>
        )}
        <button className="btn btn-ghost btn-sm ml-auto">
          Delete
        </button>
      </div>
    </div>
  );
};