import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { RootState } from './store';
import Layout from './components/Layout';
import LoginPage from './Pages/auth/LoginPage';
import SignupPage from './Pages/auth/SignupPage';
import DashboardPage from './Pages/dashboard/DashboardPage';
import MarketplacePage from './Pages/marketPlace/MarketPlacePage';
import RequestsPage from './Pages/requests/RequestsPage';
import LandingPage from './Pages/landing/landing';

// ✅ ProtectedRoute — only allows access if logged in
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <>{children}</>;
};

// ✅ PublicRoute — redirects to dashboard if already logged in
const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  if (isAuthenticated) return <Navigate to="/app" replace />;
  return <>{children}</>;
};

const App: React.FC = () => {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  return (
    <BrowserRouter>
      <Routes>
        {/* Root Route - Smart Redirect */}
        <Route 
          path="/" 
          element={
            isAuthenticated ? (
              <Navigate to="/app" replace />
            ) : (
              <LandingPage />
            )
          } 
        />

        {/* Auth Routes - redirect to /app if already logged in */}
        <Route
          path="/login"
          element={
            <PublicRoute>
              <LoginPage />
            </PublicRoute>
          }
        />
        <Route
          path="/signup"
          element={
            <PublicRoute>
              <SignupPage />
            </PublicRoute>
          }
        />

        {/* Protected App Routes */}
        <Route
          path="/app"
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route index element={<DashboardPage />} />
          <Route path="marketplace" element={<MarketplacePage />} />
          <Route path="requests" element={<RequestsPage />} />
        </Route>

        {/* Fallback - redirect unknown routes based on auth status */}
        <Route 
          path="*" 
          element={
            isAuthenticated ? (
              <Navigate to="/app" replace />
            ) : (
              <Navigate to="/" replace />
            )
          } 
        />
      </Routes>
    </BrowserRouter>
  );
};

export default App;