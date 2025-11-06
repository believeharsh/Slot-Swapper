// src/pages/Auth/SignupPage.tsx
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { signup, clearError } from '../../store/slices/authSlice';
import type { AppDispatch, RootState } from '../../store';
import { useNavigate, Link } from 'react-router-dom';
import { useDocumentTitle } from '../../hooks/useDocumentTitle';

const SignupPage: React.FC = () => {
  useDocumentTitle('Slot Swapper | Signup');
  
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { isLoading, error, isAuthenticated } = useSelector((state: RootState) => state.auth);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    if (isAuthenticated) navigate('/');
  }, [isAuthenticated, navigate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(signup({ name, email, password }));
  };

  useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  return (
    <div
      className="min-h-screen flex items-center justify-center px-6"
      style={{ background: 'var(--bg-page)', color: 'var(--color-text-primary)' }}
    >
      <div
        className="w-full max-w-md p-8 rounded-xl shadow-md"
        style={{ background: 'var(--bg-surface)', border: '1px solid var(--color-border)' }}
      >
        <h2 className="text-2xl font-semibold text-center mb-6">Create Your Account 🚀</h2>

        {error && (
          <div
            className="p-2 mb-4 rounded-md text-sm"
            style={{ background: 'var(--color-bg-error)', color: 'var(--color-error)' }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm mb-1">Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
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
            <label className="block text-sm mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
            <label className="block text-sm mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 rounded-md outline-none"
              style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--color-border)',
                color: 'var(--color-text-primary)',
              }}
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2 rounded-md mt-4 font-medium transition"
            style={{
              background: isLoading
                ? 'var(--color-primary-700)'
                : 'var(--color-primary-500)',
              color: 'white',
              opacity: isLoading ? 0.8 : 1,
            }}
          >
            {isLoading ? 'Creating account...' : 'Sign Up'}
          </button>
        </form>

        <p className="text-center text-sm mt-4" style={{ color: 'var(--color-text-secondary)' }}>
          Already have an account?{' '}
          <Link
            to="/login"
            className="hover:underline"
            style={{ color: 'var(--color-primary-400)' }}
          >
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignupPage;
