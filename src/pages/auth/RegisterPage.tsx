import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShieldCheck, Mail, Lock, User, Building2, Stethoscope, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Select } from '../../components/common/Select';
import { UserRole } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { getRoleDashboard } from '../../components/auth/RoleProtectedRoute';

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('PATIENT');
  const [department, setDepartment] = useState('General Medicine');
  const [adminAuthCode, setAdminAuthCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Simulate backend registration call
      const registeredUser = await login(email || 'patient@schedulex.health', password, role);
      const targetDashboard = getRoleDashboard(registeredUser.role);
      navigate(targetDashboard, { replace: true });
    } catch (err) {
      console.error('Registration failed:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-700 to-indigo-600 text-white shadow-lg shadow-blue-500/25 mb-3">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Schedule<span className="text-blue-600">X</span> Registration
          </h1>
          <p className="text-xs text-slate-500 mt-1">Healthcare Portal Account Onboarding</p>
        </div>

        {/* Register Card */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xl p-6 sm:p-8">
          <h2 className="text-lg font-semibold text-slate-800 mb-1">Create an account</h2>
          <p className="text-xs text-slate-500 mb-6">Register for patient care or authorized clinical access</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Full Name & Title"
              type="text"
              placeholder="e.g. Rahul Sharma or Dr. Sarah Jenkins"
              value={name}
              onChange={(e) => setName(e.target.value)}
              leftIcon={<User className="w-4 h-4" />}
              required
            />

            <Input
              label="Email Address"
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              leftIcon={<Mail className="w-4 h-4" />}
              required
            />

            <div className="grid grid-cols-2 gap-3">
              <Select
                label="Account Role"
                value={role}
                onChange={(e) => setRole(e.target.value as UserRole)}
                leftIcon={<Stethoscope className="w-4 h-4" />}
                options={[
                  { label: 'Patient (Public Access)', value: 'PATIENT' },
                  { label: 'Doctor (Hospital Staff)', value: 'DOCTOR' },
                  { label: 'Staff / Nurse', value: 'STAFF' },
                ]}
              />

              <Select
                label="Department"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                leftIcon={<Building2 className="w-4 h-4" />}
                options={[
                  { label: 'General Medicine', value: 'General Medicine' },
                  { label: 'Cardiology', value: 'Cardiology' },
                  { label: 'Emergency Unit', value: 'Emergency Medicine' },
                  { label: 'Pediatrics', value: 'Pediatrics' },
                  { label: 'Neurology', value: 'Neurology' },
                ]}
              />
            </div>

            {/* Role Notice & Authorization Check */}
            {role === 'PATIENT' && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Patient registration is open to the public. Access health records & appointments instantly.</span>
              </div>
            )}

            {(role === 'DOCTOR' || role === 'STAFF') && (
              <div className="space-y-2">
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 text-xs flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <span>Clinical accounts require hospital administration authorization verification.</span>
                </div>
                <Input
                  label="Hospital Admin Authorization Code"
                  type="text"
                  placeholder="e.g. AUTH-2026-HOSP"
                  value={adminAuthCode}
                  onChange={(e) => setAdminAuthCode(e.target.value)}
                  required
                />
              </div>
            )}

            <Input
              label="Password"
              type="password"
              placeholder="Minimum 8 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              leftIcon={<Lock className="w-4 h-4" />}
              required
            />

            <Button
              type="submit"
              variant="primary"
              className="w-full mt-2"
              size="lg"
              isLoading={isLoading}
            >
              Complete Registration & Sign In
            </Button>
          </form>

          <div className="mt-6 pt-4 border-t border-slate-100 text-center">
            <p className="text-xs text-slate-500">
              Already registered?{' '}
              <Link to="/login" className="text-blue-600 hover:underline font-semibold">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
