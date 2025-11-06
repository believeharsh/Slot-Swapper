// src/pages/Landing/LandingPage.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../../../../assets/Logos/SlotSwapper_Logo.png';

const Feature: React.FC<{ title: string; desc: string }> = ({ title, desc }) => (
  <div
    className="p-5 rounded-lg shadow-sm"
    style={{
      background: 'var(--bg-card)',
      border: '1px solid var(--color-border)',
    }}
  >
    <h4 className="text-lg font-semibold mb-2" style={{ color: 'var(--color-text-primary)' }}>
      {title}
    </h4>
    <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
      {desc}
    </p>
  </div>
);

const LandingPage: React.FC = () => {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-page)', color: 'var(--color-text-primary)' }}>
      {/* Top navigation (cta on right) */}
      <header className="max-w-6xl mx-auto px-6 py-6 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl overflow-hidden border-2 border-white flex items-center justify-center">
            <img
              src={logo}
              alt="ServiceHive"
              className="object-cover w-full h-full"
              onError={(e) => {
                const img = e.currentTarget as HTMLImageElement;
                img.onerror = null;
                img.src = '/Logos/placeholder.png';
              }}
            />
          </div>
          <span className="font-semibold text-lg" style={{ color: 'var(--color-text-primary)' }}>
            Slot Swapper
          </span>
        </Link>

        <nav className="flex items-center gap-3">
          <Link
            to="/login"
            className="px-4 py-2 rounded-md text-sm"
            style={{
              background: 'transparent',
              border: '1px solid var(--color-border)',
              color: 'var(--color-text-primary)',
            }}
          >
            Login
          </Link>
          <Link
            to="/signup"
            className="px-4 py-2 rounded-md text-sm"
            style={{
              background: 'var(--color-primary-500)',
              color: 'white',
            }}
          >
            Sign up
          </Link>
        </nav>
      </header>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 py-12 grid md:grid-cols-2 gap-8 items-center">
        <div className="space-y-6">
          <h1 className="text-4xl md:text-5xl font-bold leading-tight" style={{ color: 'var(--color-text-primary)' }}>
            Swap shifts & slots — faster and secure
          </h1>
          <p className="text-lg" style={{ color: 'var(--color-text-secondary)' }}>
            Manage your calendar, mark swappable slots, request swaps, and keep everything in sync.
            ServiceHive helps teams coordinate availability without the back-and-forth.
          </p>

          <div className="flex items-center gap-3">
            <Link
              to="/signup"
              className="px-6 py-3 rounded-md font-medium"
              style={{
                background: 'var(--color-primary-500)',
                color: 'white',
              }}
            >
              Get started — it’s free
            </Link>
            <Link
              to="/login"
              className="px-4 py-3 rounded-md font-medium"
              style={{
                background: 'transparent',
                color: 'var(--color-text-primary)',
                border: '1px solid var(--color-border)',
              }}
            >
              Book a demo
            </Link>
          </div>

          <div className="flex items-center gap-4 mt-6">
            <div className="text-sm">
              <div style={{ color: 'var(--color-text-secondary)' }}>Trusted by</div>
              <div className="flex items-center gap-3 mt-2">
                <div className="w-20 h-8 rounded bg-gray-700" />
                <div className="w-20 h-8 rounded bg-gray-700" />
                <div className="w-20 h-8 rounded bg-gray-700" />
              </div>
            </div>
          </div>
        </div>

        <div>
          <div
            className="p-6 rounded-lg"
            style={{
              background: 'linear-gradient(180deg, rgba(59,130,246,0.06), rgba(59,130,246,0.02))',
              border: '1px solid var(--color-border)',
            }}
          >
            <div className="mb-4">
              <h3 className="text-lg font-semibold" style={{ color: 'var(--color-text-primary)' }}>
                Quick demo
              </h3>
              <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                Sample upcoming slots — mark a slot as swappable and request a swap.
              </p>
            </div>

            <ul className="space-y-3">
              <li className="p-3 rounded-md flex items-center justify-between" style={{ background: 'var(--bg-card)', border: '1px solid var(--color-border)' }}>
                <div>
                  <div className="font-medium">Morning Shift</div>
                  <div className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>Today • 8:00 — 12:00</div>
                </div>
                <div className="text-xs px-2 py-1 rounded" style={{ background: 'var(--color-bg-success)', color: 'var(--color-success)' }}>
                  SWAPPABLE
                </div>
              </li>

              <li className="p-3 rounded-md flex items-center justify-between" style={{ background: 'var(--bg-card)', border: '1px solid var(--color-border)' }}>
                <div>
                  <div className="font-medium">Evening Shift</div>
                  <div className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>Tomorrow • 16:00 — 20:00</div>
                </div>
                <div className="text-xs px-2 py-1 rounded" style={{ background: 'var(--color-bg-error)', color: 'var(--color-error)' }}>
                  BUSY
                </div>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-6 py-10">
        <h3 className="text-2xl font-semibold mb-6" style={{ color: 'var(--color-text-primary)' }}>
          Why teams love ServiceHive
        </h3>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Feature title="Easy swaps" desc="Mark swappable slots and request swaps in one click." />
          <Feature title="Clear history" desc="Keep a tidy history of swaps and approvals." />
          <Feature title="Permissions" desc="Only owners can approve swaps; privacy-first." />
          <Feature title="Mobile friendly" desc="Works great on phones and desktops." />
          <Feature title="Fast & secure" desc="JWT auth and sensible defaults for safety." />
          <Feature title="Dark theme" desc="Built with a polished modern dark UI out-of-the-box." />
        </div>
      </section>

      {/* CTA / Footer */}
      <footer className="max-w-6xl mx-auto px-6 py-10">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <div className="font-semibold text-lg">Ready to try?</div>
            <div className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>Create a free account and start swapping.</div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/signup"
              className="px-5 py-3 rounded-md font-medium"
              style={{ background: 'var(--color-primary-500)', color: 'white' }}
            >
              Create account
            </Link>
            <Link
              to="/login"
              className="px-4 py-3 rounded-md font-medium"
              style={{ background: 'transparent', border: '1px solid var(--color-border)', color: 'var(--color-text-primary)' }}
            >
              Log in
            </Link>
          </div>
        </div>

        <div className="mt-8 text-xs" style={{ color: 'var(--color-text-muted)' }}>
          © {new Date().getFullYear()} ServiceHive — Built with care.
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
