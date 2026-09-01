import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { DashboardLayout } from '../layouts/DashboardLayout';
import { LoginPage } from '../pages/auth/LoginPage';
import { RegisterPage } from '../pages/auth/RegisterPage';

// Admin Pages
import { AdminDashboardPage } from '../pages/admin/AdminDashboardPage';
import { StaffPage } from '../pages/admin/StaffPage';
import { DepartmentsPage } from '../pages/admin/DepartmentsPage';
import { AdminLeavesPage } from '../pages/admin/AdminLeavesPage';
import { ResourcesPage } from '../pages/admin/ResourcesPage';
import { AdminSchedulePage } from '../pages/admin/AdminSchedulePage';

// Doctor Pages
import { DoctorDashboardPage } from '../pages/doctor/DoctorDashboardPage';

// Staff Pages
import { StaffDashboardPage } from '../pages/staff/StaffDashboardPage';
import { AvailabilityPage } from '../pages/staff-portal/AvailabilityPage';
import { MyLeavesPage } from '../pages/staff-portal/MyLeavesPage';

// Patient Pages
import { PatientDashboardPage } from '../pages/patient/PatientDashboardPage';
import { FindDoctorPage } from '../pages/patient/FindDoctorPage';
import { BookAppointmentPage } from '../pages/patient/BookAppointmentPage';
import { MyAppointmentsPage } from '../pages/patient/MyAppointmentsPage';
import { MedicalHistoryPage } from '../pages/patient/MedicalHistoryPage';
import { PrescriptionsPage } from '../pages/patient/PrescriptionsPage';
import { DocumentsPage } from '../pages/patient/DocumentsPage';
import { InsurancePage } from '../pages/patient/InsurancePage';
import { PatientProfilePage } from '../pages/patient/PatientProfilePage';

// General Pages
import { NotificationsPage } from '../pages/NotificationsPage';
import { ProfilePage } from '../pages/ProfilePage';
import { NotFoundPage } from '../pages/NotFoundPage';

// Auth Protection Guards
import { ProtectedRoute } from '../components/auth/ProtectedRoute';
import { RoleProtectedRoute, getRoleDashboard } from '../components/auth/RoleProtectedRoute';
import { useAuth } from '../context/AuthContext';

const HomeRedirect: React.FC = () => {
  const { role } = useAuth();
  return <Navigate to={getRoleDashboard(role)} replace />;
};

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Public Auth Routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Authenticated Protected Layout Container */}
      <Route
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        {/* Dynamic Root Redirect based on authenticated user's role */}
        <Route path="/" element={<HomeRedirect />} />

        {/* ==========================================
            ADMIN PORTAL ROUTES (ADMIN ONLY)
           ========================================== */}
        <Route
          path="/admin/dashboard"
          element={
            <RoleProtectedRoute allowedRoles={['ADMIN']}>
              <AdminDashboardPage />
            </RoleProtectedRoute>
          }
        />
        <Route
          path="/admin/staff"
          element={
            <RoleProtectedRoute allowedRoles={['ADMIN']}>
              <StaffPage />
            </RoleProtectedRoute>
          }
        />
        <Route
          path="/admin/departments"
          element={
            <RoleProtectedRoute allowedRoles={['ADMIN']}>
              <DepartmentsPage />
            </RoleProtectedRoute>
          }
        />
        <Route
          path="/admin/leaves"
          element={
            <RoleProtectedRoute allowedRoles={['ADMIN']}>
              <AdminLeavesPage />
            </RoleProtectedRoute>
          }
        />
        <Route
          path="/admin/resources"
          element={
            <RoleProtectedRoute allowedRoles={['ADMIN']}>
              <ResourcesPage />
            </RoleProtectedRoute>
          }
        />
        <Route
          path="/admin/schedule"
          element={
            <RoleProtectedRoute allowedRoles={['ADMIN']}>
              <AdminSchedulePage />
            </RoleProtectedRoute>
          }
        />

        {/* ==========================================
            DOCTOR PORTAL ROUTES (DOCTOR ONLY)
           ========================================== */}
        <Route
          path="/doctor"
          element={<Navigate to="/doctor/dashboard" replace />}
        />
        <Route
          path="/doctor/dashboard"
          element={
            <RoleProtectedRoute allowedRoles={['DOCTOR']}>
              <DoctorDashboardPage />
            </RoleProtectedRoute>
          }
        />
        <Route
          path="/doctor/schedule"
          element={
            <RoleProtectedRoute allowedRoles={['DOCTOR']}>
              <AdminSchedulePage />
            </RoleProtectedRoute>
          }
        />
        <Route
          path="/doctor/appointments"
          element={
            <RoleProtectedRoute allowedRoles={['DOCTOR']}>
              <MyAppointmentsPage />
            </RoleProtectedRoute>
          }
        />

        {/* ==========================================
            STAFF PORTAL ROUTES (STAFF ONLY)
           ========================================== */}
        <Route
          path="/staff"
          element={<Navigate to="/staff/dashboard" replace />}
        />
        <Route
          path="/staff/dashboard"
          element={
            <RoleProtectedRoute allowedRoles={['STAFF']}>
              <StaffDashboardPage />
            </RoleProtectedRoute>
          }
        />
        <Route
          path="/staff/schedule"
          element={
            <RoleProtectedRoute allowedRoles={['STAFF']}>
              <AdminSchedulePage />
            </RoleProtectedRoute>
          }
        />
        <Route
          path="/staff/appointments"
          element={
            <RoleProtectedRoute allowedRoles={['STAFF']}>
              <MyAppointmentsPage />
            </RoleProtectedRoute>
          }
        />
        <Route
          path="/availability"
          element={
            <RoleProtectedRoute allowedRoles={['STAFF', 'DOCTOR', 'ADMIN']}>
              <AvailabilityPage />
            </RoleProtectedRoute>
          }
        />
        <Route
          path="/my-leaves"
          element={
            <RoleProtectedRoute allowedRoles={['STAFF', 'DOCTOR', 'ADMIN']}>
              <MyLeavesPage />
            </RoleProtectedRoute>
          }
        />

        {/* ==========================================
            PATIENT PORTAL ROUTES (PATIENT ONLY)
           ========================================== */}
        <Route path="/patient" element={<Navigate to="/patient/dashboard" replace />} />
        <Route
          path="/patient/dashboard"
          element={
            <RoleProtectedRoute allowedRoles={['PATIENT']}>
              <PatientDashboardPage />
            </RoleProtectedRoute>
          }
        />
        <Route
          path="/patient/doctors"
          element={
            <RoleProtectedRoute allowedRoles={['PATIENT']}>
              <FindDoctorPage />
            </RoleProtectedRoute>
          }
        />
        <Route
          path="/patient/book-appointment"
          element={
            <RoleProtectedRoute allowedRoles={['PATIENT']}>
              <BookAppointmentPage />
            </RoleProtectedRoute>
          }
        />
        <Route
          path="/patient/appointments"
          element={
            <RoleProtectedRoute allowedRoles={['PATIENT']}>
              <MyAppointmentsPage />
            </RoleProtectedRoute>
          }
        />
        <Route
          path="/patient/medical-history"
          element={
            <RoleProtectedRoute allowedRoles={['PATIENT']}>
              <MedicalHistoryPage />
            </RoleProtectedRoute>
          }
        />
        <Route
          path="/patient/prescriptions"
          element={
            <RoleProtectedRoute allowedRoles={['PATIENT']}>
              <PrescriptionsPage />
            </RoleProtectedRoute>
          }
        />
        <Route
          path="/patient/documents"
          element={
            <RoleProtectedRoute allowedRoles={['PATIENT']}>
              <DocumentsPage />
            </RoleProtectedRoute>
          }
        />
        <Route
          path="/patient/insurance"
          element={
            <RoleProtectedRoute allowedRoles={['PATIENT']}>
              <InsurancePage />
            </RoleProtectedRoute>
          }
        />
        <Route
          path="/patient/profile"
          element={
            <RoleProtectedRoute allowedRoles={['PATIENT']}>
              <PatientProfilePage />
            </RoleProtectedRoute>
          }
        />

        {/* General Authenticated Routes */}
        <Route path="/notifications" element={<NotificationsPage />} />
        <Route path="/profile" element={<ProfilePage />} />

        {/* Fallback */}
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
};
