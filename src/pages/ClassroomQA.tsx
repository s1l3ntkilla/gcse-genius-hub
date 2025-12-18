import React, { useState } from 'react';
import { MainLayout } from '@/components/layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { 
  Hand, 
  MessageCircle, 
  CheckCircle, 
  Clock, 
  Users,
  TrendingUp,
  X,
  Send,
  Trash2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface ClassroomQuestion {
  id: string;
  studentName: string;
  question: string;
  topic: string;
  category: string;
  timestamp: Date;
  anonymous: boolean;
  answered: boolean;
  answer?: string;
}

const ClassroomQA: React.FC = () => {
  const { role } = useAuth();
  const [filter, setFilter] = useState<'all' | 'pending' | 'answered'>('all');
  const [answeringId, setAnsweringId] = useState<string | null>(null);
  const [answerText, setAnswerText] = useState('');
  
  // Sample questions for demonstration - in production would come from database
  const [questions, setQuestions] = useState<ClassroomQuestion[]>([
    {
      id: 'q1',
      studentName: 'Anonymous',
      question: 'Can you explain the chain rule again?',
      topic: 'Differentiation',
      category: 'Calculus',
      timestamp: new Date(Date.now() - 5 * 60 * 1000),
      anonymous: true,
      answered: false,
    },
    {
      id: 'q2',
      studentName: 'Anonymous',
      question: "What's the difference between dy/dx and d/dx?",
      topic: 'Differentiation',
      category: 'Calculus',
      timestamp: new Date(Date.now() - 3 * 60 * 1000),
      anonymous: true,
      answered: false,
    },
  ]);

  const filteredQuestions = questions.filter(q => {
    if (filter === 'pending') return !q.answered;
    if (filter === 'answered') return q.answered;
    return true;
  });

  const pendingCount = questions.filter(q => !q.answered).length;
  const answeredCount = questions.filter(q => q.answered).length;

  // Group questions by category
  const groupedQuestions = filteredQuestions.reduce((acc, q) => {
    const category = q.category || 'General';
    if (!acc[category]) acc[category] = [];
    acc[category].push(q);
    return acc;
  }, {} as Record<string, ClassroomQuestion[]>);

  const handleStartAnswer = (questionId: string, existingAnswer?: string) => {
    setAnsweringId(questionId);
    setAnswerText(existingAnswer || '');
  };

  const handleSubmitAnswer = (questionId: string) => {
    if (!answerText.trim()) {
      toast.error('Please enter an answer');
      return;
    }

    setQuestions(prev => prev.map(q => 
      q.id === questionId 
        ? { ...q, answered: true, answer: answerText.trim() }
        : q
    ));
    
    setAnsweringId(null);
    setAnswerText('');
    toast.success('Answer submitted successfully');
  };

  const handleDeleteAnswer = (questionId: string) => {
    setQuestions(prev => prev.map(q => 
      q.id === questionId 
        ? { ...q, answered: false, answer: undefined }
        : q
    ));
    toast.success('Answer removed');
  };

  const handleCancelAnswer = () => {
    setAnsweringId(null);
    setAnswerText('');
  };

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
                  <p className="text-2xl font-bold">{questions.length}</p>
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
                  <p className="text-2xl font-bold">{answeredCount}</p>
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
              <Badge variant="secondary" className="ml-1">{questions.length}</Badge>
            </TabsTrigger>
            <TabsTrigger value="pending" className="gap-2">
              Pending
              <Badge variant="destructive" className="ml-1">{pendingCount}</Badge>
            </TabsTrigger>
            <TabsTrigger value="answered">
              Answered
              <Badge variant="secondary" className="ml-1">{answeredCount}</Badge>
            </TabsTrigger>
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
                    {categoryQuestions.map((question) => (
                      <Card 
                        key={question.id}
                        className={cn(
                          "card-elevated transition-all",
                          question.answered 
                            ? "bg-success/10 border-success/30" 
                            : "border-l-4 border-l-primary"
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
                                  {question.anonymous ? '👤 Anonymous' : `📝 ${question.studentName}`}
                                </span>
                                <span className="text-xs text-muted-foreground">
                                  {question.timestamp.toLocaleTimeString([], {
                                    hour: '2-digit',
                                    minute: '2-digit'
                                  })}
                                </span>
                              </div>

                              {/* Show answer if exists */}
                              {question.answered && question.answer && (
                                <div className="mt-4 p-3 bg-success/5 rounded-lg border border-success/20">
                                  <p className="text-sm font-medium text-success mb-1">Your Answer:</p>
                                  <p className="text-sm text-foreground">{question.answer}</p>
                                </div>
                              )}

                              {/* Answer input area */}
                              {answeringId === question.id && role === 'teacher' && (
                                <div className="mt-4 space-y-3">
                                  <Textarea
                                    value={answerText}
                                    onChange={(e) => setAnswerText(e.target.value)}
                                    placeholder="Type your answer to the student..."
                                    className="min-h-[100px] resize-none"
                                    autoFocus
                                  />
                                  <div className="flex items-center gap-2">
                                    <Button 
                                      size="sm" 
                                      className="bg-primary hover:bg-primary-dark gap-2"
                                      onClick={() => handleSubmitAnswer(question.id)}
                                    >
                                      <Send className="w-4 h-4" />
                                      Submit Answer
                                    </Button>
                                    <Button 
                                      size="sm" 
                                      variant="outline"
                                      onClick={handleCancelAnswer}
                                    >
                                      Cancel
                                    </Button>
                                  </div>
                                </div>
                              )}
                            </div>
                            
                            {/* Action buttons */}
                            {role === 'teacher' && answeringId !== question.id && (
                              <div className="flex items-center gap-2">
                                {question.answered ? (
                                  <div className="flex items-center gap-2">
                                    <Button 
                                      size="sm" 
                                      variant="outline"
                                      className="gap-2 border-success text-success hover:bg-success/10"
                                      onClick={() => handleStartAnswer(question.id, question.answer)}
                                    >
                                      Address Again
                                    </Button>
                                    <Button
                                      size="icon"
                                      variant="ghost"
                                      className="h-8 w-8 text-destructive hover:bg-destructive/10 relative"
                                      onClick={() => handleDeleteAnswer(question.id)}
                                      title="Delete answer"
                                    >
                                      <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-destructive rounded-full" />
                                      <Trash2 className="w-4 h-4" />
                                    </Button>
                                  </div>
                                ) : (
                                  <Button 
                                    size="sm" 
                                    className="bg-primary hover:bg-primary-dark"
                                    onClick={() => handleStartAnswer(question.id)}
                                  >
                                    Address
                                  </Button>
                                )}
                              </div>
                            )}

                            {/* Status badge for students */}
                            {role === 'student' && question.answered && (
                              <Badge variant="secondary" className="bg-success/10 text-success">
                                <CheckCircle className="w-3 h-3 mr-1" />
                                Answered
                              </Badge>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              ))}

              {filteredQuestions.length === 0 && (
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
