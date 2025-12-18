import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Video, Loader2, Play } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext';
import { toast } from 'sonner';

interface StartLessonModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onStartLesson: (lessonId: string, lessonData: LessonData) => void;
}

interface LessonData {
  title: string;
  classroomId: string;
  classroomName: string;
  description: string;
}

interface Classroom {
  id: string;
  name: string;
  subject: string;
}

const StartLessonModal: React.FC<StartLessonModalProps> = ({
  open,
  onOpenChange,
  onStartLesson
}) => {
  const { user } = useSupabaseAuth();
  const [title, setTitle] = useState('');
  const [classroomId, setClassroomId] = useState('');
  const [description, setDescription] = useState('');
  const [classrooms, setClassrooms] = useState<Classroom[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetchingClassrooms, setFetchingClassrooms] = useState(true);

  useEffect(() => {
    if (open && user) {
      fetchClassrooms();
    }
  }, [open, user]);

  const fetchClassrooms = async () => {
    setFetchingClassrooms(true);
    try {
      const { data, error } = await supabase
        .from('classrooms')
        .select('id, name, subject')
        .eq('teacher_id', user?.id)
        .order('name');

      if (error) throw error;
      setClassrooms(data || []);
    } catch (error) {
      console.error('Error fetching classrooms:', error);
      toast.error('Failed to load classrooms');
    } finally {
      setFetchingClassrooms(false);
    }
  };

  const handleStart = async () => {
    if (!title || !classroomId || !user) return;

    const selectedClassroom = classrooms.find(c => c.id === classroomId);
    if (!selectedClassroom) return;

    setLoading(true);
    
    try {
      // Create the lesson in the database
      const { data: lessonData, error } = await supabase
        .from('live_lessons')
        .insert({
          classroom_id: classroomId,
          teacher_id: user.id,
          title,
          description: description || null,
          status: 'active'
        })
        .select()
        .single();

      if (error) throw error;

      onStartLesson(lessonData.id, {
        title,
        classroomId,
        classroomName: selectedClassroom.name,
        description
      });
      
      toast.success('Live lesson started');
      onOpenChange(false);
      resetForm();
    } catch (error) {
      console.error('Error starting lesson:', error);
      toast.error('Failed to start lesson');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setTitle('');
    setClassroomId('');
    setDescription('');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Video className="w-5 h-5 text-primary" />
            Start Live Lesson
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Lesson Title</Label>
            <Input
              id="title"
              placeholder="e.g., Introduction to Photosynthesis"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="classroom">Select Classroom</Label>
            <Select value={classroomId} onValueChange={setClassroomId}>
              <SelectTrigger>
                <SelectValue placeholder={fetchingClassrooms ? "Loading..." : "Select a classroom"} />
              </SelectTrigger>
              <SelectContent>
                {classrooms.length === 0 ? (
                  <SelectItem value="none" disabled>
                    No classrooms found. Create one first.
                  </SelectItem>
                ) : (
                  classrooms.map((classroom) => (
                    <SelectItem key={classroom.id} value={classroom.id}>
                      {classroom.name} ({classroom.subject})
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description (optional)</Label>
            <Textarea
              id="description"
              placeholder="Brief description of what will be covered..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleStart} 
              disabled={loading || !title || !classroomId}
              className="gap-2"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Play className="w-4 h-4" />
              )}
              Start Lesson
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default StartLessonModal;
