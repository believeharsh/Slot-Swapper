import React from 'react';
import { Outlet, NavLink, useNavigate, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../store/slices/authSlice';
import type { AppDispatch } from '../store/index';

import logo from '../../../assets/Logos/SlotSwapper_Logo.png';

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
        <div className="w-14">
          <Link
            to="/"
            className="flex items-center space-x-2 sm:space-x-3 flex-shrink-0"
          >
            <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 flex items-center justify-center overflow-hidden ">
              <img
                src={logo}
                alt="SlotSwapper logo"
                className="object-cover w-full h-full"
                onError={(e) => {
                  const img = e.currentTarget as HTMLImageElement;
                  img.onerror = null;
                  // Fallback to a placeholder or text
                  img.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100"%3E%3Crect fill="%233B82F6" width="100" height="100"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-size="40" fill="white"%3ESS%3C/text%3E%3C/svg%3E';
                }}
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
            className="ml-4 px-3 py-2 rounded-md text-sm hover:opacity-90 transition"
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