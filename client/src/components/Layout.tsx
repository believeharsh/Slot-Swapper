// src/components/Layout/Layout.tsx
import React from 'react';
import { Outlet, NavLink, useNavigate, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../store/slices/authSlice';
import type { AppDispatch } from '../store';

const Layout: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `px-4 py-2 rounded-md transition ${
      isActive
        ? 'bg-[var(--color-primary-500)] text-white'
        : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
    }`;

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: 'var(--bg-page)', color: 'var(--color-text-primary)' }}
    >
      {/* Header */}
      <header
        className="w-full flex items-center justify-between px-6 py-3 border-b"
        style={{ borderColor: 'var(--color-border)' }}
      >
        {/* <h1 className="text-lg font-semibold">ServiceHive</h1> */}
        <div className="w-14">
              <Link
              to="/"
              className="flex items-center space-x-2 sm:space-x-3 flex-shrink-0"
            >
              <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-xl border-2 border-white flex items-center justify-center">
                <img
                  src={`./public/Logos/SlotSwapper_Name_Logo.png`}
                  alt="Cravo Logo"
                  className="rounded-xl"
                  // onError={e => {
                  //   e.target.onerror = null;
                  //   e.target.src =
                  //     'https://placehold.co/60x60/fde047/6b7280?text=C';
                  // }}
                />
              </div>
            </Link>
        </div>
        <nav className="flex items-center gap-3 text-sm">
          <NavLink to="/" className={navLinkClass}>
            Dashboard
          </NavLink>
          <NavLink to="/marketplace" className={navLinkClass}>
            Marketplace
          </NavLink>
          <NavLink to="/requests" className={navLinkClass}>
            Requests
          </NavLink>
          <button
            onClick={handleLogout}
            className="ml-4 px-3 py-2 rounded-md text-sm"
            style={{
              background: 'var(--color-primary-600)',
              color: 'white',
            }}
          >
            Logout
          </button>
        </nav>
      </header>

      {/* Main Content */}
      <main className="flex-1 px-6 py-6">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
