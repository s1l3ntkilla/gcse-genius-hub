import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  BookOpen, 
  ChevronRight,
  Users,
  Sparkles
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
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

// Mock classmates data
const classmates = [
  { name: 'Alex', avatar: 'A', online: true },
  { name: 'Sarah', avatar: 'S', online: true },
  { name: 'Mike', avatar: 'M', online: false },
  { name: 'Emma', avatar: 'E', online: true },
  { name: 'James', avatar: 'J', online: false },
];

export const StudentDashboard: React.FC = () => {
  const { user } = useAuth();

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
                    {user?.name?.split(' ')[0] || 'Student'} <span className="inline-block animate-float">👋</span>
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
                Class
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-3">
                {classmates.map((classmate) => (
                  <div key={classmate.name} className="relative group">
                    <Avatar className="w-12 h-12 border-2 border-card shadow-md transition-transform hover:scale-110">
                      <AvatarFallback className={cn(
                        "font-semibold",
                        classmate.online ? "bg-primary/10 text-primary" : "bg-secondary text-muted-foreground"
                      )}>
                        {classmate.avatar}
                      </AvatarFallback>
                    </Avatar>
                    {classmate.online && (
                      <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-success rounded-full border-2 border-card" />
                    )}
                  </div>
                ))}
                <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center text-muted-foreground text-sm font-medium">
                  +12
                </div>
              </div>
              
              <Button variant="gradient" className="w-full mt-4" asChild>
                <Link to="/qa">
                  Join Now
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