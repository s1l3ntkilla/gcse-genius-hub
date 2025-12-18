import React, { createContext, useContext, ReactNode, useMemo, useState, useCallback } from 'react';
import { User, UserRole, Subject } from '@/types';
import { useSupabaseAuth } from './SupabaseAuthContext';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  role: UserRole; // Current viewing mode
  accountType: UserRole; // Actual account type from database
  isTeacherAccount: boolean; // Convenience flag
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  switchViewingMode: (mode: UserRole) => void; // Only works for teachers
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { profile, isAuthenticated, signOut, user: supabaseUser } = useSupabaseAuth();
  const [viewingMode, setViewingMode] = useState<UserRole | null>(null);

  // Derive user and accountType directly from profile - single source of truth
  // Use supabaseUser as fallback for email (profiles table may not have email populated)
  const { user, accountType } = useMemo(() => {
    if (!profile && !supabaseUser) {
      return { user: null, accountType: 'student' as UserRole };
    }

    // Get email from profile first, then fallback to supabase auth user
    const email = profile?.email || supabaseUser?.email || '';
    const fullName = profile?.full_name || supabaseUser?.user_metadata?.full_name || '';
    const userType = profile?.user_type || 'student';
    
    const mappedUser: User = {
      id: profile?.id || supabaseUser?.id || '',
      name: fullName || email.split('@')[0] || 'User',
      email: email,
      role: userType as UserRole,
      avatar: fullName 
        ? fullName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
        : email ? email[0].toUpperCase() : 'U',
      subjects: (profile?.subjects || []) as Subject[],
    };

    return { user: mappedUser, accountType: userType as UserRole };
  }, [profile, supabaseUser]);

  // Teachers can switch viewing modes, students always see student mode
  const isTeacherAccount = accountType === 'teacher';
  const role = viewingMode ?? accountType;

  const switchViewingMode = useCallback((mode: UserRole) => {
    // Only teachers can switch modes
    if (isTeacherAccount) {
      setViewingMode(mode);
    }
  }, [isTeacherAccount]);

  const login = async (email: string, password: string): Promise<boolean> => {
    // This is now handled by Supabase auth in Auth.tsx
    return false;
  };

  const logout = async () => {
    await signOut();
    setViewingMode(null); // Reset viewing mode on logout
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated, 
      role, 
      accountType,
      isTeacherAccount,
      login, 
      logout,
      switchViewingMode 
    }}>
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
