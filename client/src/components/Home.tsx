/*
ServiceHiveHome - Updated (Dark Theme)
- Uses the split theme files you approved: colors.css, typography.css, utilities.css
- Save as: src/components/ServiceHiveHome.jsx
- Make sure to import the CSS files in your global stylesheet (index.css) or in this component import:
    import '../styles/colors.css';
    import '../styles/typography.css';
    import '../styles/utilities.css';

Notes:
- This component uses semantic variables (var(--bg-surface), var(--accent), etc.) and helper classes (.card, .btn-primary, .chip).
- The layout is responsive and uses Tailwind utility classes for spacing/grid. If you're not using Tailwind, replace those classes with your own.
*/

// import React from 'react';

export default function ServiceHiveHome() {
  const swappableSlots = [
    { id: 1, owner: 'Alex P.', title: 'Design Review', time: 'Tue • 10:00 - 11:00' },
    { id: 2, owner: 'Maya R.', title: 'Focus Block', time: 'Wed • 14:00 - 15:00' },
    { id: 3, owner: 'Sam K.', title: 'Sprint Planning', time: 'Fri • 11:00 - 12:00' },
  ];

  const myEvents = [
    { id: 'a', title: 'Team Meeting', time: 'Mon • 09:00 - 10:00', status: 'BUSY' },
    { id: 'b', title: 'Deep Work', time: 'Thu • 16:00 - 17:00', status: 'SWAPPABLE' },
    { id: 'c', title: 'Code Review', time: 'Wed • 13:00 - 14:00', status: 'BUSY' },
  ];

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-page)', color: 'var(--color-text-primary)', fontFamily: 'var(--font-sans)' }}>
      {/* Header */}
      <header className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between" style={{ borderBottom: '1px solid var(--color-border)' }}>
        <div className="flex items-center gap-4">
          <div className="w-11 h-11 rounded-full flex items-center justify-center" style={{ background: 'linear-gradient(135deg, var(--accent), rgba(168,85,247,0.85))', boxShadow: 'var(--shadow-glow)' }}>
            <strong style={{ color: 'white' }}>SH</strong>
          </div>
          <div>
            <h1 className="text-lg font-semibold" style={{ margin: 0 }}>ServiceHive</h1>
            <p className="text-xs" style={{ color: 'var(--color-text-secondary)', margin: 0 }}>Swap your schedule, simplify your week</p>
          </div>
        </div>

        <nav className="hidden md:flex items-center gap-3 text-sm">
          <a href="#dashboard" className="px-3 py-2 rounded-md" style={{ color: 'var(--color-text-primary)' }}>Dashboard</a>
          <a href="#marketplace" className="px-3 py-2 rounded-md" style={{ color: 'var(--color-text-primary)' }}>Marketplace</a>
          <a href="#requests" className="px-3 py-2 rounded-md" style={{ color: 'var(--color-text-primary)' }}>Requests</a>
          <button className="btn-primary">Create Event</button>
        </nav>

        <div className="md:hidden">
          <button className="px-3 py-2 rounded-md card" aria-label="menu">Menu</button>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-7xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <section className="lg:col-span-2 space-y-6">
          {/* Calendar card */}
          <div className="card p-6">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-2xl font-semibold">Your Calendar</h2>
                <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>A compact view of your day-to-day schedule.</p>
              </div>

              <div className="flex items-center gap-3">
                <button className="px-3 py-1 rounded-md" style={{ border: '1px solid var(--color-border)', color: 'var(--color-text-primary)' }}>Sync</button>
                <button className="btn-primary">New Event</button>
              </div>
            </div>

            <div className="mt-6 grid gap-3">
              {myEvents.map((ev) => (
                <div key={ev.id} className="p-3 rounded-md flex items-center justify-between" style={{ background: 'var(--bg-card)', border: '1px solid var(--color-border)' }}>
                  <div>
                    <div className="font-medium">{ev.title}</div>
                    <div className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>{ev.time}</div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className={`chip ${ev.status === 'SWAPPABLE' ? 'state-success' : ''}`} style={{ color: ev.status === 'SWAPPABLE' ? 'var(--color-success)' : 'var(--color-text-secondary)' }}>{ev.status}</span>
                    <button className="px-3 py-1 rounded-md" style={{ border: '1px solid var(--color-border)', color: 'var(--color-text-primary)' }}>Edit</button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Marketplace */}
          <div className="card p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-semibold">Marketplace</h3>
                <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>Slots other users have marked as swappable</p>
              </div>
              <a href="#" className="text-sm" style={{ color: 'var(--accent)' }}>View all</a>
            </div>

            <div className="mt-4 grid gap-3">
              {swappableSlots.map((slot) => (
                <div key={slot.id} className="p-3 rounded-md flex items-center justify-between" style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.02), var(--bg-card))', border: '1px solid var(--color-border)' }}>
                  <div>
                    <div className="font-medium">{slot.title}</div>
                    <div className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>{slot.owner} • {slot.time}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="px-3 py-1 rounded-md" style={{ border: '1px solid var(--color-border)', color: 'var(--color-text-primary)' }}>Request</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Sidebar */}
        <aside className="space-y-4">
          <div className="card p-4">
            <h4 className="font-semibold">Incoming Requests</h4>
            <p className="text-xs mt-1" style={{ color: 'var(--color-text-secondary)' }}>Requests from other users</p>

            <div className="mt-3 space-y-2">
              <div className="p-3 rounded-md flex items-start justify-between" style={{ background: 'var(--bg-card)', border: '1px solid var(--color-border)' }}>
                <div>
                  <div className="text-sm font-medium">Alex wants your Tue slot</div>
                  <div className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>Offered: Wed • 14:00 - 15:00</div>
                </div>
                <div className="flex flex-col gap-2">
                  <button className="px-2 py-1 rounded-md text-xs btn-primary">Accept</button>
                  <button className="px-2 py-1 rounded-md text-xs" style={{ border: '1px solid var(--color-border)', color: 'var(--color-text-primary)' }}>Reject</button>
                </div>
              </div>
            </div>
          </div>

          <div className="card p-4">
            <h4 className="font-semibold">Quick Actions</h4>
            <div className="mt-3 flex flex-col gap-3">
              <button className="btn-primary">Make selected swappable</button>
              <button className="px-3 py-2 rounded-md" style={{ background: 'transparent', border: '1px solid var(--color-border)', color: 'var(--color-text-primary)' }}>Open Marketplace</button>
            </div>
          </div>

          <div className="card p-4">
            <h4 className="font-semibold">Tips</h4>
            <ul className="mt-2 text-sm" style={{ color: 'var(--color-text-secondary)' }}>
              <li className="mt-1">Mark only truly flexible slots as swappable.</li>
              <li className="mt-1">Respond quickly — swaps can be time-sensitive.</li>
              <li className="mt-1">Sync your calendar for better suggestions.</li>
            </ul>
          </div>
        </aside>
      </main>

      <footer className="max-w-7xl mx-auto px-6 py-6 text-center text-sm" style={{ color: 'var(--color-text-muted)' }}>
        © {new Date().getFullYear()} ServiceHive • Built with a focused dark theme
      </footer>
    </div>
  );
}
