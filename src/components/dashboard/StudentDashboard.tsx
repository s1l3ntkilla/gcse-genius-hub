import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  BookOpen, 
  ChevronRight,
  Users,
  Sparkles,
  Loader2
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext';
import { supabase } from '@/integrations/supabase/client';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

// Subject data with colors and progress
const subjects = [
  { name: 'English', progress: 45, color: 'bg-destructive' },
  { name: 'Maths', progress: 72, color: 'bg-warning' },
  { name: 'Physics', progress: 38, color: 'bg-success' },
  { name: 'Biology', progress: 65, color: 'bg-success' },
  { name: 'Computing', progress: 82, color: 'bg-primary' },
  { name: 'Chemistry', progress: 55, color: 'bg-purple-500' },
];

interface Classmate {
  id: string;
  name: string;
  avatar: string;
}

export const StudentDashboard: React.FC = () => {
  const { user } = useAuth();
  const { user: supabaseUser } = useSupabaseAuth();
  const [classmates, setClassmates] = useState<Classmate[]>([]);
  const [totalClassmates, setTotalClassmates] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (supabaseUser) {
      fetchClassmates();
    } else {
      setLoading(false);
    }
  }, [supabaseUser]);

  const fetchClassmates = async () => {
    try {
      // Get classrooms the student is a member of
      const { data: memberships } = await supabase
        .from('classroom_members')
        .select('classroom_id')
        .eq('student_id', supabaseUser?.id)
        .eq('status', 'accepted');

      if (!memberships || memberships.length === 0) {
        setLoading(false);
        return;
      }

      const classroomIds = memberships.map(m => m.classroom_id);

      // Get all members from those classrooms (excluding current user)
      const { data: allMembers } = await supabase
        .from('classroom_members')
        .select('student_id')
        .in('classroom_id', classroomIds)
        .eq('status', 'accepted')
        .neq('student_id', supabaseUser?.id);

      if (!allMembers || allMembers.length === 0) {
        setLoading(false);
        return;
      }

      // Get unique student IDs
      const uniqueStudentIds = [...new Set(allMembers.map(m => m.student_id))];
      setTotalClassmates(uniqueStudentIds.length);

      // Fetch profiles for first 5 classmates
      const { data: profiles } = await supabase
        .from('profiles')
        .select('id, full_name')
        .in('id', uniqueStudentIds.slice(0, 5));

      if (profiles) {
        setClassmates(profiles.map(p => ({
          id: p.id,
          name: p.full_name || 'Student',
          avatar: p.full_name?.charAt(0)?.toUpperCase() || 'S'
        })));
      }
    } catch (error) {
      console.error('Error fetching classmates:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in max-w-7xl mx-auto">
      {/* Welcome Header */}
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left Section - Welcome & Subjects */}
        <div className="flex-1 space-y-8">
          {/* Welcome Card */}
          <Card className="card-elevated bg-gradient-to-br from-card to-secondary/30 overflow-hidden">
            <CardContent className="p-8">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-muted-foreground text-lg mb-2">Welcome back,</p>
                  <h1 className="font-display text-4xl font-bold text-foreground mb-4">
                    {user?.name?.split(' ')[0] || 'Student'}
                  </h1>
                  <p className="text-muted-foreground max-w-md">
                    Ready to continue learning? You're making great progress!
                  </p>
                </div>
                <div className="hidden lg:block">
                  <div className="w-24 h-24 rounded-2xl bg-primary/10 flex items-center justify-center">
                    <Sparkles className="w-12 h-12 text-primary" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Subjects Section */}
          <Card className="card-elevated">
            <CardHeader className="flex flex-row items-center justify-between pb-4">
              <CardTitle className="font-display text-xl flex items-center gap-3">
                <BookOpen className="w-6 h-6 text-primary" />
                Subjects
              </CardTitle>
              <Link to="/revision">
                <Button variant="ghost" size="sm" className="gap-1 text-primary">
                  View all <ChevronRight className="w-4 h-4" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent className="space-y-5">
              {subjects.map((subject) => (
                <div key={subject.name} className="group">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-foreground">{subject.name}</span>
                    <span className="text-sm text-muted-foreground">{subject.progress}%</span>
                  </div>
                  <div className="h-3 rounded-full bg-secondary overflow-hidden">
                    <div 
                      className={cn(
                        "h-full rounded-full transition-all duration-700 ease-out",
                        subject.color
                      )}
                      style={{ width: `${subject.progress}%` }}
                    />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Right Section - Class & Profile */}
        <div className="lg:w-80 space-y-6">
          {/* Class Section */}
          <Card className="card-elevated">
            <CardHeader className="pb-4">
              <CardTitle className="font-display text-xl flex items-center gap-3">
                <Users className="w-6 h-6 text-primary" />
                Classmates
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {loading ? (
                <div className="flex items-center justify-center py-4">
                  <Loader2 className="w-6 h-6 animate-spin text-primary" />
                </div>
              ) : classmates.length === 0 ? (
                <div className="text-center py-4">
                  <p className="text-sm text-muted-foreground">No classmates yet</p>
                  <p className="text-xs text-muted-foreground mt-1">Join a class to see your classmates</p>
                </div>
              ) : (
                <div className="flex flex-wrap gap-3">
                  {classmates.map((classmate) => (
                    <div key={classmate.id} className="relative group">
                      <Avatar className="w-12 h-12 border-2 border-card shadow-md transition-transform hover:scale-110">
                        <AvatarFallback className="font-semibold bg-primary/10 text-primary">
                          {classmate.avatar}
                        </AvatarFallback>
                      </Avatar>
                    </div>
                  ))}
                  {totalClassmates > 5 && (
                    <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center text-muted-foreground text-sm font-medium">
                      +{totalClassmates - 5}
                    </div>
                  )}
                </div>
              )}
              
              <Button variant="gradient" className="w-full mt-4" asChild>
                <Link to="/qa">
                  View Classes
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Profile Card */}
          <Card className="card-elevated">
            <CardContent className="p-6 text-center">
              <Avatar className="w-20 h-20 mx-auto mb-4 border-4 border-primary/20">
                <AvatarFallback className="bg-primary/10 text-primary text-2xl font-bold">
                  {user?.avatar || user?.name?.[0] || 'U'}
                </AvatarFallback>
              </Avatar>
              <h3 className="font-display text-xl font-bold text-foreground">
                {user?.name || 'Student'}
              </h3>
              <p className="text-muted-foreground text-sm mt-1">
                {user?.email}
              </p>
              <div className="flex items-center justify-center gap-4 mt-4 pt-4 border-t border-border">
                <div className="text-center">
                  <p className="text-2xl font-bold text-foreground">6</p>
                  <p className="text-xs text-muted-foreground">Subjects</p>
                </div>
                <div className="w-px h-8 bg-border" />
                <div className="text-center">
                  <p className="text-2xl font-bold text-foreground">56%</p>
                  <p className="text-xs text-muted-foreground">Progress</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}; 