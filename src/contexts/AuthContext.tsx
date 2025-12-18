import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { User, UserRole, Subject } from '@/types';
import { useSupabaseAuth } from './SupabaseAuthContext';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  role: UserRole;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  switchRole: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { profile, isAuthenticated, signOut, loading } = useSupabaseAuth();
  const [role, setRole] = useState<UserRole>('student');
  const [user, setUser] = useState<User | null>(null);

  // Sync user data from Supabase profile - automatically set teacher mode for teachers on login
  useEffect(() => {
    if (profile) {
      const isTeacher = profile.user_type === 'teacher';
      const mappedUser: User = {
        id: profile.id,
        name: profile.full_name || profile.email,
        email: profile.email,
        role: isTeacher ? 'teacher' : 'student',
        avatar: profile.full_name?.split(' ').map(n => n[0]).join('').toUpperCase() || profile.email[0].toUpperCase(),
        subjects: (profile.subjects || []) as Subject[],
      };
      setUser(mappedUser);
      // Automatically set teacher mode for registered teachers on login
      setRole(isTeacher ? 'teacher' : 'student');
    } else {
      setUser(null);
    }
  }, [profile]);

  const login = async (email: string, password: string): Promise<boolean> => {
    // This is now handled by Supabase auth in Auth.tsx
    return false;
  };

  const logout = async () => {
    await signOut();
    setUser(null);
    setRole('student');
  };

  const switchRole = () => {
    // For demo/testing - toggle between student and teacher views
    if (role === 'student') {
      setRole('teacher');
      if (user) setUser({ ...user, role: 'teacher' });
    } else {
      setRole('student');
      if (user) setUser({ ...user, role: 'student' });
    }
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, role, login, logout, switchRole }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
