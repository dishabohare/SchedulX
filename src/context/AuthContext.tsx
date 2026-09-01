import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '../types';

interface AuthContextType {
  user: User | null;
  role: UserRole | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password?: string, overrideRole?: UserRole) => Promise<User>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Preset demo users matching hospital roles
export const DEMO_USERS: Record<UserRole, User> = {
  ADMIN: {
    id: 'USR-ADMIN-01',
    name: 'Dr. Amanda Hayes',
    email: 'admin@schedulex.health',
    role: 'ADMIN',
    avatar: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=150&auto=format&fit=crop&q=80',
    departmentName: 'Chief Operations & Hospital Admin',
    specialization: 'Healthcare Operations',
    phone: '+1 (555) 901-2345',
    employeeId: 'STF-108',
    accessLevel: 'Level 1 Executive Access',
  },
  DOCTOR: {
    id: 'USR-DOC-01',
    name: 'Dr. Sarah Jenkins',
    email: 'doctor@schedulex.health',
    role: 'DOCTOR',
    avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&auto=format&fit=crop&q=80',
    departmentId: 'DEP-01',
    departmentName: 'Cardiology',
    specialization: 'Senior Cardiologist',
    phone: '+1 (555) 345-6789',
    employeeId: 'DOC-101',
    accessLevel: 'Clinical Practitioner Access',
  },
  STAFF: {
    id: 'USR-STAFF-01',
    name: 'Anita Verma, RN',
    email: 'staff@schedulex.health',
    role: 'STAFF',
    avatar: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=150&auto=format&fit=crop&q=80',
    departmentId: 'DEP-02',
    departmentName: 'Emergency Unit',
    specialization: 'Head Charge Nurse',
    phone: '+1 (555) 789-0123',
    employeeId: 'NUR-204',
    accessLevel: 'Nursing Staff Access',
  },
  PATIENT: {
    id: 'PAT-2026-8842',
    name: 'Rahul Sharma',
    email: 'patient@schedulex.health',
    role: 'PATIENT',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    departmentName: 'General Care',
    specialization: 'Registered Patient',
    phone: '+91 98765 43210',
    dob: '1992-05-14',
    gender: 'Male',
    bloodGroup: 'O+',
    address: '42 MG Road, Sector 4, Bangalore, Karnataka',
    emergencyContact: {
      name: 'Priya Sharma',
      phone: '+91 98765 43211',
      relationship: 'Spouse',
    },
  },
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Initialize auth from localStorage
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('schedulex_user');
      const storedToken = localStorage.getItem('schedulex_token');

      if (storedUser && storedToken) {
        setUser(JSON.parse(storedUser));
        setToken(storedToken);
      } else {
        // Default initial session for immediate demonstration preview: ADMIN
        const defaultAdmin = DEMO_USERS.ADMIN;
        setUser(defaultAdmin);
        setToken('demo_jwt_token_admin');
        localStorage.setItem('schedulex_user', JSON.stringify(defaultAdmin));
        localStorage.setItem('schedulex_token', 'demo_jwt_token_admin');
      }
    } catch (e) {
      console.error('Failed to load stored auth session:', e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = async (email: string, _password?: string, overrideRole?: UserRole): Promise<User> => {
    setIsLoading(true);

    // Simulated authenticating latency
    await new Promise((res) => setTimeout(res, 400));

    let authenticatedUser: User;

    if (overrideRole && DEMO_USERS[overrideRole]) {
      authenticatedUser = DEMO_USERS[overrideRole];
    } else {
      // Find matching demo user by email or role
      const lower = email.toLowerCase();
      if (lower.includes('admin')) authenticatedUser = DEMO_USERS.ADMIN;
      else if (lower.includes('doctor')) authenticatedUser = DEMO_USERS.DOCTOR;
      else if (lower.includes('staff') || lower.includes('nurse')) authenticatedUser = DEMO_USERS.STAFF;
      else if (lower.includes('patient')) authenticatedUser = DEMO_USERS.PATIENT;
      else authenticatedUser = { ...DEMO_USERS.PATIENT, email };
    }

    const mockToken = `jwt_token_${authenticatedUser.role.toLowerCase()}_${Date.now()}`;
    setUser(authenticatedUser);
    setToken(mockToken);
    localStorage.setItem('schedulex_user', JSON.stringify(authenticatedUser));
    localStorage.setItem('schedulex_token', mockToken);

    setIsLoading(false);
    return authenticatedUser;
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('schedulex_user');
    localStorage.removeItem('schedulex_token');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role: user?.role || null,
        token,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
