import React, { useState, useEffect } from 'react';
import { MainLayout } from '@/components/layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  Hand, 
  MessageCircle, 
  CheckCircle, 
  Clock, 
  TrendingUp,
  Send,
  Trash2,
  Plus,
  Loader2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface ClassroomQuestion {
  id: string;
  classroom_id: string;
  student_id: string;
  question: string;
  topic: string | null;
  category: string | null;
  anonymous: boolean;
  answered: boolean;
  answer: string | null;
  answered_by: string | null;
  answered_at: string | null;
  created_at: string;
  student_name?: string;
  classroom_name?: string;
}

interface Classroom {
  id: string;
  name: string;
  subject: string;
}

const ClassroomQA: React.FC = () => {
  const { role } = useAuth();
  const { user } = useSupabaseAuth();
  const [filter, setFilter] = useState<'all' | 'pending' | 'answered'>('all');
  const [answeringId, setAnsweringId] = useState<string | null>(null);
  const [answerText, setAnswerText] = useState('');
  const [questions, setQuestions] = useState<ClassroomQuestion[]>([]);
  const [classrooms, setClassrooms] = useState<Classroom[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  
  // New question form state
  const [askModalOpen, setAskModalOpen] = useState(false);
  const [newQuestion, setNewQuestion] = useState('');
  const [newTopic, setNewTopic] = useState('');
  const [newCategory, setNewCategory] = useState('General');
  const [selectedClassroomId, setSelectedClassroomId] = useState<string>('');
  const [isAnonymous, setIsAnonymous] = useState(true);

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user, role]);

  // Real-time subscription for questions
  useEffect(() => {
    if (!user || classrooms.length === 0) return;

    const classroomIds = classrooms.map(c => c.id);
    
    const channel = supabase
      .channel('classroom-questions')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'classroom_questions',
          filter: `classroom_id=in.(${classroomIds.join(',')})`
        },
        () => {
          fetchQuestions();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, classrooms]);

  const fetchData = async () => {
    setLoading(true);
    try {
      await Promise.all([fetchClassrooms(), fetchQuestions()]);
    } finally {
      setLoading(false);
    }
  };

  const fetchClassrooms = async () => {
    try {
      if (role === 'teacher') {
        const { data, error } = await supabase
          .from('classrooms')
          .select('id, name, subject')
          .eq('teacher_id', user?.id);
        
        if (error) throw error;
        setClassrooms(data || []);
      } else {
        // Student - get classrooms they're members of
        const { data: memberships, error: memberError } = await supabase
          .from('classroom_members')
          .select('classroom_id')
          .eq('student_id', user?.id)
          .eq('status', 'accepted');

        if (memberError) throw memberError;

        if (memberships && memberships.length > 0) {
          const classroomIds = memberships.map(m => m.classroom_id);
          const { data, error } = await supabase
            .from('classrooms')
            .select('id, name, subject')
            .in('id', classroomIds);

          if (error) throw error;
          setClassrooms(data || []);
        }
      }
    } catch (error) {
      console.error('Error fetching classrooms:', error);
    }
  };

  const fetchQuestions = async () => {
    try {
      let classroomIds: string[] = [];

      if (role === 'teacher') {
        const { data: teacherClassrooms } = await supabase
          .from('classrooms')
          .select('id')
          .eq('teacher_id', user?.id);
        classroomIds = teacherClassrooms?.map(c => c.id) || [];
      } else {
        const { data: memberships } = await supabase
          .from('classroom_members')
          .select('classroom_id')
          .eq('student_id', user?.id)
          .eq('status', 'accepted');
        classroomIds = memberships?.map(m => m.classroom_id) || [];
      }

      if (classroomIds.length === 0) {
        setQuestions([]);
        return;
      }

      const { data, error } = await supabase
        .from('classroom_questions')
        .select('*')
        .in('classroom_id', classroomIds)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Get classroom names and student names
      const questionsWithDetails = await Promise.all(
        (data || []).map(async (q) => {
          const classroom = classrooms.find(c => c.id === q.classroom_id);
          let studentName = 'Anonymous';
          
          if (!q.anonymous && role === 'teacher') {
            const { data: profile } = await supabase
              .from('profiles')
              .select('full_name')
              .eq('id', q.student_id)
              .single();
            studentName = profile?.full_name || 'Unknown';
          }

          return {
            ...q,
            classroom_name: classroom?.name || 'Unknown Class',
            student_name: studentName
          };
        })
      );

      setQuestions(questionsWithDetails);
    } catch (error) {
      console.error('Error fetching questions:', error);
    }
  };

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

  const handleStartAnswer = (questionId: string, existingAnswer?: string | null) => {
    setAnsweringId(questionId);
    setAnswerText(existingAnswer || '');
  };

  const handleSubmitAnswer = async (questionId: string) => {
    if (!answerText.trim()) {
      toast.error('Please enter an answer');
      return;
    }

    setSubmitting(true);
    try {
      const { error } = await supabase
        .from('classroom_questions')
        .update({
          answered: true,
          answer: answerText.trim(),
          answered_by: user?.id,
          answered_at: new Date().toISOString()
        })
        .eq('id', questionId);

      if (error) throw error;
      
      setAnsweringId(null);
      setAnswerText('');
      toast.success('Answer submitted successfully');
      fetchQuestions();
    } catch (error) {
      console.error('Error submitting answer:', error);
      toast.error('Failed to submit answer');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteAnswer = async (questionId: string) => {
    try {
      const { error } = await supabase
        .from('classroom_questions')
        .update({
          answered: false,
          answer: null,
          answered_by: null,
          answered_at: null
        })
        .eq('id', questionId);

      if (error) throw error;
      toast.success('Answer removed');
      fetchQuestions();
    } catch (error) {
      console.error('Error removing answer:', error);
      toast.error('Failed to remove answer');
    }
  };

  const handleCancelAnswer = () => {
    setAnsweringId(null);
    setAnswerText('');
  };

  const handleAskQuestion = async () => {
    if (!newQuestion.trim()) {
      toast.error('Please enter a question');
      return;
    }
    if (!selectedClassroomId) {
      toast.error('Please select a classroom');
      return;
    }

    setSubmitting(true);
    try {
      const { error } = await supabase
        .from('classroom_questions')
        .insert({
          classroom_id: selectedClassroomId,
          student_id: user?.id,
          question: newQuestion.trim(),
          topic: newTopic.trim() || null,
          category: newCategory,
          anonymous: isAnonymous
        });

      if (error) throw error;

      toast.success('Question submitted successfully');
      setAskModalOpen(false);
      setNewQuestion('');
      setNewTopic('');
      setNewCategory('General');
      setSelectedClassroomId('');
      fetchQuestions();
    } catch (error) {
      console.error('Error submitting question:', error);
      toast.error('Failed to submit question');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
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
              <Hand className="w-8 h-8 text-primary" />
              {role === 'student' ? 'Classroom Q&A' : 'Student Questions'}
            </h1>
            <p className="text-muted-foreground mt-1">
              {role === 'student' 
                ? 'Submit questions silently during lessons' 
                : 'View and address student questions'}
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            {role === 'teacher' && pendingCount > 0 && (
              <Badge variant="destructive" className="text-sm px-4 py-2">
                {pendingCount} questions pending
              </Badge>
            )}
            
            {role === 'student' && classrooms.length > 0 && (
              <Dialog open={askModalOpen} onOpenChange={setAskModalOpen}>
                <DialogTrigger asChild>
                  <Button className="gap-2">
                    <Plus className="w-4 h-4" />
                    Ask Question
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Ask a Question</DialogTitle>
                    <DialogDescription>
                      Submit your question to your teacher. You can choose to remain anonymous.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 pt-4">
                    <div className="space-y-2">
                      <Label htmlFor="classroom">Classroom</Label>
                      <Select value={selectedClassroomId} onValueChange={setSelectedClassroomId}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a classroom" />
                        </SelectTrigger>
                        <SelectContent>
                          {classrooms.map(c => (
                            <SelectItem key={c.id} value={c.id}>
                              {c.name} ({c.subject})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="question">Your Question</Label>
                      <Textarea
                        id="question"
                        value={newQuestion}
                        onChange={(e) => setNewQuestion(e.target.value)}
                        placeholder="Type your question here..."
                        className="min-h-[100px]"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="topic">Topic (optional)</Label>
                        <Input
                          id="topic"
                          value={newTopic}
                          onChange={(e) => setNewTopic(e.target.value)}
                          placeholder="e.g. Differentiation"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="category">Category</Label>
                        <Select value={newCategory} onValueChange={setNewCategory}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="General">General</SelectItem>
                            <SelectItem value="Concept Clarification">Concept Clarification</SelectItem>
                            <SelectItem value="Problem Solving">Problem Solving</SelectItem>
                            <SelectItem value="Exam Technique">Exam Technique</SelectItem>
                            <SelectItem value="Homework Help">Homework Help</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="anonymous"
                        checked={isAnonymous}
                        onChange={(e) => setIsAnonymous(e.target.checked)}
                        className="rounded border-input"
                      />
                      <Label htmlFor="anonymous" className="text-sm cursor-pointer">
                        Submit anonymously
                      </Label>
                    </div>
                    <div className="flex justify-end gap-3">
                      <Button variant="outline" onClick={() => setAskModalOpen(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleAskQuestion} disabled={submitting} className="gap-2">
                        {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                        Submit Question
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            )}
          </div>
        </div>

        {/* No classrooms message */}
        {classrooms.length === 0 && (
          <Card className="card-elevated">
            <CardContent className="py-12 text-center">
              <Hand className="w-16 h-16 mx-auto text-muted-foreground/50 mb-4" />
              <h3 className="text-lg font-medium">No classrooms found</h3>
              <p className="text-muted-foreground mt-1">
                {role === 'student' 
                  ? 'Join a classroom first to ask questions'
                  : 'Create a classroom to receive student questions'}
              </p>
            </CardContent>
          </Card>
        )}

        {classrooms.length > 0 && (
          <>
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
                                    {question.topic && (
                                      <Badge variant="outline" className="text-xs">
                                        {question.topic}
                                      </Badge>
                                    )}
                                    <Badge variant="secondary" className="text-xs">
                                      {question.classroom_name}
                                    </Badge>
                                    <span className="text-xs text-muted-foreground">
                                      {question.anonymous ? '👤 Anonymous' : `📝 ${question.student_name}`}
                                    </span>
                                    <span className="text-xs text-muted-foreground">
                                      {new Date(question.created_at).toLocaleString([], {
                                        month: 'short',
                                        day: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit'
                                      })}
                                    </span>
                                  </div>

                                  {/* Show answer if exists */}
                                  {question.answered && question.answer && (
                                    <div className="mt-4 p-3 bg-success/5 rounded-lg border border-success/20">
                                      <p className="text-sm font-medium text-success mb-1">
                                        {role === 'teacher' ? 'Your Answer:' : "Teacher's Answer:"}
                                      </p>
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
                                          className="gap-2"
                                          onClick={() => handleSubmitAnswer(question.id)}
                                          disabled={submitting}
                                        >
                                          {submitting ? (
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                          ) : (
                                            <Send className="w-4 h-4" />
                                          )}
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
                                          Edit Answer
                                        </Button>
                                        <Button
                                          size="icon"
                                          variant="ghost"
                                          className="h-8 w-8 text-destructive hover:bg-destructive/10"
                                          onClick={() => handleDeleteAnswer(question.id)}
                                          title="Delete answer"
                                        >
                                          <Trash2 className="w-4 h-4" />
                                        </Button>
                                      </div>
                                    ) : (
                                      <Button 
                                        size="sm"
                                        onClick={() => handleStartAnswer(question.id)}
                                      >
                                        Answer
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
                            ? 'Click "Ask Question" to submit a question to your teacher'
                            : 'Questions from students will appear here'}
                        </p>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </>
        )}
      </div>
    </MainLayout>
  );
};

export default ClassroomQA;