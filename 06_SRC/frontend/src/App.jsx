import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/layout/ProtectedRoute';

// Public pages
import { LandingPage } from './pages/public/LandingPage';
import { SignupPage } from './pages/public/SignupPage';
import { LoginPage } from './pages/public/LoginPage';
import { VerifyEmailPage } from './pages/public/VerifyEmailPage';
import { ForgotPasswordPage } from './pages/public/ForgotPasswordPage';
import { ResetPasswordPage } from './pages/public/ResetPasswordPage';

// Authenticated pages
import { DashboardPage } from './pages/dashboard/DashboardPage';
import { ExplorePage } from './pages/items/ExplorePage';
import { ItemDetailsPage } from './pages/items/ItemDetailsPage';
import { AddItemPage } from './pages/items/AddItemPage';
import { EditItemPage } from './pages/items/EditItemPage';
import { MyListingsPage } from './pages/items/MyListingsPage';
import { ActivityPage } from './pages/activity/ActivityPage';
import { RequestsPage } from './pages/activity/RequestsPage';
import { BorrowingsPage } from './pages/activity/BorrowingsPage';
import { LendingPage } from './pages/activity/LendingPage';
import { NotificationsPage } from './pages/notifications/NotificationsPage';
import { ProfilePage } from './pages/profile/ProfilePage';
import { EditProfilePage } from './pages/profile/EditProfilePage';
import { SettingsPage } from './pages/settings/SettingsPage';

// Admin pages
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';
import { ReportsPage } from './pages/admin/ReportsPage';

export function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/verify-email" element={<VerifyEmailPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />

          {/* Protected Student Routes */}
          <Route path="/app" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
          <Route path="/app/explore" element={<ProtectedRoute><ExplorePage /></ProtectedRoute>} />
          <Route path="/app/items/new" element={<ProtectedRoute><AddItemPage /></ProtectedRoute>} />
          <Route path="/app/items/:id" element={<ProtectedRoute><ItemDetailsPage /></ProtectedRoute>} />
          <Route path="/app/items/:id/edit" element={<ProtectedRoute><EditItemPage /></ProtectedRoute>} />
          <Route path="/app/listings" element={<ProtectedRoute><MyListingsPage /></ProtectedRoute>} />
          <Route path="/app/activity" element={<ProtectedRoute><ActivityPage /></ProtectedRoute>} />
          <Route path="/app/requests" element={<ProtectedRoute><RequestsPage /></ProtectedRoute>} />
          <Route path="/app/borrowings" element={<ProtectedRoute><BorrowingsPage /></ProtectedRoute>} />
          <Route path="/app/lending" element={<ProtectedRoute><LendingPage /></ProtectedRoute>} />
          <Route path="/app/notifications" element={<ProtectedRoute><NotificationsPage /></ProtectedRoute>} />
          <Route path="/app/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
          <Route path="/app/profile/edit" element={<ProtectedRoute><EditProfilePage /></ProtectedRoute>} />
          <Route path="/app/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />

          {/* Admin Routes */}
          <Route path="/admin" element={<ProtectedRoute requireAdmin><AdminDashboardPage /></ProtectedRoute>} />
          <Route path="/admin/reports" element={<ProtectedRoute requireAdmin><ReportsPage /></ProtectedRoute>} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;

