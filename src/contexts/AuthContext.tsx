import React, { createContext, useContext, useState, ReactNode } from 'react';
import { User, UserRole } from '@/types';
import { sampleStudents, sampleTeachers } from '@/data/sampleData';

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
  const [user, setUser] = useState<User | null>(sampleStudents[0]);
  const [role, setRole] = useState<UserRole>('student');

  const login = async (email: string, password: string): Promise<boolean> => {
    // Mock login - in real app, this would call an API
    const allUsers = [...sampleStudents, ...sampleTeachers];
    const foundUser = allUsers.find(u => u.email === email);
    
    if (foundUser) {
      setUser(foundUser);
      setRole(foundUser.role);
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    setRole('student');
  };

  const switchRole = () => {
    if (role === 'student') {
      setUser(sampleTeachers[0]);
      setRole('teacher');
    } else {
      setUser(sampleStudents[0]);
      setRole('student');
    }
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, role, login, logout, switchRole }}>
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
