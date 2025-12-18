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
  Star,
  Sparkles
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import AssignmentWizard from '@/components/features/AssignmentWizard';

const Assignments: React.FC = () => {
  const { role } = useAuth();
  const [selectedTab, setSelectedTab] = useState('pending');
  const [wizardOpen, setWizardOpen] = useState(false);

  // Empty state - no mock data
  const pendingAssignments: any[] = [];
  const submittedAssignments: any[] = [];
  const gradedAssignments: any[] = [];

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
        <AssignmentWizard open={wizardOpen} onOpenChange={setWizardOpen} />

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <Upload className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Submitted</p>
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
                <p className="text-sm text-muted-foreground">Graded</p>
                <p className="text-2xl font-bold">0</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Assignments List */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab}>
          <TabsList>
            <TabsTrigger value="pending" className="gap-2">
              Pending
            </TabsTrigger>
            <TabsTrigger value="submitted">Submitted</TabsTrigger>
            <TabsTrigger value="graded">Graded</TabsTrigger>
          </TabsList>

          <TabsContent value="pending" className="mt-6">
            <Card className="card-elevated">
              <CardContent className="py-12 text-center">
                <CheckCircle className="w-16 h-16 mx-auto text-success/50 mb-4" />
                <h3 className="text-lg font-medium">All caught up!</h3>
                <p className="text-muted-foreground mt-1">
                  You have no pending assignments
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="submitted" className="mt-6">
            <Card className="card-elevated">
              <CardContent className="py-12 text-center">
                <Upload className="w-16 h-16 mx-auto text-muted-foreground/50 mb-4" />
                <h3 className="text-lg font-medium">No submitted assignments</h3>
                <p className="text-muted-foreground mt-1">
                  Submit your pending assignments to see them here
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="graded" className="mt-6">
            <Card className="card-elevated">
              <CardContent className="py-12 text-center">
                <Star className="w-16 h-16 mx-auto text-muted-foreground/50 mb-4" />
                <h3 className="text-lg font-medium">No graded assignments yet</h3>
                <p className="text-muted-foreground mt-1">
                  Graded assignments will appear here
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default Assignments;
