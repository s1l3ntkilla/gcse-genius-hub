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
import { sampleClassroomQuestions, sampleStudents, sampleLessons } from '@/data/sampleData';

const ClassroomQA: React.FC = () => {
  const { role } = useAuth();
  const [filter, setFilter] = useState<'all' | 'pending' | 'answered'>('all');

  const questions = sampleClassroomQuestions.filter(q => {
    if (filter === 'pending') return !q.answered;
    if (filter === 'answered') return q.answered;
    return true;
  });

  // Group questions by category
  const groupedQuestions = questions.reduce((acc, q) => {
    const category = q.category || 'General';
    if (!acc[category]) acc[category] = [];
    acc[category].push(q);
    return acc;
  }, {} as Record<string, typeof questions>);

  const pendingCount = sampleClassroomQuestions.filter(q => !q.answered).length;

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
                  <p className="text-2xl font-bold">{sampleClassroomQuestions.length}</p>
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
                  <p className="text-2xl font-bold">{pendingCount}</p>
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
                  <p className="text-2xl font-bold">
                    {sampleClassroomQuestions.filter(q => q.answered).length}
                  </p>
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
              <Badge variant="secondary" className="ml-1">
                {sampleClassroomQuestions.length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="pending" className="gap-2">
              Pending
              <Badge variant="destructive" className="ml-1">
                {pendingCount}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="answered">Answered</TabsTrigger>
          </TabsList>

          <TabsContent value={filter} className="mt-6">
            {/* Questions by Category */}
            <div className="space-y-6">
              {Object.entries(groupedQuestions).map(([category, categoryQuestions]) => (
                <div key={category}>
                  <h3 className="font-display font-semibold text-lg mb-4 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-primary" />
                    {category}
                    <Badge variant="secondary">{categoryQuestions.length}</Badge>
                  </h3>
                  
                  <div className="space-y-3">
                    {categoryQuestions.map((question) => {
                      const student = sampleStudents.find(s => s.id === question.studentId);
                      const lesson = sampleLessons.find(l => l.id === question.lessonId);

                      return (
                        <Card 
                          key={question.id}
                          className={cn(
                            "card-elevated transition-all",
                            !question.answered && "border-l-4 border-l-primary"
                          )}
                        >
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between gap-4">
                              <div className="flex-1">
                                <p className="text-foreground font-medium">
                                  {question.question}
                                </p>
                                <div className="flex items-center gap-3 mt-3 flex-wrap">
                                  <Badge variant="outline" className="text-xs">
                                    {question.topic}
                                  </Badge>
                                  <span className="text-xs text-muted-foreground">
                                    {question.anonymous ? '👤 Anonymous' : `📝 ${student?.name}`}
                                  </span>
                                  <span className="text-xs text-muted-foreground">
                                    {new Date(question.timestamp).toLocaleTimeString([], {
                                      hour: '2-digit',
                                      minute: '2-digit'
                                    })}
                                  </span>
                                </div>
                              </div>
                              
                              <div className="flex items-center gap-2">
                                {question.answered ? (
                                  <Badge variant="secondary" className="bg-success/10 text-success">
                                    <CheckCircle className="w-3 h-3 mr-1" />
                                    Answered
                                  </Badge>
                                ) : (
                                  role === 'teacher' && (
                                    <Button size="sm" className="bg-primary hover:bg-primary-dark">
                                      Address
                                    </Button>
                                  )
                                )}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                </div>
              ))}

              {questions.length === 0 && (
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
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default ClassroomQA;
