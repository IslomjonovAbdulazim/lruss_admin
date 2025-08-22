import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './store/authStore';

// Pages
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Students from './pages/Students';
import Content from './pages/Content';
import Subscriptions from './pages/Subscriptions';
import Analytics from './pages/Analytics';

// Layout
import Layout from './components/layout/Layout';

// Styles
import './styles/global.css';
import './styles/layout.css';
import './styles/components.css';
import './styles/pages.css';

// Protected Route wrapper
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

// Public Route wrapper (redirect to dashboard if authenticated)
const PublicRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return !isAuthenticated ? children : <Navigate to="/" replace />;
};

function AppRoutes() {
  return (
    <Routes>
      {/* Public routes */}
      <Route 
        path="/login" 
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        } 
      />
      
      {/* Protected routes */}
      <Route 
        path="/" 
        element={
          <ProtectedRoute>
            <Layout>
              <Dashboard />
            </Layout>
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/students" 
        element={
          <ProtectedRoute>
            <Layout>
              <Students />
            </Layout>
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/content" 
        element={
          <ProtectedRoute>
            <Layout>
              <Content />
            </Layout>
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/subscriptions" 
        element={
          <ProtectedRoute>
            <Layout>
              <Subscriptions />
            </Layout>
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/analytics" 
        element={
          <ProtectedRoute>
            <Layout>
              <Analytics />
            </Layout>
          </ProtectedRoute>
        } 
      />
      
      {/* Fallback route */}
      <Route 
        path="*" 
        element={<Navigate to="/" replace />} 
      />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app">
          <AppRoutes />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;