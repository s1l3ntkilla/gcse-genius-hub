import React, { useState } from 'react';
import { MainLayout } from '@/components/layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Video, 
  Calendar,
  Play
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import StartLessonModal from '@/components/features/StartLessonModal';
import LiveLessonView from '@/components/features/LiveLessonView';

interface LessonData {
  title: string;
  classroomId: string;
  classroomName: string;
  description: string;
}

const Lessons: React.FC = () => {
  const { role } = useAuth();
  const [startModalOpen, setStartModalOpen] = useState(false);
  const [activeLessonData, setActiveLessonData] = useState<LessonData | null>(null);

  const handleStartLesson = (lessonData: LessonData) => {
    setActiveLessonData(lessonData);
  };

  const handleEndLesson = () => {
    setActiveLessonData(null);
  };

  // If there's an active lesson, show the live lesson view
  if (activeLessonData) {
    return (
      <MainLayout>
        <LiveLessonView
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
              Join live lessons or watch recorded content
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

        {/* Lesson List View */}
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
                  {role === 'student' 
                    ? 'Scheduled lessons will appear here'
                    : 'Click "Start Live Lesson" to begin teaching'}
                </p>
                {role === 'teacher' && (
                  <Button 
                    onClick={() => setStartModalOpen(true)} 
                    className="mt-4 gap-2"
                  >
                    <Play className="w-4 h-4" />
                    Start Live Lesson
                  </Button>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="recorded" className="mt-6">
            <Card className="card-elevated">
              <CardContent className="py-12 text-center">
                <Video className="w-16 h-16 mx-auto text-muted-foreground/50 mb-4" />
                <h3 className="text-lg font-medium">No recorded lessons</h3>
                <p className="text-muted-foreground mt-1">
                  Recorded lessons will appear here for you to watch anytime
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
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
