import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

// Layout
import { DashboardLayout } from './components/layout';

// Auth Pages
import { Login, ForgotPassword, ResetPassword } from './pages/auth';

// Admin Pages
import {
  Dashboard as AdminDashboard,
  UserManagement,
  AcademicSetup
} from './pages/admin';

// Formateur Pages
import {
  Dashboard as FormateurDashboard,
  Grades as FormateurGrades,
  Attendance as FormateurAttendance,
  Schedule as FormateurSchedule,
  Students as FormateurStudents
} from './pages/formateur';

// Stagiaire Pages
import {
  Dashboard as StagiaireDashboard,
  MyGrades,
  MyAttendance,
  Resources
} from './pages/stagiaire';

// Shared Pages
import Profile from './pages/Profile';
import Notifications from './pages/Notifications';
import NotFound from './pages/NotFound';
import Forbidden from './pages/Forbidden';
import ServerError from './pages/ServerError';
import Maintenance from './pages/Maintenance';

// Protected Route
import ProtectedRoute from './routes/ProtectedRoute';

// Admin Layout Wrapper
const AdminLayout = () => (
  <ProtectedRoute allowedRoles={['admin']}>
    <DashboardLayout role="admin" pageTitle="Admin Dashboard" />
  </ProtectedRoute>
);

// Formateur Layout Wrapper
const FormateurLayout = () => (
  <ProtectedRoute allowedRoles={['formateur']}>
    <DashboardLayout role="formateur" pageTitle="Formateur Dashboard" />
  </ProtectedRoute>
);

// Stagiaire Layout Wrapper
const StagiaireLayout = () => (
  <ProtectedRoute allowedRoles={['stagiaire']}>
    <DashboardLayout role="stagiaire" pageTitle="Student Dashboard" />
  </ProtectedRoute>
);

function App() {
  const { user, isAuthenticated } = useAuth();

  // Redirect authenticated users to their dashboard
  const getHomeRedirect = () => {
    if (!isAuthenticated()) return '/login';
    const routes = {
      admin: '/admin/dashboard',
      formateur: '/formateur/dashboard',
      stagiaire: '/stagiaire/dashboard',
    };
    return routes[user?.role] || '/login';
  };

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />

      {/* Error/Status Pages */}
      <Route path="/403" element={<Forbidden />} />
      <Route path="/500" element={<ServerError />} />
      <Route path="/maintenance" element={<Maintenance />} />

      {/* Admin Routes */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="users" element={<UserManagement />} />
        <Route path="classes" element={<AcademicSetup />} />
        <Route path="modules" element={<Navigate to="../classes" replace />} />
        <Route path="statistics" element={<AdminDashboard />} />
        <Route path="settings" element={<Profile />} />
      </Route>

      {/* Formateur Routes */}
      <Route path="/formateur" element={<FormateurLayout />}>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<FormateurDashboard />} />
        <Route path="modules" element={<FormateurDashboard />} />
        <Route path="schedule" element={<FormateurSchedule />} />
        <Route path="students" element={<FormateurStudents />} />
        <Route path="grades" element={<FormateurGrades />} />
        <Route path="attendance" element={<FormateurAttendance />} />
        <Route path="reports" element={<FormateurDashboard />} />
        <Route path="settings" element={<Profile />} />
      </Route>

      {/* Stagiaire Routes */}
      <Route path="/stagiaire" element={<StagiaireLayout />}>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<StagiaireDashboard />} />
        <Route path="grades" element={<MyGrades />} />
        <Route path="attendance" element={<MyAttendance />} />
        <Route path="resources" element={<Resources />} />
        <Route path="settings" element={<Profile />} />
      </Route>

      {/* Shared Routes (accessible by all authenticated users) */}
      <Route path="/profile" element={
        <ProtectedRoute>
          <DashboardLayout role={user?.role || 'stagiaire'} pageTitle="Profile">
            <Profile />
          </DashboardLayout>
        </ProtectedRoute>
      } />
      <Route path="/notifications" element={
        <ProtectedRoute>
          <DashboardLayout role={user?.role || 'stagiaire'} pageTitle="Notifications">
            <Notifications />
          </DashboardLayout>
        </ProtectedRoute>
      } />

      {/* Home Redirect */}
      <Route path="/" element={<Navigate to={getHomeRedirect()} replace />} />

      {/* 404 Catch-all */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
