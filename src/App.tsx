// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { AccessibilityPanel } from './components/AccessibilityPanel';
import { Chatbot } from './components/Chatbot';
import { Landing } from './pages/Landing';
import { Login } from './pages/Login';
import { Signup } from './pages/Signup';
import { ClientDashboard } from './pages/ClientDashboard';
import { PsychiatristDashboard } from './pages/PsychiatristDashboard';
import { Booking } from './pages/Booking';
import { PaymentSuccess } from './pages/PaymentSuccess';
import { ProtectedRoute } from './components/auth/ProtectedRoute';

function AppRoutes() {
  const { user, profile, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-teal-600"></div>
      </div>
    );
  }

  return (
    <>
      <Routes>
        <Route path="/" element={user ? <Navigate to="/dashboard" /> : <Landing />} />
        <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <Login />} />
        <Route path="/signup" element={user ? <Navigate to="/dashboard" /> : <Signup />} />
        <Route path="/booking" element={<ProtectedRoute><Booking /></ProtectedRoute>} />
        <Route path="/payment/success" element={<PaymentSuccess />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              {profile?.role === 'client' ? <ClientDashboard /> : <PsychiatristDashboard />}
            </ProtectedRoute>
          }
        />
      </Routes>
      
      {/* Global Components */}
      <AccessibilityPanel />
      <Chatbot />
    </>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </Router>
  );
}

export default App;