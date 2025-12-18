import React, { createContext, useContext, ReactNode, useMemo } from 'react';
import { User, UserRole, Subject } from '@/types';
import { useSupabaseAuth } from './SupabaseAuthContext';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  role: UserRole;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { profile, isAuthenticated, signOut } = useSupabaseAuth();

  // Derive user and role directly from profile - single source of truth
  const { user, role } = useMemo(() => {
    if (!profile) {
      return { user: null, role: 'student' as UserRole };
    }

    const userType = profile.user_type || 'student';
    const mappedUser: User = {
      id: profile.id,
      name: profile.full_name || profile.email,
      email: profile.email,
      role: userType as UserRole,
      avatar: profile.full_name?.split(' ').map(n => n[0]).join('').toUpperCase() || profile.email[0].toUpperCase(),
      subjects: (profile.subjects || []) as Subject[],
    };

    return { user: mappedUser, role: userType as UserRole };
  }, [profile]);

  const login = async (email: string, password: string): Promise<boolean> => {
    // This is now handled by Supabase auth in Auth.tsx
    return false;
  };

  const logout = async () => {
    await signOut();
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, role, login, logout }}>
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
