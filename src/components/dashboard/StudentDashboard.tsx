import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  BookOpen, 
  MessageSquare, 
  Video, 
  FileText, 
  TrendingUp, 
  Clock,
  ChevronRight,
  Flame,
  Target,
  Calendar
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { 
  sampleLessons, 
  sampleMessages, 
  sampleAssignments, 
  sampleProgress, 
  getSubjectLabel,
  getSubjectColor,
  sampleTeachers
} from '@/data/sampleData';
import { cn } from '@/lib/utils';

export const StudentDashboard: React.FC = () => {
  const { user } = useAuth();
  const upcomingLessons = sampleLessons.filter(l => l.status === 'scheduled').slice(0, 3);
  const recentMessages = sampleMessages.filter(m => m.receiverId === user?.id).slice(0, 3);
  const pendingAssignments = sampleAssignments.filter(a => a.status === 'pending').slice(0, 3);
  const userProgress = sampleProgress.slice(0, 3);

  const totalStreak = Math.max(...sampleProgress.map(p => p.streakDays));
  const overallProgress = Math.round(
    sampleProgress.reduce((acc, p) => acc + (p.topicsCompleted / p.totalTopics) * 100, 0) / sampleProgress.length
  );

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold text-foreground">
            Welcome back, {user?.name?.split(' ')[0]}! 👋
          </h1>
          <p className="text-muted-foreground mt-1">
            Ready to continue learning? You're doing great!
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-warning/10 text-warning">
            <Flame className="w-5 h-5" />
            <span className="font-semibold">{totalStreak} day streak</span>
          </div>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="card-elevated">
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <Target className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Overall Progress</p>
                <p className="text-2xl font-bold text-foreground">{overallProgress}%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card-elevated">
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-success" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Topics Mastered</p>
                <p className="text-2xl font-bold text-foreground">
                  {sampleProgress.reduce((acc, p) => acc + p.topicsCompleted, 0)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card-elevated">
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-warning/10 flex items-center justify-center">
                <FileText className="w-6 h-6 text-warning" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Pending Tasks</p>
                <p className="text-2xl font-bold text-foreground">{pendingAssignments.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card-elevated">
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-destructive/10 flex items-center justify-center">
                <MessageSquare className="w-6 h-6 text-destructive" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Unread Messages</p>
                <p className="text-2xl font-bold text-foreground">
                  {recentMessages.filter(m => !m.read).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Upcoming Lessons */}
        <Card className="card-elevated lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="font-display flex items-center gap-2">
              <Video className="w-5 h-5 text-primary" />
              Upcoming Lessons
            </CardTitle>
            <Link to="/lessons">
              <Button variant="ghost" size="sm" className="gap-1">
                View all <ChevronRight className="w-4 h-4" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="space-y-3">
            {upcomingLessons.length > 0 ? upcomingLessons.map((lesson, index) => {
              const teacher = sampleTeachers.find(t => t.id === lesson.teacherId);
              return (
                <div 
                  key={lesson.id}
                  className={cn(
                    "flex items-center justify-between p-4 rounded-xl border border-border bg-card hover:border-primary/30 transition-colors",
                    index === 0 && "bg-primary/5 border-primary/20"
                  )}
                >
                  <div className="flex items-center gap-4">
                    <div className={cn(
                      "w-12 h-12 rounded-xl flex items-center justify-center",
                      index === 0 ? "bg-primary text-primary-foreground" : "bg-muted"
                    )}>
                      <Video className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-medium text-foreground">{lesson.title}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="secondary" className={getSubjectColor(lesson.subject)}>
                          {getSubjectLabel(lesson.subject)}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          with {teacher?.name}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Clock className="w-4 h-4" />
                      {lesson.scheduledTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                    {index === 0 && (
                      <Button size="sm" className="mt-2 bg-primary hover:bg-primary-dark">
                        Join Now
                      </Button>
                    )}
                  </div>
                </div>
              );
            }) : (
              <div className="text-center py-8 text-muted-foreground">
                <Video className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>No upcoming lessons scheduled</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Study Progress */}
        <Card className="card-elevated">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="font-display flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-success" />
              Active Revisions
            </CardTitle>
            <Link to="/revision">
              <Button variant="ghost" size="sm" className="gap-1">
                Study <ChevronRight className="w-4 h-4" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="space-y-4">
            {userProgress.map((progress) => (
              <div key={progress.subject} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-foreground">
                    {getSubjectLabel(progress.subject)}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {progress.topicsCompleted}/{progress.totalTopics} topics
                  </span>
                </div>
                <Progress 
                  value={(progress.topicsCompleted / progress.totalTopics) * 100} 
                  className="h-2"
                />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Bottom Row */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Messages */}
        <Card className="card-elevated">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="font-display flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-primary" />
              Recent Messages
            </CardTitle>
            <Link to="/messages">
              <Button variant="ghost" size="sm" className="gap-1">
                View all <ChevronRight className="w-4 h-4" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentMessages.length > 0 ? recentMessages.map((message) => {
              const sender = sampleTeachers.find(t => t.id === message.senderId);
              return (
                <div 
                  key={message.id}
                  className={cn(
                    "p-3 rounded-lg border transition-colors cursor-pointer hover:border-primary/30",
                    !message.read ? "bg-primary/5 border-primary/20" : "border-border"
                  )}
                >
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-sm font-medium">
                      {sender?.avatar}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm">{sender?.name}</span>
                        {!message.read && (
                          <div className="w-2 h-2 rounded-full bg-primary" />
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground truncate mt-0.5">
                        {message.content}
                      </p>
                    </div>
                  </div>
                </div>
              );
            }) : (
              <div className="text-center py-8 text-muted-foreground">
                <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>No messages yet</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Upcoming Assignments */}
        <Card className="card-elevated">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="font-display flex items-center gap-2">
              <Calendar className="w-5 h-5 text-warning" />
              Upcoming Deadlines
            </CardTitle>
            <Link to="/assignments">
              <Button variant="ghost" size="sm" className="gap-1">
                View all <ChevronRight className="w-4 h-4" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="space-y-3">
            {pendingAssignments.map((assignment) => {
              const daysUntilDue = Math.ceil(
                (assignment.dueDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24)
              );
              const isUrgent = daysUntilDue <= 2;

              return (
                <div 
                  key={assignment.id}
                  className={cn(
                    "p-3 rounded-lg border transition-colors",
                    isUrgent ? "bg-destructive/5 border-destructive/20" : "border-border"
                  )}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-sm">{assignment.title}</h4>
                      <Badge variant="secondary" className={cn("mt-1", getSubjectColor(assignment.subject))}>
                        {getSubjectLabel(assignment.subject)}
                      </Badge>
                    </div>
                    <div className={cn(
                      "text-right text-sm",
                      isUrgent ? "text-destructive" : "text-muted-foreground"
                    )}>
                      <Clock className="w-4 h-4 inline mr-1" />
                      {daysUntilDue > 0 ? `${daysUntilDue} days` : 'Today'}
                    </div>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
