import React, { useEffect, useMemo, useState } from 'react';
import { MainLayout } from '@/components/layout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Search,
  Send,
  Paperclip,
  MoreVertical,
  Check,
  CheckCheck,
  Image,
  File,
  MessageSquare,
  Users,
  Plus,
  Mail
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext';

type Classroom = {
  id: string;
  name: string;
  subject?: string | null;
  role?: string | null;
};

type GroupMessage = {
  id: string;
  sender_id: string;
  message_content: string;
  created_at: string | null;
  sender_name?: string | null;
  message_type?: string | null;
};

const Messages: React.FC = () => {
  const { role } = useAuth();
  const { user: supabaseUser } = useSupabaseAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [classrooms, setClassrooms] = useState<Classroom[]>([]);
  const [messages, setMessages] = useState<GroupMessage[]>([]);
  const [isLoadingClassrooms, setIsLoadingClassrooms] = useState(false);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [createName, setCreateName] = useState('');
  const [createSubject, setCreateSubject] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [showInviteForm, setShowInviteForm] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  const filteredClassrooms = useMemo(() => {
    if (!searchQuery.trim()) return classrooms;
    return classrooms.filter((room) =>
      room.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (room.subject || '').toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [classrooms, searchQuery]);

  const fetchClassrooms = async () => {
    if (!supabaseUser) return;
    setIsLoadingClassrooms(true);
    setActionError(null);
    const { data, error } = await supabase
      .from('group_members')
      .select('group_id, role, group_chats ( id, group_name, subject )')
      .eq('user_id', supabaseUser.id);

    if (error) {
      console.error('Error loading classrooms', error);
      setActionError('Unable to load classrooms right now.');
      setIsLoadingClassrooms(false);
      return;
    }

    const mapped = (data || [])
      .filter((item) => item.group_chats)
      .map((item) => ({
        id: item.group_chats!.id,
        name: item.group_chats!.group_name,
        subject: item.group_chats!.subject,
        role: item.role
      }));
    setClassrooms(mapped);
    if (!selectedConversation && mapped.length > 0) {
      setSelectedConversation(mapped[0].id);
    }
    setIsLoadingClassrooms(false);
  };

  const fetchMessages = async (groupId: string) => {
    if (!supabaseUser) return;
    setIsLoadingMessages(true);
    setActionError(null);
    const { data, error } = await supabase
      .from('group_messages')
      .select('id, sender_id, message_content, message_type, created_at, profiles:sender_id(full_name)')
      .eq('group_id', groupId)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error loading messages', error);
      setActionError('Unable to load messages.');
      setIsLoadingMessages(false);
      return;
    }

    setMessages(
      (data || [])
        .filter((msg) => msg.message_type === null || msg.message_type === 'text')
        .map((msg) => ({
          id: msg.id,
          sender_id: msg.sender_id,
          message_content: msg.message_content,
          created_at: msg.created_at,
          sender_name: (msg as any).profiles?.full_name || 'Member',
          message_type: msg.message_type
        }))
    );
    setIsLoadingMessages(false);
  };

  useEffect(() => {
    fetchClassrooms();
  }, [supabaseUser]);

  useEffect(() => {
    if (selectedConversation) {
      fetchMessages(selectedConversation);
    } else {
      setMessages([]);
    }
  }, [selectedConversation]);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation || !supabaseUser) return;
    setActionError(null);
    const { error, data } = await supabase
      .from('group_messages')
      .insert({
        group_id: selectedConversation,
        sender_id: supabaseUser.id,
        message_content: newMessage,
        message_type: 'text'
      })
      .select('id, sender_id, message_content, message_type, created_at')
      .single();

    if (error) {
      console.error('Error sending message', error);
      setActionError('Failed to send message.');
      return;
    }

    setMessages((prev) => ([
      ...prev,
      {
        ...data!,
        sender_name: 'You'
      }
    ]));
    setNewMessage('');
  };

  const handleCreateClassroom = async () => {
    if (!supabaseUser || !createName.trim()) return;
    setActionError(null);

    const { data: newGroup, error } = await supabase
      .from('group_chats')
      .insert({
        group_name: createName.trim(),
        subject: createSubject.trim() || null,
        group_type: 'class_discussion',
        created_by: supabaseUser.id
      })
      .select('id, group_name, subject')
      .single();

    if (error) {
      console.error('Error creating classroom', error);
      setActionError('Could not create classroom.');
      return;
    }

    const { error: memberError } = await supabase
      .from('group_members')
      .insert({
        group_id: newGroup.id,
        user_id: supabaseUser.id,
        role: 'creator'
      });

    if (memberError) {
      console.error('Error linking classroom creator', memberError);
      setActionError('Classroom was created but you were not added as a member.');
    }

    setCreateName('');
    setCreateSubject('');
    await fetchClassrooms();
    setSelectedConversation(newGroup.id);
  };

  const handleInviteStudent = async () => {
    if (!inviteEmail.trim() || !selectedConversation || !supabaseUser) return;
    setActionError(null);

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('id, email, full_name')
      .eq('email', inviteEmail.trim().toLowerCase())
      .single();

    if (profileError || !profile) {
      setActionError('No user found with that email.');
      return;
    }

    const { data: existing } = await supabase
      .from('group_members')
      .select('id')
      .eq('group_id', selectedConversation)
      .eq('user_id', profile.id)
      .maybeSingle();

    if (existing) {
      setActionError('That student is already in this classroom.');
      return;
    }

    const { error } = await supabase
      .from('group_members')
      .insert({
        group_id: selectedConversation,
        user_id: profile.id,
        role: 'member'
      });

    if (error) {
      console.error('Error adding student', error);
      setActionError('Failed to add the student to this classroom.');
      return;
    }

    setInviteEmail('');
    setShowInviteForm(false);
    await fetchClassrooms();
  };

  return (
    <MainLayout>
      <div className="h-[calc(100vh-8rem)] flex gap-6 animate-fade-in">
        {/* Conversations List */}
        <Card className="card-elevated w-80 flex flex-col">
          <div className="p-4 border-b border-border">
            <h2 className="font-display font-semibold text-lg mb-4">Messages</h2>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <ScrollArea className="flex-1">
            <div className="p-4">
              {isLoadingClassrooms ? (
                <div className="text-center py-8 text-muted-foreground">
                  <p className="text-sm">Loading your classrooms...</p>
                </div>
              ) : filteredClassrooms.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Users className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p className="text-sm">No classrooms yet</p>
                  <p className="text-xs mt-1">
                    {role === 'student'
                      ? 'Messages from teachers will appear here'
                      : 'Create a classroom to start messaging students'}
                  </p>
                </div>
              ) : (
                <div className="space-y-1">
                  {filteredClassrooms.map((room: Classroom) => (
                    <button
                      key={room.id}
                      onClick={() => setSelectedConversation(room.id)}
                      className={cn(
                        "w-full p-3 rounded-xl text-left transition-colors",
                        selectedConversation === room.id
                          ? "bg-primary/10 border border-primary/20"
                          : "hover:bg-muted"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <Avatar className="w-10 h-10">
                          <AvatarFallback className="bg-primary/10 text-primary">
                            {room.name[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <span className="font-medium text-sm truncate block">
                            {room.name}
                          </span>
                          {room.subject && (
                            <span className="text-xs text-muted-foreground truncate block">
                              {room.subject}
                            </span>
                          )}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </ScrollArea>

          {role === 'teacher' && (
            <div className="p-4 border-t border-border space-y-3">
              <div className="flex items-center gap-2">
                <Input
                  placeholder="New classroom name"
                  value={createName}
                  onChange={(e) => setCreateName(e.target.value)}
                />
                <Input
                  placeholder="Subject (optional)"
                  value={createSubject}
                  onChange={(e) => setCreateSubject(e.target.value)}
                />
              </div>
              <Button className="w-full gap-2" onClick={handleCreateClassroom} disabled={!createName.trim()}>
                <Plus className="w-4 h-4" />
                Create classroom
              </Button>
            </div>
          )}
        </Card>

        {/* Chat Area */}
        <Card className="card-elevated flex-1 flex flex-col">
          {selectedConversation ? (
            <>
              <div className="p-4 border-b border-border flex items-center justify-between">
                <div>
                  <p className="font-semibold text-lg">Classroom chat</p>
                  {actionError && <p className="text-sm text-destructive mt-1">{actionError}</p>}
                </div>
                {role === 'teacher' && (
                  <div className="flex items-center gap-3">
                    {showInviteForm && (
                      <div className="flex items-center gap-2">
                        <Input
                          placeholder="Student email"
                          value={inviteEmail}
                          onChange={(e) => setInviteEmail(e.target.value)}
                          className="w-64"
                        />
                        <Button
                          variant="secondary"
                          className="gap-2"
                          onClick={handleInviteStudent}
                          disabled={!inviteEmail.trim()}
                        >
                          <Mail className="w-4 h-4" />
                          Invite
                        </Button>
                      </div>
                    )}
                    <Button
                      variant="outline"
                      className="gap-2"
                      onClick={() => setShowInviteForm((open) => !open)}
                    >
                      <Users className="w-4 h-4" />
                      {showInviteForm ? 'Hide invite' : 'Add students'}
                    </Button>
                  </div>
                )}
              </div>

              <ScrollArea className="flex-1">
                <div className="p-6 space-y-4">
                  {isLoadingMessages ? (
                    <p className="text-muted-foreground text-sm">Loading messages...</p>
                  ) : messages.length === 0 ? (
                    <div className="text-center py-10 text-muted-foreground">
                      <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-50" />
                      <p className="text-sm">No messages yet</p>
                      <p className="text-xs mt-1">Start the conversation with your class</p>
                    </div>
                  ) : (
                    messages.map((msg) => (
                      <div
                        key={msg.id}
                        className={cn(
                          'flex items-start gap-3',
                          msg.sender_id === supabaseUser?.id ? 'justify-end' : 'justify-start'
                        )}
                      >
                        {msg.sender_id !== supabaseUser?.id && (
                          <Avatar className="w-9 h-9">
                            <AvatarFallback>{(msg.sender_name || 'M')[0]}</AvatarFallback>
                          </Avatar>
                        )}
                        <div
                          className={cn(
                            'rounded-2xl px-4 py-3 max-w-xl shadow-sm',
                            msg.sender_id === supabaseUser?.id
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-muted'
                          )}
                        >
                          <p className="text-sm font-semibold mb-1">
                            {msg.sender_id === supabaseUser?.id ? 'You' : msg.sender_name || 'Classmate'}
                          </p>
                          <p className="text-sm whitespace-pre-wrap">{msg.message_content}</p>
                        </div>
                        {msg.sender_id === supabaseUser?.id && (
                          <Avatar className="w-9 h-9">
                            <AvatarFallback>You</AvatarFallback>
                          </Avatar>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </ScrollArea>

              <div className="p-4 border-t border-border">
                <div className="flex items-center gap-3">
                  <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
                    <Paperclip className="w-5 h-5" />
                  </Button>
                  <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
                    <Image className="w-5 h-5" />
                  </Button>
                  <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
                    <File className="w-5 h-5" />
                  </Button>
                  <div className="flex-1 flex items-center gap-2 bg-muted/50 rounded-xl px-3 py-2">
                    <Input
                      placeholder="Type your message..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      className="bg-transparent border-0 shadow-none focus-visible:ring-0"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleSendMessage();
                        }
                      }}
                    />
                    <Button onClick={handleSendMessage} className="gap-2">
                      Send
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-muted-foreground">
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                  <MessageSquare className="w-8 h-8 opacity-50" />
                </div>
                <h3 className="font-medium">No conversations</h3>
                <p className="text-sm mt-1">
                  {role === 'student'
                    ? 'Your teachers will message you here'
                    : 'Create or select a classroom to start messaging'}
                </p>
              </div>
            </div>
          )}
        </Card>
      </div>
    </MainLayout>
  );
};

export default Messages;
