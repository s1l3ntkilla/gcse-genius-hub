import React, { useState, useEffect } from 'react';
import { MainLayout } from '@/components/layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  FileText, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  Upload,
  Download,
  Calendar,
  ChevronRight,
  Star,
  Sparkles,
  Loader2,
  X
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext';
import { supabase } from '@/integrations/supabase/client';
import AssignmentWizard from '@/components/features/AssignmentWizard';
import { format } from 'date-fns';

interface GeneratedQuestion {
  id: string;
  question: string;
  marks: number;
  commandWord: string;
  subtopic: string;
  difficulty: string;
  markScheme: string[];
}

interface Assignment {
  id: string;
  title: string;
  description: string | null;
  subject: string;
  topic: string;
  exam_board: string;
  due_date: string | null;
  total_marks: number;
  question_count: number;
  classroom_id: string;
  teacher_id: string;
  status: string;
  created_at: string;
  questions?: GeneratedQuestion[];
  classroom?: { name: string };
}

interface Submission {
  id: string;
  assignment_id: string;
  status: string;
  score: number | null;
  max_score: number | null;
  submitted_at: string | null;
  graded_at: string | null;
  feedback: string | null;
}

const Assignments: React.FC = () => {
  const { role } = useAuth();
  const { user } = useSupabaseAuth();
  const [selectedTab, setSelectedTab] = useState('pending');
  const [wizardOpen, setWizardOpen] = useState(false);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);

  useEffect(() => {
    if (user) {
      fetchAssignments();
    }
  }, [user, role]);

  const fetchAssignments = async () => {
    setIsLoading(true);
    try {
      // Fetch assignments (RLS will filter based on classroom membership)
      const { data: assignmentsData, error: assignmentsError } = await supabase
        .from('assignments')
        .select(`
          *,
          classroom:classrooms(name)
        `)
        .order('created_at', { ascending: false });

      if (assignmentsError) throw assignmentsError;
      setAssignments((assignmentsData || []) as unknown as Assignment[]);

      // For students, also fetch their submissions
      if (role === 'student') {
        const { data: submissionsData, error: submissionsError } = await supabase
          .from('assignment_submissions')
          .select('*')
          .eq('student_id', user?.id);

        if (submissionsError) throw submissionsError;
        setSubmissions(submissionsData || []);
      }
    } catch (error) {
      console.error('Error fetching assignments:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Categorize assignments based on submission status
  const getSubmissionForAssignment = (assignmentId: string) => 
    submissions.find(s => s.assignment_id === assignmentId);

  const pendingAssignments = assignments.filter(a => {
    if (role === 'teacher') return a.status === 'published';
    const submission = getSubmissionForAssignment(a.id);
    return !submission || submission.status === 'pending';
  });

  const submittedAssignments = role === 'student' 
    ? assignments.filter(a => {
        const submission = getSubmissionForAssignment(a.id);
        return submission?.status === 'submitted';
      })
    : [];

  const gradedAssignments = role === 'student'
    ? assignments.filter(a => {
        const submission = getSubmissionForAssignment(a.id);
        return submission?.status === 'graded';
      })
    : [];

  const renderAssignmentCard = (assignment: Assignment) => {
    const submission = getSubmissionForAssignment(assignment.id);
    const dueDate = assignment.due_date ? new Date(assignment.due_date) : null;
    const isOverdue = dueDate && dueDate < new Date() && (!submission || submission.status === 'pending');

    return (
      <Card 
        key={assignment.id} 
        className="card-elevated hover:shadow-lg transition-shadow cursor-pointer"
        onClick={() => setSelectedAssignment(assignment)}
      >
        <CardContent className="p-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <Badge variant="outline" className="text-xs">
                  {assignment.subject}
                </Badge>
                <Badge variant="secondary" className="text-xs">
                  {assignment.exam_board}
                </Badge>
                {isOverdue && (
                  <Badge variant="destructive" className="text-xs">
                    Overdue
                  </Badge>
                )}
              </div>
              <h3 className="font-semibold text-foreground truncate">{assignment.title}</h3>
              <p className="text-sm text-muted-foreground">{assignment.classroom?.name}</p>
              <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <FileText className="w-3 h-3" />
                  {assignment.question_count} questions
                </span>
                <span className="flex items-center gap-1">
                  <Star className="w-3 h-3" />
                  {assignment.total_marks} marks
                </span>
                {dueDate && (
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    Due {format(dueDate, 'MMM d, yyyy')}
                  </span>
                )}
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
          </div>
          {submission?.status === 'graded' && submission.score !== null && (
            <div className="mt-3 pt-3 border-t">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Score</span>
                <span className="font-semibold text-success">
                  {submission.score}/{submission.max_score}
                </span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <MainLayout>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl font-bold text-foreground flex items-center gap-3">
              <FileText className="w-8 h-8 text-primary" />
              {role === 'student' ? 'My Assignments' : 'Assignments'}
            </h1>
            <p className="text-muted-foreground mt-1">
              {role === 'student' 
                ? 'Track and submit your assignments' 
                : 'Create and manage student assignments'}
            </p>
          </div>
          {role === 'teacher' && (
            <Button onClick={() => setWizardOpen(true)} className="bg-primary hover:bg-primary-dark gap-2">
              <Sparkles className="w-4 h-4" />
              Create Assignment
            </Button>
          )}
        </div>

        {/* Assignment Wizard */}
        <AssignmentWizard 
          open={wizardOpen} 
          onOpenChange={setWizardOpen} 
          onAssignmentCreated={fetchAssignments}
        />

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className="card-elevated">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-warning/10 flex items-center justify-center">
                <Clock className="w-6 h-6 text-warning" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Pending</p>
                <p className="text-2xl font-bold">{pendingAssignments.length}</p>
              </div>
            </CardContent>
          </Card>
          <Card className="card-elevated">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <Upload className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Submitted</p>
                <p className="text-2xl font-bold">{submittedAssignments.length}</p>
              </div>
            </CardContent>
          </Card>
          <Card className="card-elevated">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-success" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Graded</p>
                <p className="text-2xl font-bold">{gradedAssignments.length}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Assignments List */}
        {isLoading ? (
          <Card className="card-elevated">
            <CardContent className="py-12 text-center">
              <Loader2 className="w-8 h-8 mx-auto animate-spin text-primary" />
              <p className="text-muted-foreground mt-2">Loading assignments...</p>
            </CardContent>
          </Card>
        ) : (
          <Tabs value={selectedTab} onValueChange={setSelectedTab}>
            <TabsList>
              <TabsTrigger value="pending" className="gap-2">
                Pending ({pendingAssignments.length})
              </TabsTrigger>
              <TabsTrigger value="submitted">
                Submitted ({submittedAssignments.length})
              </TabsTrigger>
              <TabsTrigger value="graded">
                Graded ({gradedAssignments.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="pending" className="mt-6">
              {pendingAssignments.length > 0 ? (
                <div className="space-y-4">
                  {pendingAssignments.map(renderAssignmentCard)}
                </div>
              ) : (
                <Card className="card-elevated">
                  <CardContent className="py-12 text-center">
                    <CheckCircle className="w-16 h-16 mx-auto text-success/50 mb-4" />
                    <h3 className="text-lg font-medium">All caught up!</h3>
                    <p className="text-muted-foreground mt-1">
                      You have no pending assignments
                    </p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="submitted" className="mt-6">
              {submittedAssignments.length > 0 ? (
                <div className="space-y-4">
                  {submittedAssignments.map(renderAssignmentCard)}
                </div>
              ) : (
                <Card className="card-elevated">
                  <CardContent className="py-12 text-center">
                    <Upload className="w-16 h-16 mx-auto text-muted-foreground/50 mb-4" />
                    <h3 className="text-lg font-medium">No submitted assignments</h3>
                    <p className="text-muted-foreground mt-1">
                      Submit your pending assignments to see them here
                    </p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="graded" className="mt-6">
              {gradedAssignments.length > 0 ? (
                <div className="space-y-4">
                  {gradedAssignments.map(renderAssignmentCard)}
                </div>
              ) : (
                <Card className="card-elevated">
                  <CardContent className="py-12 text-center">
                    <Star className="w-16 h-16 mx-auto text-muted-foreground/50 mb-4" />
                    <h3 className="text-lg font-medium">No graded assignments yet</h3>
                    <p className="text-muted-foreground mt-1">
                      Graded assignments will appear here
                    </p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        )}

        {/* Assignment Detail Dialog */}
        <Dialog open={!!selectedAssignment} onOpenChange={(open) => !open && setSelectedAssignment(null)}>
          <DialogContent className="max-w-3xl max-h-[90vh]">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary" />
                {selectedAssignment?.title}
              </DialogTitle>
            </DialogHeader>
            {selectedAssignment && (
              <ScrollArea className="max-h-[70vh] pr-4">
                <div className="space-y-6">
                  {/* Assignment Info */}
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline">{selectedAssignment.subject}</Badge>
                    <Badge variant="secondary">{selectedAssignment.exam_board}</Badge>
                    <Badge variant="outline">{selectedAssignment.topic}</Badge>
                    {selectedAssignment.due_date && (
                      <Badge variant="outline" className="gap-1">
                        <Calendar className="w-3 h-3" />
                        Due {format(new Date(selectedAssignment.due_date), 'MMM d, yyyy')}
                      </Badge>
                    )}
                  </div>

                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>{selectedAssignment.question_count} questions</span>
                    <span>•</span>
                    <span>{selectedAssignment.total_marks} marks total</span>
                  </div>

                  {/* Questions */}
                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg">Questions</h3>
                    {selectedAssignment.questions && Array.isArray(selectedAssignment.questions) ? (
                      selectedAssignment.questions.map((question, index) => (
                        <Card key={question.id || index} className="border-l-4 border-l-primary">
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between gap-4">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  <span className="text-sm font-medium text-primary">Q{index + 1}</span>
                                  <Badge variant="outline" className="text-xs">{question.commandWord}</Badge>
                                  <Badge variant="secondary" className="text-xs">{question.difficulty}</Badge>
                                </div>
                                <p className="text-foreground">{question.question}</p>
                                <p className="text-xs text-muted-foreground mt-1">
                                  Topic: {question.subtopic}
                                </p>
                              </div>
                              <Badge className="bg-primary/10 text-primary hover:bg-primary/20">
                                {question.marks} {question.marks === 1 ? 'mark' : 'marks'}
                              </Badge>
                            </div>
                          </CardContent>
                        </Card>
                      ))
                    ) : (
                      <p className="text-muted-foreground text-center py-4">
                        No questions available
                      </p>
                    )}
                  </div>
                </div>
              </ScrollArea>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </MainLayout>
  );
};

export default Assignments;
