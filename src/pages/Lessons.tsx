import React, { useState, useEffect } from 'react';
import { MainLayout } from '@/components/layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Video, 
  Calendar,
  Play,
  Users,
  Loader2
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import StartLessonModal from '@/components/features/StartLessonModal';
import LiveLessonView from '@/components/features/LiveLessonView';

interface LessonData {
  title: string;
  classroomId: string;
  classroomName: string;
  description: string;
}

interface ActiveLesson {
  id: string;
  title: string;
  description: string | null;
  classroom_id: string;
  teacher_id: string;
  started_at: string;
  classroom_name?: string;
  teacher_name?: string;
  participant_count?: number;
}

const Lessons: React.FC = () => {
  const { role } = useAuth();
  const { user, profile } = useSupabaseAuth();
  const [startModalOpen, setStartModalOpen] = useState(false);
  const [activeLessonId, setActiveLessonId] = useState<string | null>(null);
  const [activeLessonData, setActiveLessonData] = useState<LessonData | null>(null);
  const [availableLessons, setAvailableLessons] = useState<ActiveLesson[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch available lessons for students
  useEffect(() => {
    if (role === 'student' && user) {
      fetchAvailableLessons();
      
      // Subscribe to lesson updates
      const channel = supabase
        .channel('available-lessons')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'live_lessons'
          },
          () => {
            fetchAvailableLessons();
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    } else {
      setLoading(false);
    }
  }, [role, user]);

  const fetchAvailableLessons = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      // Get classrooms the student is a member of
      const { data: memberships } = await supabase
        .from('classroom_members')
        .select('classroom_id')
        .eq('student_id', user.id)
        .eq('status', 'accepted');

      if (!memberships || memberships.length === 0) {
        setAvailableLessons([]);
        setLoading(false);
        return;
      }

      const classroomIds = memberships.map(m => m.classroom_id);

      // Fetch active lessons for those classrooms
      const { data: lessons, error } = await supabase
        .from('live_lessons')
        .select('*')
        .in('classroom_id', classroomIds)
        .eq('status', 'active')
        .order('started_at', { ascending: false });

      if (error) throw error;

      // Enrich with classroom names and participant counts
      const enrichedLessons = await Promise.all(
        (lessons || []).map(async (lesson) => {
          const { data: classroom } = await supabase
            .from('classrooms')
            .select('name')
            .eq('id', lesson.classroom_id)
            .single();

          const { count } = await supabase
            .from('live_lesson_participants')
            .select('*', { count: 'exact', head: true })
            .eq('lesson_id', lesson.id)
            .is('left_at', null);

          const { data: teacherProfile } = await supabase
            .from('profiles')
            .select('full_name')
            .eq('id', lesson.teacher_id)
            .single();

          return {
            ...lesson,
            classroom_name: classroom?.name || 'Unknown',
            teacher_name: teacherProfile?.full_name || 'Teacher',
            participant_count: count || 0
          };
        })
      );

      setAvailableLessons(enrichedLessons);
    } catch (error) {
      console.error('Error fetching lessons:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStartLesson = (lessonId: string, lessonData: LessonData) => {
    setActiveLessonId(lessonId);
    setActiveLessonData(lessonData);
  };

  const handleJoinLesson = (lesson: ActiveLesson) => {
    setActiveLessonId(lesson.id);
    setActiveLessonData({
      title: lesson.title,
      classroomId: lesson.classroom_id,
      classroomName: lesson.classroom_name || 'Unknown',
      description: lesson.description || ''
    });
  };

  const handleEndLesson = () => {
    setActiveLessonId(null);
    setActiveLessonData(null);
    if (role === 'student') {
      fetchAvailableLessons();
    }
  };

  // If there's an active lesson, show the live lesson view
  if (activeLessonId && activeLessonData) {
    return (
      <MainLayout>
        <LiveLessonView
          lessonId={activeLessonId}
          lessonData={activeLessonData}
          onEndLesson={handleEndLesson}
          role={role as 'student' | 'teacher'}
        />
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl font-bold text-foreground flex items-center gap-3">
              <Video className="w-8 h-8 text-primary" />
              Virtual Lessons
            </h1>
            <p className="text-muted-foreground mt-1">
              {role === 'student' ? 'Join live lessons from your teachers' : 'Start and manage live lessons'}
            </p>
          </div>
          {role === 'teacher' && (
            <Button 
              onClick={() => setStartModalOpen(true)} 
              className="bg-primary hover:bg-primary-dark gap-2"
            >
              <Play className="w-4 h-4" />
              Start Live Lesson
            </Button>
          )}
        </div>

        {/* Student View - Show active lessons */}
        {role === 'student' && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <div className="w-2 h-2 bg-destructive rounded-full animate-pulse" />
              Live Now
            </h2>
            
            {loading ? (
              <Card className="card-elevated">
                <CardContent className="py-12 text-center">
                  <Loader2 className="w-8 h-8 mx-auto animate-spin text-primary mb-4" />
                  <p className="text-muted-foreground">Loading available lessons...</p>
                </CardContent>
              </Card>
            ) : availableLessons.length === 0 ? (
              <Card className="card-elevated">
                <CardContent className="py-12 text-center">
                  <Video className="w-16 h-16 mx-auto text-muted-foreground/50 mb-4" />
                  <h3 className="text-lg font-medium">No live lessons</h3>
                  <p className="text-muted-foreground mt-1">
                    There are no active lessons right now. Check back later.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {availableLessons.map((lesson) => (
                  <Card key={lesson.id} className="card-elevated hover:shadow-lg transition-shadow">
                    <CardHeader className="pb-2">
                      <div className="flex items-start justify-between">
                        <CardTitle className="text-lg">{lesson.title}</CardTitle>
                        <Badge variant="destructive" className="gap-1">
                          <div className="w-2 h-2 bg-destructive-foreground rounded-full animate-pulse" />
                          Live
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {lesson.classroom_name} - {lesson.teacher_name}
                      </p>
                    </CardHeader>
                    <CardContent>
                      {lesson.description && (
                        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                          {lesson.description}
                        </p>
                      )}
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          {lesson.participant_count} participant{lesson.participant_count !== 1 ? 's' : ''}
                        </span>
                        <Button onClick={() => handleJoinLesson(lesson)} className="gap-2">
                          <Play className="w-4 h-4" />
                          Join
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Teacher View - Lesson List */}
        {role === 'teacher' && (
          <Tabs defaultValue="upcoming">
            <TabsList>
              <TabsTrigger value="upcoming" className="gap-2">
                <Calendar className="w-4 h-4" />
                Upcoming (0)
              </TabsTrigger>
              <TabsTrigger value="recorded" className="gap-2">
                <Video className="w-4 h-4" />
                Recorded (0)
              </TabsTrigger>
            </TabsList>

            <TabsContent value="upcoming" className="mt-6">
              <Card className="card-elevated">
                <CardContent className="py-12 text-center">
                  <Calendar className="w-16 h-16 mx-auto text-muted-foreground/50 mb-4" />
                  <h3 className="text-lg font-medium">No upcoming lessons</h3>
                  <p className="text-muted-foreground mt-1">
                    Click "Start Live Lesson" to begin teaching now
                  </p>
                  <Button 
                    onClick={() => setStartModalOpen(true)} 
                    className="mt-4 gap-2"
                  >
                    <Play className="w-4 h-4" />
                    Start Live Lesson
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="recorded" className="mt-6">
              <Card className="card-elevated">
                <CardContent className="py-12 text-center">
                  <Video className="w-16 h-16 mx-auto text-muted-foreground/50 mb-4" />
                  <h3 className="text-lg font-medium">No recorded lessons</h3>
                  <p className="text-muted-foreground mt-1">
                    Recorded lessons will appear here for students to watch anytime
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        )}
      </div>

      {/* Start Lesson Modal */}
      <StartLessonModal
        open={startModalOpen}
        onOpenChange={setStartModalOpen}
        onStartLesson={handleStartLesson}
      />
    </MainLayout>
  );
};

export default Lessons;
