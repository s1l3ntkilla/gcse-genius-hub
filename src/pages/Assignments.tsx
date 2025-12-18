import React, { useState } from 'react';
import { MainLayout } from '@/components/layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  FileText, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  Upload,
  Download,
  Calendar,
  ChevronRight,
  Star
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { sampleAssignments, sampleTeachers, getSubjectLabel, getSubjectColor } from '@/data/sampleData';
import { useAuth } from '@/contexts/AuthContext';

const Assignments: React.FC = () => {
  const { role } = useAuth();
  const [selectedTab, setSelectedTab] = useState('pending');

  const pendingAssignments = sampleAssignments.filter(a => a.status === 'pending');
  const submittedAssignments = sampleAssignments.filter(a => a.status === 'submitted');
  const gradedAssignments = sampleAssignments.filter(a => a.status === 'graded');

  const getDaysUntilDue = (dueDate: Date) => {
    return Math.ceil((dueDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
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
            <Button className="bg-primary hover:bg-primary-dark gap-2">
              <FileText className="w-4 h-4" />
              Create Assignment
            </Button>
          )}
        </div>

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
        <Tabs value={selectedTab} onValueChange={setSelectedTab}>
          <TabsList>
            <TabsTrigger value="pending" className="gap-2">
              Pending
              {pendingAssignments.length > 0 && (
                <Badge variant="destructive" className="ml-1">
                  {pendingAssignments.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="submitted">Submitted</TabsTrigger>
            <TabsTrigger value="graded">Graded</TabsTrigger>
          </TabsList>

          <TabsContent value="pending" className="mt-6">
            <div className="space-y-4">
              {pendingAssignments.map((assignment) => {
                const daysUntilDue = getDaysUntilDue(assignment.dueDate);
                const isUrgent = daysUntilDue <= 2;
                const isOverdue = daysUntilDue < 0;
                const teacher = sampleTeachers.find(t => t.id === assignment.teacherId);

                return (
                  <Card 
                    key={assignment.id}
                    className={cn(
                      "card-elevated transition-all",
                      isOverdue && "border-l-4 border-l-destructive",
                      isUrgent && !isOverdue && "border-l-4 border-l-warning"
                    )}
                  >
                    <CardContent className="p-4">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <Badge className={getSubjectColor(assignment.subject)}>
                              {getSubjectLabel(assignment.subject)}
                            </Badge>
                            {isOverdue && (
                              <Badge variant="destructive">Overdue</Badge>
                            )}
                            {isUrgent && !isOverdue && (
                              <Badge variant="outline" className="border-warning text-warning">
                                Due Soon
                              </Badge>
                            )}
                          </div>
                          <h3 className="font-semibold text-lg">{assignment.title}</h3>
                          <p className="text-sm text-muted-foreground mt-1">
                            {assignment.description}
                          </p>
                          <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <FileText className="w-4 h-4" />
                              {teacher?.name}
                            </span>
                            <span className={cn(
                              "flex items-center gap-1",
                              isOverdue && "text-destructive",
                              isUrgent && !isOverdue && "text-warning"
                            )}>
                              <Calendar className="w-4 h-4" />
                              {isOverdue 
                                ? `${Math.abs(daysUntilDue)} days overdue`
                                : daysUntilDue === 0 
                                  ? 'Due today'
                                  : `Due in ${daysUntilDue} days`
                              }
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button variant="outline" className="gap-2">
                            <Download className="w-4 h-4" />
                            Resources
                          </Button>
                          <Button className="bg-primary hover:bg-primary-dark gap-2">
                            <Upload className="w-4 h-4" />
                            Submit
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}

              {pendingAssignments.length === 0 && (
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
            </div>
          </TabsContent>

          <TabsContent value="submitted" className="mt-6">
            <div className="space-y-4">
              {submittedAssignments.map((assignment) => {
                const teacher = sampleTeachers.find(t => t.id === assignment.teacherId);

                return (
                  <Card key={assignment.id} className="card-elevated">
                    <CardContent className="p-4">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <Badge className={getSubjectColor(assignment.subject)}>
                              {getSubjectLabel(assignment.subject)}
                            </Badge>
                            <Badge variant="outline" className="border-primary text-primary">
                              Awaiting Review
                            </Badge>
                          </div>
                          <h3 className="font-semibold text-lg">{assignment.title}</h3>
                          <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <FileText className="w-4 h-4" />
                              {teacher?.name}
                            </span>
                            <span className="flex items-center gap-1">
                              <CheckCircle className="w-4 h-4 text-success" />
                              Submitted on {assignment.dueDate.toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                        <Button variant="outline">View Submission</Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}

              {submittedAssignments.length === 0 && (
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
            </div>
          </TabsContent>

          <TabsContent value="graded" className="mt-6">
            <div className="space-y-4">
              {gradedAssignments.map((assignment) => {
                const teacher = sampleTeachers.find(t => t.id === assignment.teacherId);

                return (
                  <Card key={assignment.id} className="card-elevated">
                    <CardContent className="p-4">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <Badge className={getSubjectColor(assignment.subject)}>
                              {getSubjectLabel(assignment.subject)}
                            </Badge>
                            <Badge variant="secondary" className="bg-success/10 text-success">
                              <Star className="w-3 h-3 mr-1" />
                              {assignment.grade || 'A'}
                            </Badge>
                          </div>
                          <h3 className="font-semibold text-lg">{assignment.title}</h3>
                          {assignment.feedback && (
                            <p className="text-sm text-muted-foreground mt-2 p-3 bg-muted/50 rounded-lg">
                              "{assignment.feedback}"
                            </p>
                          )}
                          <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <FileText className="w-4 h-4" />
                              {teacher?.name}
                            </span>
                          </div>
                        </div>
                        <Button variant="outline">View Details</Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}

              {gradedAssignments.length === 0 && (
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
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default Assignments;
