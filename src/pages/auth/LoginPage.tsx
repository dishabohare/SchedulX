import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShieldCheck, Mail, Lock, UserCheck, Stethoscope, HeartPulse, User, ArrowRight } from 'lucide-react';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Select } from '../../components/common/Select';
import { UserRole } from '../../types';
import { useAuth, DEMO_USERS } from '../../context/AuthContext';
import { getRoleDashboard } from '../../components/auth/RoleProtectedRoute';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState('admin@schedulex.health');
  const [password, setPassword] = useState('••••••••••••');
  const [role, setRole] = useState<UserRole>('ADMIN');
  const [isLoading, setIsLoading] = useState(false);

  const handleRoleSelect = (selectedRole: UserRole) => {
    setRole(selectedRole);
    setEmail(DEMO_USERS[selectedRole].email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const loggedUser = await login(email, password, role);
      const targetDashboard = getRoleDashboard(loggedUser.role);
      navigate(targetDashboard, { replace: true });
    } catch (err) {
      console.error('Login error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo & Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-700 to-indigo-600 text-white shadow-lg shadow-blue-500/25 mb-4">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Schedule<span className="text-blue-600">X</span> Healthcare Portal
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Intelligent Role-Based Healthcare SaaS Application
          </p>
        </div>

        {/* Quick Role Selection Preset Bar */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-3 mb-4 shadow-sm">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 text-center">
            Quick Demo Login — Select Role
          </p>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              type="button"
              onClick={() => handleRoleSelect('ADMIN')}
              className={`p-2 rounded-xl border flex items-center gap-2 transition-all ${
                role === 'ADMIN'
                  ? 'border-blue-600 bg-blue-50 text-blue-900 font-bold shadow-xs'
                  : 'border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0" />
              <span className="truncate">Admin</span>
            </button>

            <button
              type="button"
              onClick={() => handleRoleSelect('DOCTOR')}
              className={`p-2 rounded-xl border flex items-center gap-2 transition-all ${
                role === 'DOCTOR'
                  ? 'border-indigo-600 bg-indigo-50 text-indigo-900 font-bold shadow-xs'
                  : 'border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              <Stethoscope className="w-4 h-4 text-indigo-600 shrink-0" />
              <span className="truncate">Doctor</span>
            </button>

            <button
              type="button"
              onClick={() => handleRoleSelect('STAFF')}
              className={`p-2 rounded-xl border flex items-center gap-2 transition-all ${
                role === 'STAFF'
                  ? 'border-teal-600 bg-teal-50 text-teal-900 font-bold shadow-xs'
                  : 'border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              <HeartPulse className="w-4 h-4 text-teal-600 shrink-0" />
              <span className="truncate">Staff / Nurse</span>
            </button>

            <button
              type="button"
              onClick={() => handleRoleSelect('PATIENT')}
              className={`p-2 rounded-xl border flex items-center gap-2 transition-all ${
                role === 'PATIENT'
                  ? 'border-emerald-600 bg-emerald-50 text-emerald-900 font-bold shadow-xs'
                  : 'border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              <User className="w-4 h-4 text-emerald-600 shrink-0" />
              <span className="truncate">Patient</span>
            </button>
          </div>
        </div>

        {/* Login Card Form */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xl p-6 sm:p-8">
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-slate-800">Sign in to your portal</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Logging in as: <strong className="text-blue-600">{role}</strong> ({DEMO_USERS[role].name})
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Email Address"
              type="email"
              placeholder="name@schedulex.health"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              leftIcon={<Mail className="w-4 h-4" />}
              required
            />

            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              leftIcon={<Lock className="w-4 h-4" />}
              required
            />

            <Select
              label="Active Portal Role"
              value={role}
              onChange={(e) => handleRoleSelect(e.target.value as UserRole)}
              leftIcon={<UserCheck className="w-4 h-4" />}
              options={[
                { label: 'Hospital Administrator (ADMIN)', value: 'ADMIN' },
                { label: 'Attending Doctor (DOCTOR)', value: 'DOCTOR' },
                { label: 'Nursing & Shift Staff (STAFF)', value: 'STAFF' },
                { label: 'Patient Portal Access (PATIENT)', value: 'PATIENT' },
              ]}
            />

            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-slate-600">
                <input type="checkbox" defaultChecked className="rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
                Remember credentials
              </label>
              <a href="#forgot" onClick={(e) => e.preventDefault()} className="text-blue-600 hover:underline font-medium">
                Forgot password?
              </a>
            </div>

            <Button
              type="submit"
              variant="primary"
              className="w-full mt-2"
              size="lg"
              isLoading={isLoading}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Sign In to {role} Portal
            </Button>
          </form>

          {/* Registration link */}
          <div className="mt-6 pt-4 border-t border-slate-100 text-center">
            <p className="text-xs text-slate-500">
              New patient or staff member?{' '}
              <Link to="/register" className="text-blue-600 hover:underline font-semibold">
                Register an account
              </Link>
            </p>
          </div>
        </div>

        {/* Footer Note */}
        <p className="text-[11px] text-slate-400 text-center mt-6">
          ScheduleX Enterprise Healthcare UI &bull; Prepared for Spring Boot JWT Authentication
        </p>
      </div>
    </div>
  );
};
