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
import { sampleLessons, sampleTeachers, getSubjectLabel, getSubjectColor } from '@/data/sampleData';
import { useAuth } from '@/contexts/AuthContext';
import { Lesson } from '@/types';

const Lessons: React.FC = () => {
  const { role } = useAuth();
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [notes, setNotes] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(true);

  const scheduledLessons = sampleLessons.filter(l => l.status === 'scheduled');
  const recordedLessons = sampleLessons.filter(l => l.status === 'recorded');

  const viewLesson = (lesson: Lesson) => {
    setSelectedLesson(lesson);
  };

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

        {selectedLesson ? (
          // Lesson View
          <div className="grid lg:grid-cols-4 gap-6">
            {/* Main Video Area */}
            <div className="lg:col-span-3 space-y-4">
              <Card className="card-elevated overflow-hidden">
                {/* Video Player */}
                <div className="relative aspect-video bg-foreground/5">
                  <div className="absolute inset-0 flex items-center justify-center">
                    {selectedLesson.status === 'recorded' ? (
                      <div className="text-center">
                        <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
                          {isPlaying ? (
                            <Pause className="w-10 h-10 text-primary" />
                          ) : (
                            <Play className="w-10 h-10 text-primary ml-1" />
                          )}
                        </div>
                        <p className="text-muted-foreground">
                          {isPlaying ? 'Playing...' : 'Click to play'}
                        </p>
                      </div>
                    ) : (
                      <div className="text-center">
                        <div className="w-20 h-20 rounded-full bg-success/20 flex items-center justify-center mx-auto mb-4 animate-pulse">
                          <Video className="w-10 h-10 text-success" />
                        </div>
                        <p className="text-success font-medium">Live Lesson</p>
                        <p className="text-muted-foreground text-sm mt-1">
                          Starts at {selectedLesson.scheduledTime.toLocaleTimeString([], { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Video Controls */}
                  <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="text-white hover:bg-white/20"
                          onClick={() => setIsPlaying(!isPlaying)}
                        >
                          {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="text-white hover:bg-white/20"
                          onClick={() => setIsMuted(!isMuted)}
                        >
                          <Volume2 className="w-5 h-5" />
                        </Button>
                        <span className="text-white text-sm ml-2">0:00 / {selectedLesson.duration}:00</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon" className="text-white hover:bg-white/20">
                          <Settings className="w-5 h-5" />
                        </Button>
                        <Button variant="ghost" size="icon" className="text-white hover:bg-white/20">
                          <Maximize2 className="w-5 h-5" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Lesson Info */}
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h2 className="font-display text-xl font-semibold">
                        {selectedLesson.title}
                      </h2>
                      <div className="flex items-center gap-3 mt-2">
                        <Badge className={getSubjectColor(selectedLesson.subject)}>
                          {getSubjectLabel(selectedLesson.subject)}
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          {sampleTeachers.find(t => t.id === selectedLesson.teacherId)?.name}
                        </span>
                        <span className="text-sm text-muted-foreground flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {selectedLesson.duration} min
                        </span>
                      </div>
                    </div>
                    <Button variant="outline" onClick={() => setSelectedLesson(null)}>
                      Back to List
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Live Controls (for live lessons) */}
              {selectedLesson.status === 'scheduled' && (
                <Card className="card-elevated">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-center gap-4">
                      <Button 
                        variant={isMuted ? "destructive" : "outline"}
                        size="lg"
                        className="gap-2"
                        onClick={() => setIsMuted(!isMuted)}
                      >
                        {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                        {isMuted ? 'Unmute' : 'Mute'}
                      </Button>
                      <Button 
                        variant={!isVideoOn ? "destructive" : "outline"}
                        size="lg"
                        className="gap-2"
                        onClick={() => setIsVideoOn(!isVideoOn)}
                      >
                        {isVideoOn ? <VideoIcon className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
                        {isVideoOn ? 'Stop Video' : 'Start Video'}
                      </Button>
                      <Button variant="destructive" size="lg" className="gap-2">
                        Leave Lesson
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-4">
              {/* Chapters */}
              {selectedLesson.chapters && (
                <Card className="card-elevated">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <BookOpen className="w-4 h-4" />
                      Chapters
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-2">
                    <div className="space-y-1">
                      {selectedLesson.chapters.map((chapter, index) => (
                        <button
                          key={chapter.id}
                          className="w-full p-2 rounded-lg text-left hover:bg-muted transition-colors flex items-center gap-2"
                        >
                          <span className="text-xs text-muted-foreground w-12">
                            {Math.floor(chapter.timestamp / 60)}:{(chapter.timestamp % 60).toString().padStart(2, '0')}
                          </span>
                          <span className="text-sm truncate">{chapter.title}</span>
                        </button>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Notes */}
              <Card className="card-elevated">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    My Notes
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-3">
                  <Textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Take notes during the lesson..."
                    className="min-h-[200px] resize-none"
                  />
                  <Button className="w-full mt-2" variant="outline" size="sm">
                    Save Notes
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        ) : (
          // Lesson List View
          <Tabs defaultValue="upcoming">
            <TabsList>
              <TabsTrigger value="upcoming" className="gap-2">
                <Calendar className="w-4 h-4" />
                Upcoming ({scheduledLessons.length})
              </TabsTrigger>
              <TabsTrigger value="recorded" className="gap-2">
                <Video className="w-4 h-4" />
                Recorded ({recordedLessons.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="upcoming" className="mt-6">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {scheduledLessons.map((lesson) => {
                  const teacher = sampleTeachers.find(t => t.id === lesson.teacherId);
                  return (
                    <Card key={lesson.id} className="card-interactive">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <Badge className={getSubjectColor(lesson.subject)}>
                            {getSubjectLabel(lesson.subject)}
                          </Badge>
                          <Badge variant="outline" className="text-success border-success">
                            Upcoming
                          </Badge>
                        </div>
                        <h3 className="font-medium mb-2">{lesson.title}</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                          with {teacher?.name}
                        </p>
                        <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {lesson.scheduledTime.toLocaleDateString()}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {lesson.scheduledTime.toLocaleTimeString([], { 
                              hour: '2-digit', 
                              minute: '2-digit' 
                            })}
                          </span>
                        </div>
                        <Button 
                          className="w-full bg-primary hover:bg-primary-dark gap-2"
                          onClick={() => viewLesson(lesson)}
                        >
                          <Video className="w-4 h-4" />
                          Join Lesson
                        </Button>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </TabsContent>

            <TabsContent value="recorded" className="mt-6">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {recordedLessons.map((lesson) => {
                  const teacher = sampleTeachers.find(t => t.id === lesson.teacherId);
                  return (
                    <Card key={lesson.id} className="card-interactive">
                      <CardContent className="p-4">
                        <div className="relative aspect-video bg-muted rounded-lg mb-3 flex items-center justify-center">
                          <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                            <Play className="w-6 h-6 text-primary ml-1" />
                          </div>
                          <Badge 
                            variant="secondary" 
                            className="absolute bottom-2 right-2 bg-background/80"
                          >
                            {lesson.duration} min
                          </Badge>
                        </div>
                        <Badge className={cn("mb-2", getSubjectColor(lesson.subject))}>
                          {getSubjectLabel(lesson.subject)}
                        </Badge>
                        <h3 className="font-medium mb-1">{lesson.title}</h3>
                        <p className="text-sm text-muted-foreground mb-3">
                          {teacher?.name}
                        </p>
                        <Button 
                          variant="outline" 
                          className="w-full gap-2"
                          onClick={() => viewLesson(lesson)}
                        >
                          <Play className="w-4 h-4" />
                          Watch Recording
                        </Button>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </TabsContent>
          </Tabs>
        )}
      </div>
    </MainLayout>
  );
};

export default Lessons;
