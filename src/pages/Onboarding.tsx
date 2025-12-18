import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext';
import { Loader2, GraduationCap, Users } from 'lucide-react';
import { cn } from '@/lib/utils';

const subjects = [
  { id: 'maths', label: 'Maths' },
  { id: 'chemistry', label: 'Chemistry' },
  { id: 'biology', label: 'Biology' },
  { id: 'computer-science', label: 'Computer Science' },
  { id: 'french', label: 'French' },
  { id: 'music', label: 'Music' },
];

const Onboarding: React.FC = () => {
  const navigate = useNavigate();
  const { user, refreshProfile } = useSupabaseAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [userType, setUserType] = useState<'student' | 'teacher' | null>(null);
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);

  const toggleSubject = (subjectId: string) => {
    setSelectedSubjects(prev =>
      prev.includes(subjectId)
        ? prev.filter(s => s !== subjectId)
        : [...prev, subjectId]
    );
  };

  const handleComplete = async () => {
    if (!userType) {
      toast.error('Please select your role');
      return;
    }

    if (selectedSubjects.length === 0) {
      toast.error('Please select at least one subject');
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          user_type: userType,
          subjects: selectedSubjects,
        })
        .eq('id', user?.id);

      if (error) throw error;

      refreshProfile();
      toast.success('Profile completed!');
      navigate('/');
    } catch (error: any) {
      toast.error(error.message || 'Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted p-4">
      <Card className="w-full max-w-lg card-elevated">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Complete Your Profile</CardTitle>
          <CardDescription>
            Tell us a bit about yourself to personalize your experience
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Role Selection */}
          <div className="space-y-3">
            <Label className="text-base">I am a...</Label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setUserType('student')}
                className={cn(
                  'flex flex-col items-center gap-3 p-6 rounded-xl border-2 transition-all',
                  userType === 'student'
                    ? 'border-primary bg-primary/5 shadow-md'
                    : 'border-border hover:border-primary/50 hover:bg-muted/50'
                )}
              >
                <div className={cn(
                  'w-14 h-14 rounded-full flex items-center justify-center',
                  userType === 'student' ? 'bg-primary text-primary-foreground' : 'bg-muted'
                )}>
                  <GraduationCap className="w-7 h-7" />
                </div>
                <span className="font-medium">Student</span>
              </button>

              <button
                type="button"
                onClick={() => setUserType('teacher')}
                className={cn(
                  'flex flex-col items-center gap-3 p-6 rounded-xl border-2 transition-all',
                  userType === 'teacher'
                    ? 'border-primary bg-primary/5 shadow-md'
                    : 'border-border hover:border-primary/50 hover:bg-muted/50'
                )}
              >
                <div className={cn(
                  'w-14 h-14 rounded-full flex items-center justify-center',
                  userType === 'teacher' ? 'bg-primary text-primary-foreground' : 'bg-muted'
                )}>
                  <Users className="w-7 h-7" />
                </div>
                <span className="font-medium">Teacher</span>
              </button>
            </div>
          </div>

          {/* Subject Selection */}
          <div className="space-y-3">
            <Label className="text-base">
              {userType === 'teacher' ? 'Subjects you teach' : 'Subjects you study'}
            </Label>
            <div className="grid grid-cols-2 gap-2">
              {subjects.map((subject) => (
                <div
                  key={subject.id}
                  className={cn(
                    'flex items-center gap-2 p-3 rounded-lg border cursor-pointer transition-colors',
                    selectedSubjects.includes(subject.id)
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-primary/50'
                  )}
                  onClick={() => toggleSubject(subject.id)}
                >
                  <Checkbox
                    checked={selectedSubjects.includes(subject.id)}
                    onClick={(e) => e.stopPropagation()}
                  />
                  <span className="text-sm font-medium">{subject.label}</span>
                </div>
              ))}
            </div>
          </div>

          <Button
            onClick={handleComplete}
            disabled={isLoading || !userType || selectedSubjects.length === 0}
            className="w-full"
            size="lg"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              'Get Started'
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default Onboarding;
