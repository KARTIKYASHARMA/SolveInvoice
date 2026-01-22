import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { InvoiceProvider } from "./context/InvoiceContext";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Analytics from "./pages/Analytics";
import CreateInvoice from "./pages/CreateInvoice";
import MainLayout from "./layouts/MainLayout";

/* -----------------------------
   Protected Route
------------------------------ */
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  return children;
};

/* -----------------------------
   Public Route
------------------------------ */
const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) return null;

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

function App() {
  return (
    <AuthProvider>
      <InvoiceProvider>
        <BrowserRouter>
          <Routes>
            {/* -----------------------------
                Public Routes
            ------------------------------ */}
            <Route
              path="/"
              element={
                <PublicRoute>
                  <Login />
                </PublicRoute>
              }
            />

            <Route
              path="/register"
              element={
                <PublicRoute>
                  <Register />
                </PublicRoute>
              }
            />

            {/* -----------------------------
                Protected Layout Routes
            ------------------------------ */}
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <MainLayout />
                </ProtectedRoute>
              }
            >
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="create-invoice" element={<CreateInvoice />} />

              {/* ✅ ADD THIS */}
              <Route path="analytics" element={<Analytics />} />
            </Route>


            {/* -----------------------------
                Fallback
            ------------------------------ */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </InvoiceProvider>
    </AuthProvider>
  );
}

export default App;
