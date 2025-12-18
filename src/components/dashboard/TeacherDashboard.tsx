import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  MessageSquare, 
  Hand, 
  FileText, 
  TrendingUp,
  ChevronRight,
  Clock,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { 
  sampleLessons, 
  sampleMessages, 
  sampleAssignments, 
  sampleClassroomQuestions,
  sampleStudents,
  getSubjectLabel,
  getSubjectColor
} from '@/data/sampleData';
import { cn } from '@/lib/utils';

export const TeacherDashboard: React.FC = () => {
  const { user } = useAuth();
  const pendingQuestions = sampleClassroomQuestions.filter(q => !q.answered);
  const todayLessons = sampleLessons.filter(l => 
    l.teacherId === user?.id && l.status === 'scheduled'
  );
  const pendingSubmissions = sampleAssignments.filter(a => a.status === 'submitted');
  const unreadMessages = sampleMessages.filter(m => m.receiverId === user?.id && !m.read);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold text-foreground">
            Good morning, {user?.name?.split(' ')[0]}! 📚
          </h1>
          <p className="text-muted-foreground mt-1">
            Here's what's happening in your classes today
          </p>
        </div>
        <Button className="bg-primary hover:bg-primary-dark gap-2">
          <Users className="w-4 h-4" />
          Start Live Lesson
        </Button>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="card-elevated">
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <Hand className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Pending Questions</p>
                <p className="text-2xl font-bold text-foreground">{pendingQuestions.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card-elevated">
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center">
                <FileText className="w-6 h-6 text-success" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Submissions to Review</p>
                <p className="text-2xl font-bold text-foreground">{pendingSubmissions.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card-elevated">
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-warning/10 flex items-center justify-center">
                <MessageSquare className="w-6 h-6 text-warning" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Unread Messages</p>
                <p className="text-2xl font-bold text-foreground">{unreadMessages.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card-elevated">
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-destructive/10 flex items-center justify-center">
                <Users className="w-6 h-6 text-destructive" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Active Students</p>
                <p className="text-2xl font-bold text-foreground">{sampleStudents.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Student Questions */}
        <Card className="card-elevated lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="font-display flex items-center gap-2">
              <Hand className="w-5 h-5 text-primary" />
              Recent Student Questions
              {pendingQuestions.length > 0 && (
                <Badge variant="destructive" className="ml-2">
                  {pendingQuestions.length} new
                </Badge>
              )}
            </CardTitle>
            <Link to="/qa">
              <Button variant="ghost" size="sm" className="gap-1">
                View all <ChevronRight className="w-4 h-4" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="space-y-3">
            {sampleClassroomQuestions.slice(0, 4).map((question) => {
              const student = sampleStudents.find(s => s.id === question.studentId);
              return (
                <div 
                  key={question.id}
                  className={cn(
                    "p-4 rounded-xl border transition-colors",
                    !question.answered 
                      ? "bg-primary/5 border-primary/20" 
                      : "border-border bg-card"
                  )}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <p className="text-foreground">{question.question}</p>
                      <div className="flex items-center gap-3 mt-2">
                        <Badge variant="outline" className="text-xs">
                          {question.topic}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {question.anonymous ? 'Anonymous' : student?.name}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {new Date(question.timestamp).toLocaleTimeString([], { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </span>
                      </div>
                    </div>
                    {question.answered ? (
                      <CheckCircle className="w-5 h-5 text-success shrink-0" />
                    ) : (
                      <Button size="sm" variant="outline">
                        Address
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* Today's Schedule */}
        <Card className="card-elevated">
          <CardHeader>
            <CardTitle className="font-display flex items-center gap-2">
              <Clock className="w-5 h-5 text-warning" />
              Today's Schedule
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {todayLessons.length > 0 ? todayLessons.map((lesson) => (
              <div 
                key={lesson.id}
                className="p-3 rounded-lg border border-border hover:border-primary/30 transition-colors"
              >
                <h4 className="font-medium text-sm">{lesson.title}</h4>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant="secondary" className={getSubjectColor(lesson.subject)}>
                    {getSubjectLabel(lesson.subject)}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {lesson.scheduledTime.toLocaleTimeString([], { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </span>
                </div>
              </div>
            )) : (
              <div className="text-center py-6 text-muted-foreground">
                <Clock className="w-10 h-10 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No lessons scheduled today</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Submissions & Engagement */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Pending Submissions */}
        <Card className="card-elevated">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="font-display flex items-center gap-2">
              <FileText className="w-5 h-5 text-success" />
              Submissions Awaiting Review
            </CardTitle>
            <Link to="/assignments">
              <Button variant="ghost" size="sm" className="gap-1">
                View all <ChevronRight className="w-4 h-4" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="space-y-3">
            {pendingSubmissions.length > 0 ? pendingSubmissions.map((assignment) => (
              <div 
                key={assignment.id}
                className="flex items-center justify-between p-3 rounded-lg border border-border"
              >
                <div>
                  <h4 className="font-medium text-sm">{assignment.title}</h4>
                  <Badge variant="secondary" className={cn("mt-1", getSubjectColor(assignment.subject))}>
                    {getSubjectLabel(assignment.subject)}
                  </Badge>
                </div>
                <Button size="sm" variant="outline">
                  Review
                </Button>
              </div>
            )) : (
              <div className="text-center py-6 text-muted-foreground">
                <CheckCircle className="w-10 h-10 mx-auto mb-2 opacity-50" />
                <p className="text-sm">All caught up! No pending reviews.</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Student Engagement */}
        <Card className="card-elevated">
          <CardHeader>
            <CardTitle className="font-display flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              Student Engagement
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {sampleStudents.slice(0, 4).map((student) => (
              <div 
                key={student.id}
                className="flex items-center gap-3"
              >
                <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-sm font-medium">
                  {student.avatar}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">{student.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {student.subjects.length} subjects • Active today
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-success" />
                  <span className="text-xs text-success">Active</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
