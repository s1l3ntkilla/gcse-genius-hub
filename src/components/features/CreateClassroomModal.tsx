import React, { useState } from 'react';
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
import { BookOpen, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext';
import { toast } from 'sonner';

interface CreateClassroomModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

const SUBJECTS = [
  'Maths',
  'Chemistry',
  'Biology',
  'Computer Science',
  'French',
  'Music',
  'Physics',
  'English',
  'History',
  'Geography'
];

const CreateClassroomModal: React.FC<CreateClassroomModalProps> = ({
  open,
  onOpenChange,
  onSuccess
}) => {
  const { user } = useSupabaseAuth();
  const [name, setName] = useState('');
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !subject || !user) return;

    setLoading(true);
    try {
      // Create the classroom
      const { data: classroom, error } = await supabase
        .from('classrooms')
        .insert({
          name,
          subject,
          description: description || null,
          teacher_id: user.id
        })
        .select('id')
        .single();

      if (error) throw error;

      // Create a group chat for this classroom
      const { data: groupChat, error: groupError } = await supabase
        .from('group_chats')
        .insert({
          group_name: name,
          subject: subject,
          group_type: 'class_discussion',
          description: JSON.stringify({ classroom_id: classroom.id }),
          created_by: user.id
        })
        .select('id')
        .single();

      if (groupError) {
        console.error('Error creating group chat:', groupError);
      } else if (groupChat) {
        // Add teacher to the group chat
        await supabase
          .from('group_members')
          .insert({
            group_id: groupChat.id,
            user_id: user.id,
            role: 'creator'
          });
      }

      toast.success('Classroom created with group chat!');
      onSuccess();
      onOpenChange(false);
      resetForm();
    } catch (error) {
      console.error('Error creating classroom:', error);
      toast.error('Failed to create classroom');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setName('');
    setSubject('');
    setDescription('');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-primary" />
            Create New Classroom
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Classroom Name</Label>
            <Input
              id="name"
              placeholder="e.g., Year 10 Science"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="subject">Subject</Label>
            <Select value={subject} onValueChange={setSubject} required>
              <SelectTrigger>
                <SelectValue placeholder="Select a subject" />
              </SelectTrigger>
              <SelectContent>
                {SUBJECTS.map((subj) => (
                  <SelectItem key={subj} value={subj}>
                    {subj}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description (optional)</Label>
            <Textarea
              id="description"
              placeholder="Brief description of the class..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading || !name || !subject}>
              {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Create Classroom
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateClassroomModal;
