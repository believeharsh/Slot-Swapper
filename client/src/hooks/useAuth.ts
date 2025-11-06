import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from './useRedux';
import { login, signup, logout, getMe, clearError } from '../store/slices/authSlice';
import type { LoginCredentials, SignupCredentials } from '../types/index';

export const useAuth = () => {
  const dispatch = useAppDispatch();
  const { user, token, isAuthenticated, isLoading, error } = useAppSelector((state) => state.auth);

  const handleLogin = useCallback(
    async (credentials: LoginCredentials) => {
      const result = await dispatch(login(credentials));
      return result;
    },
    [dispatch]
  );

  const handleSignup = useCallback(
    async (credentials: SignupCredentials) => {
      const result = await dispatch(signup(credentials));
      return result;
    },
    [dispatch]
  );

  const handleLogout = useCallback(() => {
    dispatch(logout());
  }, [dispatch]);

  const handleGetMe = useCallback(async () => {
    const result = await dispatch(getMe());
    return result;
  }, [dispatch]);

  const handleClearError = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  return {
    user,
    token,
    isAuthenticated,
    isLoading,
    error,
    login: handleLogin,
    signup: handleSignup,
    logout: handleLogout,
    getMe: handleGetMe,
    clearError: handleClearError,
  };
};