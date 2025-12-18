import React, { useState } from 'react';
import { MainLayout } from '@/components/layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Textarea } from '@/components/ui/textarea';
import { 
  Video, 
  Play, 
  Pause, 
  Clock, 
  Calendar,
  FileText,
  Mic,
  MicOff,
  VideoIcon,
  VideoOff,
  Users,
  MessageSquare,
  BookOpen,
  ChevronRight,
  Volume2,
  Maximize2,
  Settings
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';

const Lessons: React.FC = () => {
  const { role } = useAuth();
  const [notes, setNotes] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(true);

  // Empty state - no mock data
  const scheduledLessons: any[] = [];
  const recordedLessons: any[] = [];

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
            <Button className="bg-primary hover:bg-primary-dark gap-2">
              <Video className="w-4 h-4" />
              Start New Lesson
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
                    : 'Click "Start New Lesson" to schedule a lesson'}
                </p>
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
    </MainLayout>
  );
};

export default Lessons;
