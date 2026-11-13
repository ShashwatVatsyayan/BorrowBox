import React, { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { ProtectedRoute } from './components/layout/ProtectedRoute';

// Public landing page kept eager for instant first contentful paint
import { LandingPage } from './pages/public/LandingPage';

// Route-level code-splitting for high performance and minimal initial bundle size
const SignupPage = lazy(() => import('./pages/public/SignupPage').then(m => ({ default: m.SignupPage })));
const LoginPage = lazy(() => import('./pages/public/LoginPage').then(m => ({ default: m.LoginPage })));
const VerifyEmailPage = lazy(() => import('./pages/public/VerifyEmailPage').then(m => ({ default: m.VerifyEmailPage })));
const ForgotPasswordPage = lazy(() => import('./pages/public/ForgotPasswordPage').then(m => ({ default: m.ForgotPasswordPage })));
const ResetPasswordPage = lazy(() => import('./pages/public/ResetPasswordPage').then(m => ({ default: m.ResetPasswordPage })));
const TermsPage = lazy(() => import('./pages/public/TermsPage').then(m => ({ default: m.TermsPage })));
const PrivacyPage = lazy(() => import('./pages/public/PrivacyPage').then(m => ({ default: m.PrivacyPage })));
const CookiePolicyPage = lazy(() => import('./pages/public/CookiePolicyPage').then(m => ({ default: m.CookiePolicyPage })));
const NotFoundPage = lazy(() => import('./pages/public/NotFoundPage').then(m => ({ default: m.NotFoundPage })));
import { CookieConsentBanner } from './components/common/CookieConsentBanner';

// Authenticated pages loaded on demand
const DashboardPage = lazy(() => import('./pages/dashboard/DashboardPage').then(m => ({ default: m.DashboardPage })));
const ExplorePage = lazy(() => import('./pages/items/ExplorePage').then(m => ({ default: m.ExplorePage })));
const ItemDetailsPage = lazy(() => import('./pages/items/ItemDetailsPage').then(m => ({ default: m.ItemDetailsPage })));
const AddItemPage = lazy(() => import('./pages/items/AddItemPage').then(m => ({ default: m.AddItemPage })));
const EditItemPage = lazy(() => import('./pages/items/EditItemPage').then(m => ({ default: m.EditItemPage })));
const MyListingsPage = lazy(() => import('./pages/items/MyListingsPage').then(m => ({ default: m.MyListingsPage })));
const ActivityPage = lazy(() => import('./pages/activity/ActivityPage').then(m => ({ default: m.ActivityPage })));
const RequestsPage = lazy(() => import('./pages/activity/RequestsPage').then(m => ({ default: m.RequestsPage })));
const BorrowingsPage = lazy(() => import('./pages/activity/BorrowingsPage').then(m => ({ default: m.BorrowingsPage })));
const LendingPage = lazy(() => import('./pages/activity/LendingPage').then(m => ({ default: m.LendingPage })));
const NotificationsPage = lazy(() => import('./pages/notifications/NotificationsPage').then(m => ({ default: m.NotificationsPage })));
const ProfilePage = lazy(() => import('./pages/profile/ProfilePage').then(m => ({ default: m.ProfilePage })));
const UserProfilePage = lazy(() => import('./pages/profile/UserProfilePage').then(m => ({ default: m.UserProfilePage })));
const EditProfilePage = lazy(() => import('./pages/profile/EditProfilePage').then(m => ({ default: m.EditProfilePage })));
const SettingsPage = lazy(() => import('./pages/settings/SettingsPage').then(m => ({ default: m.SettingsPage })));

// Admin pages loaded on demand
const AdminDashboardPage = lazy(() => import('./pages/admin/AdminDashboardPage').then(m => ({ default: m.AdminDashboardPage })));
const ReportsPage = lazy(() => import('./pages/admin/ReportsPage').then(m => ({ default: m.ReportsPage })));

const PageFallback = () => (
  <div className="min-h-screen bg-surface-base flex flex-col items-center justify-center p-4">
    <div className="w-8 h-8 rounded-full border-2 border-brand-600 border-t-transparent animate-spin" />
    <span className="mt-3 text-xs font-medium text-ink-muted tracking-wider">Loading...</span>
  </div>
);

export function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Suspense fallback={<PageFallback />}>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/verify-email" element={<VerifyEmailPage />} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />
              <Route path="/reset-password" element={<ResetPasswordPage />} />
              <Route path="/terms" element={<TermsPage />} />
              <Route path="/terms-and-conditions" element={<TermsPage />} />
              <Route path="/privacy" element={<PrivacyPage />} />
              <Route path="/privacy-policy" element={<PrivacyPage />} />
              <Route path="/cookies" element={<CookiePolicyPage />} />
              <Route path="/cookie-policy" element={<CookiePolicyPage />} />
              <Route path="/404" element={<NotFoundPage />} />

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
              <Route path="/app/users/:userId" element={<ProtectedRoute><UserProfilePage /></ProtectedRoute>} />
              <Route path="/app/profile/edit" element={<ProtectedRoute><EditProfilePage /></ProtectedRoute>} />
              <Route path="/app/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />

              {/* Admin Routes */}
              <Route path="/admin" element={<ProtectedRoute requireAdmin><AdminDashboardPage /></ProtectedRoute>} />
              <Route path="/admin/reports" element={<ProtectedRoute requireAdmin><ReportsPage /></ProtectedRoute>} />

              {/* Catch-All Custom 404 Route */}
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </Suspense>
          <CookieConsentBanner />
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
