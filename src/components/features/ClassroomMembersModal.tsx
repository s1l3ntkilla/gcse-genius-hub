import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Users, UserMinus, Loader2, Mail } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface ClassroomMembersModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  classroom: {
    id: string;
    name: string;
    subject: string;
  } | null;
  isTeacher: boolean;
  onMemberRemoved?: () => void;
}

interface Member {
  id: string;
  student_id: string;
  status: string;
  joined_at: string | null;
  profile: {
    full_name: string | null;
    email: string;
  } | null;
}

const ClassroomMembersModal: React.FC<ClassroomMembersModalProps> = ({
  open,
  onOpenChange,
  classroom,
  isTeacher,
  onMemberRemoved
}) => {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(false);
  const [removingId, setRemovingId] = useState<string | null>(null);
  const [confirmRemove, setConfirmRemove] = useState<Member | null>(null);

  useEffect(() => {
    if (open && classroom) {
      fetchMembers();
    }
  }, [open, classroom]);

  const fetchMembers = async () => {
    if (!classroom) return;
    
    setLoading(true);
    try {
      // First fetch classroom members
      const { data: membersData, error: membersError } = await supabase
        .from('classroom_members')
        .select('id, student_id, status, joined_at')
        .eq('classroom_id', classroom.id)
        .eq('status', 'accepted')
        .order('joined_at', { ascending: true });

      if (membersError) {
        console.error('Error fetching members:', membersError);
        toast.error(`Failed to load students: ${membersError.message}`);
        setLoading(false);
        return;
      }

      if (!membersData || membersData.length === 0) {
        setMembers([]);
        setLoading(false);
        return;
      }

      // Then fetch profiles for all student_ids
      const studentIds = membersData.map(m => m.student_id);
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('id, full_name, email')
        .in('id', studentIds);

      if (profilesError) {
        console.error('Error fetching profiles:', profilesError);
        // Continue without profiles - just show "Unknown Student"
      }

      // Create a map of profiles by id
      const profilesMap = new Map(
        (profilesData || []).map(p => [p.id, { full_name: p.full_name, email: p.email }])
      );

      // Combine members with their profiles
      setMembers(membersData.map(m => ({
        id: m.id,
        student_id: m.student_id,
        status: m.status,
        joined_at: m.joined_at,
        profile: profilesMap.get(m.student_id) || null
      })));
    } catch (error: any) {
      console.error('Error fetching members:', error);
      toast.error(`Failed to load students: ${error?.message || 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveStudent = async (member: Member) => {
    setRemovingId(member.id);
    try {
      // Remove from classroom_members
      const { error: memberError } = await supabase
        .from('classroom_members')
        .delete()
        .eq('id', member.id);

      if (memberError) throw memberError;

      // Also remove from the group chat
      const { data: groupChats } = await supabase
        .from('group_chats')
        .select('id, description')
        .eq('group_type', 'class_discussion');

      if (groupChats) {
        const classroomGroupChat = groupChats.find(gc => {
          try {
            const desc = JSON.parse(gc.description || '{}');
            return desc.classroom_id === classroom?.id;
          } catch {
            return false;
          }
        });

        if (classroomGroupChat) {
          await supabase
            .from('group_members')
            .delete()
            .eq('group_id', classroomGroupChat.id)
            .eq('user_id', member.student_id);
        }
      }

      toast.success(`${member.profile?.full_name || 'Student'} has been removed from the class`);
      setMembers(prev => prev.filter(m => m.id !== member.id));
      onMemberRemoved?.();
    } catch (error) {
      console.error('Error removing student:', error);
      toast.error('Failed to remove student');
    } finally {
      setRemovingId(null);
      setConfirmRemove(null);
    }
  };

  const getInitials = (name: string | null, email: string) => {
    if (name) {
      return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    }
    return email[0].toUpperCase();
  };

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return 'Unknown';
    return new Date(dateStr).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Users className="w-5 h-5 text-primary" />
              {classroom?.name} - Students
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Badge variant="secondary">
                {members.length} student{members.length !== 1 ? 's' : ''} enrolled
              </Badge>
              <Badge variant="outline">{classroom?.subject}</Badge>
            </div>

            <ScrollArea className="h-[400px] pr-4">
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                </div>
              ) : members.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Users className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p className="text-sm">No students enrolled yet</p>
                  <p className="text-xs mt-1">Invite students to join this class</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {members.map((member) => (
                    <div
                      key={member.id}
                      className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                    >
                      <Avatar className="w-10 h-10">
                        <AvatarFallback className="bg-primary/10 text-primary text-sm">
                          {getInitials(member.profile?.full_name || null, member.profile?.email || '?')}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">
                          {member.profile?.full_name || 'Unknown Student'}
                        </p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Mail className="w-3 h-3" />
                          <span className="truncate">{member.profile?.email || 'No email'}</span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          Joined {formatDate(member.joined_at)}
                        </p>
                      </div>

                      {isTeacher && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-destructive hover:text-destructive hover:bg-destructive/10"
                          onClick={() => setConfirmRemove(member)}
                          disabled={removingId === member.id}
                        >
                          {removingId === member.id ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <UserMinus className="w-4 h-4" />
                          )}
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </div>
        </DialogContent>
      </Dialog>

      {/* Confirm Remove Dialog */}
      <AlertDialog open={!!confirmRemove} onOpenChange={() => setConfirmRemove(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove Student</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove{' '}
              <span className="font-semibold">{confirmRemove?.profile?.full_name || 'this student'}</span>{' '}
              from {classroom?.name}? They will lose access to the classroom and group chat.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => confirmRemove && handleRemoveStudent(confirmRemove)}
            >
              Remove Student
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default ClassroomMembersModal;

