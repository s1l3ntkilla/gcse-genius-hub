import React, { useState } from 'react';
import { MainLayout } from '@/components/layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Hand, 
  MessageCircle, 
  CheckCircle, 
  Clock, 
  Users,
  TrendingUp,
  Filter
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';

const ClassroomQA: React.FC = () => {
  const { role } = useAuth();
  const [filter, setFilter] = useState<'all' | 'pending' | 'answered'>('all');

  // Empty state - no mock data
  const questions: any[] = [];
  const pendingCount = 0;

  return (
    <MainLayout>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl font-bold text-foreground flex items-center gap-3">
              <Hand className="w-8 h-8 text-primary" />
              {role === 'student' ? 'Classroom Q&A' : 'Student Questions'}
            </h1>
            <p className="text-muted-foreground mt-1">
              {role === 'student' 
                ? 'Submit questions silently during lessons' 
                : 'View and address student questions'}
            </p>
          </div>
          
          {role === 'teacher' && pendingCount > 0 && (
            <Badge variant="destructive" className="text-sm px-4 py-2">
              {pendingCount} questions pending
            </Badge>
          )}
        </div>

        {/* Stats for Teachers */}
        {role === 'teacher' && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card className="card-elevated">
              <CardContent className="p-4 flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <MessageCircle className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Questions</p>
                  <p className="text-2xl font-bold">0</p>
                </div>
              </CardContent>
            </Card>
            <Card className="card-elevated">
              <CardContent className="p-4 flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-warning/10 flex items-center justify-center">
                  <Clock className="w-6 h-6 text-warning" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Pending</p>
                  <p className="text-2xl font-bold">0</p>
                </div>
              </CardContent>
            </Card>
            <Card className="card-elevated">
              <CardContent className="p-4 flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-success" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Answered</p>
                  <p className="text-2xl font-bold">0</p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Filter Tabs */}
        <Tabs value={filter} onValueChange={(v) => setFilter(v as typeof filter)}>
          <TabsList>
            <TabsTrigger value="all" className="gap-2">
              All
              <Badge variant="secondary" className="ml-1">0</Badge>
            </TabsTrigger>
            <TabsTrigger value="pending" className="gap-2">
              Pending
              <Badge variant="destructive" className="ml-1">0</Badge>
            </TabsTrigger>
            <TabsTrigger value="answered">Answered</TabsTrigger>
          </TabsList>

          <TabsContent value={filter} className="mt-6">
            <Card className="card-elevated">
              <CardContent className="py-12 text-center">
                <Hand className="w-16 h-16 mx-auto text-muted-foreground/50 mb-4" />
                <h3 className="text-lg font-medium">No questions yet</h3>
                <p className="text-muted-foreground mt-1">
                  {role === 'student' 
                    ? 'Click "Raise Hand" to ask a question during your lesson'
                    : 'Questions from students will appear here'}
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default ClassroomQA;
