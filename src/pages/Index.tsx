import React from 'react';
import { MainLayout } from '@/components/layout';
import { StudentDashboard, TeacherDashboard } from '@/components/dashboard';
import { useAuth } from '@/contexts/AuthContext';

const Index: React.FC = () => {
  const { role } = useAuth();

  return (
    <MainLayout>
      {role === 'student' ? <StudentDashboard /> : <TeacherDashboard />}
    </MainLayout>
  );
};

export default Index;
