import React, { useState, useEffect } from 'react';
import { MainLayout } from '@/components/layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  Plus, 
  BookOpen, 
  UserPlus,
  Copy,
  MoreVertical,
  Video,
  Mail,
  CheckCircle,
  XCircle,
  KeyRound,
  MessageSquare
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import CreateClassroomModal from '@/components/features/CreateClassroomModal';
import InviteStudentModal from '@/components/features/InviteStudentModal';
import JoinClassModal from '@/components/features/JoinClassModal';
import ClassroomMembersModal from '@/components/features/ClassroomMembersModal';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface Classroom {
  id: string;
  name: string;
  subject: string;
  description: string | null;
  class_code: string;
  teacher_id: string;
  created_at: string;
  member_count?: number;
}

interface ClassInvitation {
  id: string;
  classroom_id: string;
  status: string;
  message: string | null;
  created_at: string;
  classroom?: {
    name: string;
    subject: string;
    teacher?: {
      full_name: string | null;
    };
  };
}

const MyClasses: React.FC = () => {
  const { role } = useAuth();
  const { user } = useSupabaseAuth();
  const [classrooms, setClassrooms] = useState<Classroom[]>([]);
  const [invitations, setInvitations] = useState<ClassInvitation[]>([]);
  const [loading, setLoading] = useState(true);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [inviteModalOpen, setInviteModalOpen] = useState(false);
  const [joinModalOpen, setJoinModalOpen] = useState(false);
  const [membersModalOpen, setMembersModalOpen] = useState(false);
  const [selectedClassroom, setSelectedClassroom] = useState<Classroom | null>(null);

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user, role]);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (role === 'teacher') {
        // Fetch teacher's classrooms
        const { data, error } = await supabase
          .from('classrooms')
          .select('*')
          .eq('teacher_id', user?.id)
          .order('created_at', { ascending: false });

        if (error) throw error;
        
        // Get member counts
        const classroomsWithCounts = await Promise.all(
          (data || []).map(async (classroom) => {
            const { count } = await supabase
              .from('classroom_members')
              .select('*', { count: 'exact', head: true })
              .eq('classroom_id', classroom.id)
              .eq('status', 'accepted');
            return { ...classroom, member_count: count || 0 };
          })
        );
        
        setClassrooms(classroomsWithCounts);
      } else {
        // Fetch student's classes
        const { data: memberships, error: memberError } = await supabase
          .from('classroom_members')
          .select('classroom_id')
          .eq('student_id', user?.id)
          .eq('status', 'accepted');

        if (memberError) throw memberError;

        if (memberships && memberships.length > 0) {
          const classroomIds = memberships.map(m => m.classroom_id);
          const { data: classData, error: classError } = await supabase
            .from('classrooms')
            .select('*')
            .in('id', classroomIds);

          if (classError) throw classError;
          setClassrooms(classData || []);
        }

        // Fetch pending invitations for student
        const { data: inviteData, error: inviteError } = await supabase
          .from('classroom_invitations')
          .select('*')
          .eq('student_id', user?.id)
          .eq('status', 'pending');

        if (inviteError) throw inviteError;
        
        // Fetch classroom details for invitations
        if (inviteData && inviteData.length > 0) {
          const invitesWithDetails = await Promise.all(
            inviteData.map(async (invite) => {
              const { data: classroom } = await supabase
                .from('classrooms')
                .select('name, subject, teacher_id')
                .eq('id', invite.classroom_id)
                .single();
              
              let teacherName = null;
              if (classroom?.teacher_id) {
                const { data: teacher } = await supabase
                  .from('profiles')
                  .select('full_name')
                  .eq('id', classroom.teacher_id)
                  .single();
                teacherName = teacher?.full_name;
              }
              
              return {
                ...invite,
                classroom: {
                  name: classroom?.name || 'Unknown',
                  subject: classroom?.subject || 'Unknown',
                  teacher: { full_name: teacherName }
                }
              };
            })
          );
          setInvitations(invitesWithDetails);
        }
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load classes');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast.success('Class code copied!');
  };

  const handleInviteStudents = (classroom: Classroom) => {
    setSelectedClassroom(classroom);
    setInviteModalOpen(true);
  };

  const handleViewStudents = (classroom: Classroom) => {
    setSelectedClassroom(classroom);
    setMembersModalOpen(true);
  };

  const handleAcceptInvitation = async (invitationId: string, classroomId: string) => {
    try {
      // Update invitation status
      await supabase
        .from('classroom_invitations')
        .update({ status: 'accepted', responded_at: new Date().toISOString() })
        .eq('id', invitationId);

      // Add student to classroom members
      await supabase
        .from('classroom_members')
        .upsert({
          classroom_id: classroomId,
          student_id: user?.id,
          status: 'accepted',
          joined_at: new Date().toISOString()
        });

      // Add student to the classroom's group chat
      const { data: groupChats } = await supabase
        .from('group_chats')
        .select('id, description')
        .eq('group_type', 'class_discussion');

      if (groupChats) {
        const classroomGroupChat = groupChats.find(gc => {
          try {
            const desc = JSON.parse(gc.description || '{}');
            return desc.classroom_id === classroomId;
          } catch {
            return false;
          }
        });

        if (classroomGroupChat && user) {
          await supabase
            .from('group_members')
            .upsert({
              group_id: classroomGroupChat.id,
              user_id: user.id,
              role: 'member'
            });
        }
      }

      toast.success('You have joined the class!');
      fetchData();
    } catch (error) {
      console.error('Error accepting invitation:', error);
      toast.error('Failed to accept invitation');
    }
  };

  const handleDeclineInvitation = async (invitationId: string) => {
    try {
      await supabase
        .from('classroom_invitations')
        .update({ status: 'declined', responded_at: new Date().toISOString() })
        .eq('id', invitationId);

      toast.success('Invitation declined');
      fetchData();
    } catch (error) {
      console.error('Error declining invitation:', error);
      toast.error('Failed to decline invitation');
    }
  };

  const handleCreateAllGroupChats = async () => {
    if (!user) {
      toast.error('You must be logged in');
      return;
    }
    
    if (classrooms.length === 0) {
      toast.error('No classrooms found. Create a classroom first.');
      return;
    }

    toast.info(`Found ${classrooms.length} classroom(s). Creating group chats...`);

    try {
      // Get all existing group chats
      const { data: existingChats, error: fetchError } = await supabase
        .from('group_chats')
        .select('id, description')
        .eq('group_type', 'class_discussion');

      if (fetchError) {
        console.error('Error fetching existing chats:', fetchError);
        toast.error(`Error: ${fetchError.message}`);
        return;
      }

      console.log('Existing chats:', existingChats);

      const existingClassroomIds = new Set(
        (existingChats || [])
          .map(gc => {
            try {
              const desc = JSON.parse(gc.description || '{}');
              return desc.classroom_id;
            } catch {
              return null;
            }
          })
          .filter(Boolean)
      );

      console.log('Existing classroom IDs with chats:', existingClassroomIds);

      // Find classrooms without group chats
      const classroomsWithoutChats = classrooms.filter(c => !existingClassroomIds.has(c.id));
      console.log('Classrooms without chats:', classroomsWithoutChats);

      if (classroomsWithoutChats.length === 0) {
        toast.info('All classrooms already have group chats!');
        return;
      }

      let created = 0;
      let errors: string[] = [];
      
      for (const classroom of classroomsWithoutChats) {
        console.log('Creating group chat for:', classroom.name);
        
        // Create group chat
        const { data: groupChat, error: groupError } = await supabase
          .from('group_chats')
          .insert({
            group_name: classroom.name,
            subject: classroom.subject,
            group_type: 'class_discussion',
            description: JSON.stringify({ classroom_id: classroom.id }),
            created_by: user.id
          })
          .select('id')
          .single();

        if (groupError) {
          console.error('Error creating group chat for', classroom.name, groupError);
          errors.push(`${classroom.name}: ${groupError.message}`);
          continue;
        }

        console.log('Created group chat:', groupChat);

        // Add teacher to group chat
        const { error: memberError } = await supabase
          .from('group_members')
          .insert({
            group_id: groupChat.id,
            user_id: user.id,
            role: 'creator'
          });

        if (memberError) {
          console.error('Error adding teacher to group:', memberError);
        }

        // Add existing students to group chat
        const { data: members } = await supabase
          .from('classroom_members')
          .select('student_id')
          .eq('classroom_id', classroom.id)
          .eq('status', 'accepted');

        if (members && members.length > 0) {
          const memberInserts = members.map(m => ({
            group_id: groupChat.id,
            user_id: m.student_id,
            role: 'member' as const
          }));

          await supabase.from('group_members').insert(memberInserts);
        }

        created++;
      }

      if (errors.length > 0) {
        toast.error(`Errors: ${errors.join(', ')}`);
      }
      
      if (created > 0) {
        toast.success(`Created ${created} group chat${created !== 1 ? 's' : ''}! Check Messages.`);
      } else {
        toast.error('No group chats were created. Check browser console for errors.');
      }
    } catch (error) {
      console.error('Error creating group chats:', error);
      toast.error(`Failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  return (
    <MainLayout>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl font-bold text-foreground flex items-center gap-3">
              <Users className="w-8 h-8 text-primary" />
              {role === 'student' ? 'My Classes' : 'Manage Classes'}
            </h1>
            <p className="text-muted-foreground mt-1">
              {role === 'student' 
                ? 'View your enrolled classes and invitations' 
                : 'Create and manage your classrooms'}
            </p>
          </div>
          {role === 'teacher' ? (
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleCreateAllGroupChats} className="gap-2">
                <MessageSquare className="w-4 h-4" />
                Enable All Chats
              </Button>
              <Button onClick={() => setCreateModalOpen(true)} className="gap-2">
                <Plus className="w-4 h-4" />
                Create Classroom
              </Button>
            </div>
          ) : (
            <Button onClick={() => setJoinModalOpen(true)} className="gap-2">
              <KeyRound className="w-4 h-4" />
              Join with Code
            </Button>
          )}
        </div>

        {/* Pending Invitations for Students */}
        {role === 'student' && invitations.length > 0 && (
          <Card className="border-primary/50 bg-primary/5">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Mail className="w-5 h-5 text-primary" />
                Pending Invitations ({invitations.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {invitations.map((invitation) => (
                <div key={invitation.id} className="flex items-center justify-between p-4 bg-background rounded-lg border">
                  <div>
                    <p className="font-medium">{invitation.classroom?.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {invitation.classroom?.subject} • by {invitation.classroom?.teacher?.full_name || 'Teacher'}
                    </p>
                    {invitation.message && (
                      <p className="text-sm text-muted-foreground mt-1 italic">"{invitation.message}"</p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDeclineInvitation(invitation.id)}
                      className="gap-1"
                    >
                      <XCircle className="w-4 h-4" />
                      Decline
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => handleAcceptInvitation(invitation.id, invitation.classroom_id)}
                      className="gap-1"
                    >
                      <CheckCircle className="w-4 h-4" />
                      Accept
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Stats for Teachers */}
        {role === 'teacher' && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card className="card-elevated">
              <CardContent className="p-4 flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Classes</p>
                  <p className="text-2xl font-bold">{classrooms.length}</p>
                </div>
              </CardContent>
            </Card>
            <Card className="card-elevated">
              <CardContent className="p-4 flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center">
                  <Users className="w-6 h-6 text-success" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Students</p>
                  <p className="text-2xl font-bold">
                    {classrooms.reduce((sum, c) => sum + (c.member_count || 0), 0)}
                  </p>
                </div>
              </CardContent>
            </Card>
            <Card className="card-elevated">
              <CardContent className="p-4 flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-warning/10 flex items-center justify-center">
                  <Video className="w-6 h-6 text-warning" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Live Lessons</p>
                  <p className="text-2xl font-bold">0</p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Classrooms Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="card-elevated animate-pulse">
                <CardContent className="p-6">
                  <div className="h-6 bg-muted rounded w-3/4 mb-2" />
                  <div className="h-4 bg-muted rounded w-1/2" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : classrooms.length === 0 ? (
          <Card className="card-elevated">
            <CardContent className="py-12 text-center">
              <Users className="w-16 h-16 mx-auto text-muted-foreground/50 mb-4" />
              <h3 className="text-lg font-medium">No classes yet</h3>
              <p className="text-muted-foreground mt-1">
                {role === 'student' 
                  ? 'You haven\'t joined any classes yet. Accept an invitation to get started!'
                  : 'Create your first classroom to start teaching'}
              </p>
              {role === 'teacher' && (
                <Button onClick={() => setCreateModalOpen(true)} className="mt-4 gap-2">
                  <Plus className="w-4 h-4" />
                  Create Classroom
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {classrooms.map((classroom) => (
              <Card key={classroom.id} className="card-elevated hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{classroom.name}</CardTitle>
                      <Badge variant="secondary" className="mt-1">{classroom.subject}</Badge>
                    </div>
                    {role === 'teacher' && (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleViewStudents(classroom)}>
                            <Users className="w-4 h-4 mr-2" />
                            View Students
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleInviteStudents(classroom)}>
                            <UserPlus className="w-4 h-4 mr-2" />
                            Invite Students
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleCopyCode(classroom.class_code)}>
                            <Copy className="w-4 h-4 mr-2" />
                            Copy Class Code
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Video className="w-4 h-4 mr-2" />
                            Start Live Lesson
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  {classroom.description && (
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                      {classroom.description}
                    </p>
                  )}
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Users className="w-4 h-4" />
                      <span>{classroom.member_count || 0} students</span>
                    </div>
                    {role === 'teacher' && (
                      <div className="flex items-center gap-1 bg-muted px-2 py-1 rounded font-mono text-xs">
                        <span>{classroom.class_code}</span>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-5 w-5"
                          onClick={() => handleCopyCode(classroom.class_code)}
                        >
                          <Copy className="w-3 h-3" />
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Modals */}
      <CreateClassroomModal 
        open={createModalOpen} 
        onOpenChange={setCreateModalOpen}
        onSuccess={fetchData}
      />
      <InviteStudentModal
        open={inviteModalOpen}
        onOpenChange={setInviteModalOpen}
        classroom={selectedClassroom}
        onSuccess={fetchData}
      />
      <JoinClassModal
        open={joinModalOpen}
        onOpenChange={setJoinModalOpen}
        onSuccess={fetchData}
      />
      <ClassroomMembersModal
        open={membersModalOpen}
        onOpenChange={setMembersModalOpen}
        classroom={selectedClassroom}
        isTeacher={role === 'teacher'}
        onMemberRemoved={fetchData}
      />
    </MainLayout>
  );
};

export default MyClasses;
