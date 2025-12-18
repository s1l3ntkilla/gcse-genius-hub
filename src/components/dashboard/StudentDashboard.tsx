import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  BookOpen, 
  MessageSquare, 
  Video, 
  FileText, 
  TrendingUp, 
  ChevronRight,
  Flame,
  Target,
  Calendar
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';

export const StudentDashboard: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold text-foreground">
            Welcome back, {user?.name?.split(' ')[0] || 'Student'}! 👋
          </h1>
          <p className="text-muted-foreground mt-1">
            Ready to continue learning? You're doing great!
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-warning/10 text-warning">
            <Flame className="w-5 h-5" />
            <span className="font-semibold">0 day streak</span>
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
                <p className="text-2xl font-bold text-foreground">0%</p>
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
                <p className="text-2xl font-bold text-foreground">0</p>
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
                <p className="text-2xl font-bold text-foreground">0</p>
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
                <p className="text-2xl font-bold text-foreground">0</p>
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
          <CardContent>
            <div className="text-center py-8 text-muted-foreground">
              <Video className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No upcoming lessons scheduled</p>
              <p className="text-sm mt-1">Check back later for new lessons</p>
            </div>
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
          <CardContent>
            <div className="text-center py-8 text-muted-foreground">
              <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>Start revising to track progress</p>
              <Link to="/revision">
                <Button variant="outline" size="sm" className="mt-3">
                  Start Revision
                </Button>
              </Link>
            </div>
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
          <CardContent>
            <div className="text-center py-8 text-muted-foreground">
              <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No messages yet</p>
              <p className="text-sm mt-1">Messages from teachers will appear here</p>
            </div>
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
          <CardContent>
            <div className="text-center py-8 text-muted-foreground">
              <FileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No upcoming assignments</p>
              <p className="text-sm mt-1">Your assignments will appear here</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
