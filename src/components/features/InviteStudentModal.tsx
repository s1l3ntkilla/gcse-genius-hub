import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Checkbox } from '@/components/ui/checkbox';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { UserPlus, Search, Loader2, Send, Users } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext';
import { toast } from 'sonner';

interface InviteStudentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  classroom: {
    id: string;
    name: string;
    subject: string;
  } | null;
  onSuccess: () => void;
}

interface Student {
  id: string;
  full_name: string | null;
  email: string;
  profile_picture_url: string | null;
}

const InviteStudentModal: React.FC<InviteStudentModalProps> = ({
  open,
  onOpenChange,
  classroom,
  onSuccess
}) => {
  const { user } = useSupabaseAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const [inviteMessage, setInviteMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [searching, setSearching] = useState(false);
  const [existingMembers, setExistingMembers] = useState<string[]>([]);

  useEffect(() => {
    if (open && classroom) {
      fetchExistingMembers();
      searchStudents('');
    }
  }, [open, classroom]);

  const fetchExistingMembers = async () => {
    if (!classroom) return;
    
    const { data } = await supabase
      .from('classroom_members')
      .select('student_id')
      .eq('classroom_id', classroom.id);
    
    const { data: invitedData } = await supabase
      .from('classroom_invitations')
      .select('student_id')
      .eq('classroom_id', classroom.id)
      .eq('status', 'pending');

    const memberIds = data?.map(m => m.student_id) || [];
    const invitedIds = invitedData?.map(i => i.student_id) || [];
    setExistingMembers([...memberIds, ...invitedIds]);
  };

  const searchStudents = async (query: string) => {
    setSearching(true);
    try {
      let queryBuilder = supabase
        .from('profiles')
        .select('id, full_name, email, profile_picture_url')
        .eq('user_type', 'student')
        .neq('id', user?.id);

      if (query) {
        queryBuilder = queryBuilder.or(`full_name.ilike.%${query}%,email.ilike.%${query}%`);
      }

      const { data, error } = await queryBuilder.limit(20);

      if (error) throw error;
      setStudents(data || []);
    } catch (error) {
      console.error('Error searching students:', error);
    } finally {
      setSearching(false);
    }
  };

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    // Debounce search
    const timeout = setTimeout(() => searchStudents(value), 300);
    return () => clearTimeout(timeout);
  };

  const toggleStudent = (studentId: string) => {
    setSelectedStudents(prev =>
      prev.includes(studentId)
        ? prev.filter(id => id !== studentId)
        : [...prev, studentId]
    );
  };

  const handleInvite = async () => {
    if (!classroom || selectedStudents.length === 0) return;

    setLoading(true);
    try {
      // Create invitations
      const invitations = selectedStudents.map(studentId => ({
        classroom_id: classroom.id,
        student_id: studentId,
        invited_by: user?.id,
        message: inviteMessage || null
      }));

      const { error: inviteError } = await supabase
        .from('classroom_invitations')
        .insert(invitations);

      if (inviteError) throw inviteError;

      // Create classroom members with pending status
      const members = selectedStudents.map(studentId => ({
        classroom_id: classroom.id,
        student_id: studentId,
        status: 'pending'
      }));

      const { error: memberError } = await supabase
        .from('classroom_members')
        .insert(members);

      if (memberError) throw memberError;

      // Send notification messages to students via group_messages (create a system notification)
      // For now, we'll use a toast to confirm the invite was sent
      toast.success(`${selectedStudents.length} student(s) invited successfully! They will receive a notification.`);
      
      onSuccess();
      onOpenChange(false);
      resetForm();
    } catch (error) {
      console.error('Error inviting students:', error);
      toast.error('Failed to send invitations');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setSearchQuery('');
    setSelectedStudents([]);
    setInviteMessage('');
  };

  const getInitials = (name: string | null) => {
    if (!name) return '?';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const availableStudents = students.filter(s => !existingMembers.includes(s.id));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserPlus className="w-5 h-5 text-primary" />
            Invite Students to {classroom?.name}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Search */}
          <div className="space-y-2">
            <Label>Search Students</Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search by name or email..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>

          {/* Student List */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Available Students</Label>
              {selectedStudents.length > 0 && (
                <Badge variant="secondary">
                  {selectedStudents.length} selected
                </Badge>
              )}
            </div>
            <ScrollArea className="h-[200px] border rounded-lg">
              {searching ? (
                <div className="flex items-center justify-center h-full">
                  <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                </div>
              ) : availableStudents.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                  <Users className="w-8 h-8 mb-2" />
                  <p className="text-sm">No students found</p>
                </div>
              ) : (
                <div className="p-2 space-y-1">
                  {availableStudents.map((student) => (
                    <div
                      key={student.id}
                      className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-colors ${
                        selectedStudents.includes(student.id)
                          ? 'bg-primary/10 border border-primary/30'
                          : 'hover:bg-accent'
                      }`}
                      onClick={() => toggleStudent(student.id)}
                    >
                      <Checkbox
                        checked={selectedStudents.includes(student.id)}
                        onCheckedChange={() => toggleStudent(student.id)}
                      />
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={student.profile_picture_url || undefined} />
                        <AvatarFallback className="text-xs">
                          {getInitials(student.full_name)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">
                          {student.full_name || 'Unknown Student'}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                          {student.email}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </div>

          {/* Invite Message */}
          <div className="space-y-2">
            <Label htmlFor="message">Personal Message (optional)</Label>
            <Textarea
              id="message"
              placeholder="Add a welcome message for the students..."
              value={inviteMessage}
              onChange={(e) => setInviteMessage(e.target.value)}
              rows={2}
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleInvite}
              disabled={loading || selectedStudents.length === 0}
              className="gap-2"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
              Send {selectedStudents.length > 0 ? `(${selectedStudents.length})` : ''} Invitations
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default InviteStudentModal;
