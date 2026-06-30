import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./lib/AuthContext";
import AppShell from "./components/AppShell";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import ClusterDetail from "./pages/ClusterDetail";
import ThisWeek from "./pages/ThisWeek";
import Progress from "./pages/Progress";

function PrivateRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ color: "var(--text-muted)" }}>
        Yükleniyor…
      </div>
    );
  }
  if (!user) return <Navigate to="/login" replace />;
  return <AppShell>{children}</AppShell>;
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
      <Route path="/kume/:clusterId" element={<PrivateRoute><ClusterDetail /></PrivateRoute>} />
      <Route path="/bu-hafta" element={<PrivateRoute><ThisWeek /></PrivateRoute>} />
      <Route path="/ilerleme" element={<PrivateRoute><Progress /></PrivateRoute>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
