import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Video,
  VideoOff,
  Mic,
  MicOff,
  MonitorUp,
  Users,
  MessageSquare,
  Hand,
  PhoneOff,
  Settings,
  Send,
  Loader2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext';
import { toast } from 'sonner';

interface LiveLessonViewProps {
  lessonId: string;
  lessonData: {
    title: string;
    classroomId: string;
    classroomName: string;
    description: string;
  };
  onEndLesson: () => void;
  role: 'student' | 'teacher';
}

interface ChatMessage {
  id: string;
  sender_id: string;
  sender_name: string;
  message: string;
  created_at: string;
}

interface Participant {
  id: string;
  user_id: string;
  user_name: string;
  role: string;
  hand_raised: boolean;
  joined_at: string;
}

const LiveLessonView: React.FC<LiveLessonViewProps> = ({
  lessonId,
  lessonData,
  onEndLesson,
  role
}) => {
  const { user, profile } = useSupabaseAuth();
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [showChat, setShowChat] = useState(true);
  const [handRaised, setHandRaised] = useState(false);
  const [chatMessage, setChatMessage] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [loading, setLoading] = useState(true);
  const [sendingMessage, setSendingMessage] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const userName = profile?.full_name || user?.email?.split('@')[0] || 'User';

  // Initial data fetch
  useEffect(() => {
    if (!lessonId || !user) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        // Join as participant
        const { error: joinError } = await supabase
          .from('live_lesson_participants')
          .upsert({
            lesson_id: lessonId,
            user_id: user.id,
            user_name: userName,
            role: role,
            hand_raised: false
          }, { onConflict: 'lesson_id,user_id' });

        if (joinError) console.error('Error joining lesson:', joinError);

        // Fetch existing messages
        const { data: messagesData } = await supabase
          .from('live_lesson_messages')
          .select('*')
          .eq('lesson_id', lessonId)
          .order('created_at', { ascending: true });

        if (messagesData) setMessages(messagesData);

        // Fetch participants
        const { data: participantsData } = await supabase
          .from('live_lesson_participants')
          .select('*')
          .eq('lesson_id', lessonId)
          .is('left_at', null);

        if (participantsData) setParticipants(participantsData);
      } catch (error) {
        console.error('Error fetching lesson data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [lessonId, user, userName, role]);

  // Real-time subscriptions
  useEffect(() => {
    if (!lessonId) return;

    // Subscribe to new messages
    const messagesChannel = supabase
      .channel(`lesson-messages-${lessonId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'live_lesson_messages',
          filter: `lesson_id=eq.${lessonId}`
        },
        (payload) => {
          console.log('New message received:', payload);
          setMessages(prev => [...prev, payload.new as ChatMessage]);
        }
      )
      .subscribe();

    // Subscribe to participant changes
    const participantsChannel = supabase
      .channel(`lesson-participants-${lessonId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'live_lesson_participants',
          filter: `lesson_id=eq.${lessonId}`
        },
        async () => {
          // Refetch participants on any change
          const { data } = await supabase
            .from('live_lesson_participants')
            .select('*')
            .eq('lesson_id', lessonId)
            .is('left_at', null);
          if (data) setParticipants(data);
        }
      )
      .subscribe();

    // Subscribe to lesson status changes
    const lessonChannel = supabase
      .channel(`lesson-status-${lessonId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'live_lessons',
          filter: `id=eq.${lessonId}`
        },
        (payload) => {
          if ((payload.new as any).status === 'ended') {
            toast.info('The lesson has ended');
            onEndLesson();
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(messagesChannel);
      supabase.removeChannel(participantsChannel);
      supabase.removeChannel(lessonChannel);
    };
  }, [lessonId, onEndLesson]);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!chatMessage.trim() || !user) return;
    
    setSendingMessage(true);
    try {
      const { error } = await supabase
        .from('live_lesson_messages')
        .insert({
          lesson_id: lessonId,
          sender_id: user.id,
          sender_name: userName,
          message: chatMessage.trim()
        });

      if (error) throw error;
      setChatMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message');
    } finally {
      setSendingMessage(false);
    }
  };

  const handleToggleHand = async () => {
    if (!user) return;
    
    const newHandRaised = !handRaised;
    setHandRaised(newHandRaised);
    
    try {
      const { error } = await supabase
        .from('live_lesson_participants')
        .update({ hand_raised: newHandRaised })
        .eq('lesson_id', lessonId)
        .eq('user_id', user.id);

      if (error) throw error;
      
      if (newHandRaised) {
        toast.info('Hand raised - teacher will see your request');
      }
    } catch (error) {
      console.error('Error toggling hand:', error);
      setHandRaised(!newHandRaised); // Revert
    }
  };

  const handleEndLesson = async () => {
    if (!user) return;
    
    try {
      if (role === 'teacher') {
        // End the lesson for everyone
        await supabase
          .from('live_lessons')
          .update({ status: 'ended', ended_at: new Date().toISOString() })
          .eq('id', lessonId);
        toast.success('Lesson ended');
      } else {
        // Just leave the lesson
        await supabase
          .from('live_lesson_participants')
          .update({ left_at: new Date().toISOString() })
          .eq('lesson_id', lessonId)
          .eq('user_id', user.id);
        toast.info('You have left the lesson');
      }
      onEndLesson();
    } catch (error) {
      console.error('Error ending lesson:', error);
    }
  };

  const raisedHands = participants.filter(p => p.hand_raised && p.role === 'student');

  if (loading) {
    return (
      <div className="h-[calc(100vh-200px)] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-200px)] flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold flex items-center gap-2">
            <div className="w-3 h-3 bg-destructive rounded-full animate-pulse" />
            {lessonData.title}
          </h2>
          <p className="text-sm text-muted-foreground">
            {lessonData.classroomName} - Live Now
          </p>
        </div>
        <div className="flex items-center gap-2">
          {raisedHands.length > 0 && role === 'teacher' && (
            <Badge variant="default" className="gap-1 bg-warning text-warning-foreground">
              <Hand className="w-3 h-3" />
              {raisedHands.length} hand{raisedHands.length > 1 ? 's' : ''} raised
            </Badge>
          )}
          <Badge variant="secondary" className="gap-1">
            <Users className="w-3 h-3" />
            {participants.length} participant{participants.length !== 1 ? 's' : ''}
          </Badge>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex gap-4">
        {/* Video Area */}
        <div className="flex-1 flex flex-col gap-4">
          {/* Main Video */}
          <Card className="flex-1 bg-foreground/5 relative overflow-hidden">
            <CardContent className="p-0 h-full flex items-center justify-center">
              {isVideoOn ? (
                <div className="w-full h-full bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-24 h-24 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
                      <Video className="w-12 h-12 text-primary" />
                    </div>
                    <p className="text-foreground text-lg font-medium">
                      {role === 'teacher' ? 'Your Camera' : 'Teacher\'s Camera'}
                    </p>
                    <p className="text-muted-foreground text-sm">Video preview</p>
                  </div>
                </div>
              ) : (
                <div className="text-center text-muted-foreground">
                  <VideoOff className="w-16 h-16 mx-auto mb-2" />
                  <p>Camera is off</p>
                </div>
              )}
              
              {/* Screen share indicator */}
              {isScreenSharing && (
                <div className="absolute top-4 left-4">
                  <Badge className="bg-primary gap-1">
                    <MonitorUp className="w-3 h-3" />
                    Sharing Screen
                  </Badge>
                </div>
              )}

              {/* Raised hands indicator for teacher */}
              {role === 'teacher' && raisedHands.length > 0 && (
                <div className="absolute top-4 right-4">
                  <Card className="bg-card/95 p-3">
                    <p className="text-sm font-medium mb-2 flex items-center gap-2">
                      <Hand className="w-4 h-4 text-warning" />
                      Raised Hands
                    </p>
                    <div className="space-y-1">
                      {raisedHands.map(p => (
                        <p key={p.id} className="text-sm text-muted-foreground">{p.user_name}</p>
                      ))}
                    </div>
                  </Card>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Controls */}
          <Card className="bg-card">
            <CardContent className="p-4">
              <div className="flex items-center justify-center gap-2">
                <Button
                  variant={isMuted ? "destructive" : "secondary"}
                  size="icon"
                  onClick={() => setIsMuted(!isMuted)}
                  className="h-12 w-12 rounded-full"
                >
                  {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                </Button>
                
                <Button
                  variant={isVideoOn ? "secondary" : "destructive"}
                  size="icon"
                  onClick={() => setIsVideoOn(!isVideoOn)}
                  className="h-12 w-12 rounded-full"
                >
                  {isVideoOn ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
                </Button>

                {role === 'teacher' && (
                  <Button
                    variant={isScreenSharing ? "default" : "secondary"}
                    size="icon"
                    onClick={() => setIsScreenSharing(!isScreenSharing)}
                    className="h-12 w-12 rounded-full"
                  >
                    <MonitorUp className="w-5 h-5" />
                  </Button>
                )}

                {role === 'student' && (
                  <Button
                    variant={handRaised ? "default" : "secondary"}
                    size="icon"
                    onClick={handleToggleHand}
                    className={cn("h-12 w-12 rounded-full", handRaised && "bg-warning hover:bg-warning/90")}
                  >
                    <Hand className="w-5 h-5" />
                  </Button>
                )}

                <Button
                  variant="secondary"
                  size="icon"
                  onClick={() => setShowChat(!showChat)}
                  className="h-12 w-12 rounded-full"
                >
                  <MessageSquare className="w-5 h-5" />
                </Button>

                <Button
                  variant="secondary"
                  size="icon"
                  className="h-12 w-12 rounded-full"
                >
                  <Settings className="w-5 h-5" />
                </Button>

                <div className="w-px h-8 bg-border mx-2" />

                <Button
                  variant="destructive"
                  onClick={handleEndLesson}
                  className="gap-2"
                >
                  <PhoneOff className="w-4 h-4" />
                  {role === 'teacher' ? 'End Lesson' : 'Leave'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Chat Panel */}
        {showChat && (
          <Card className="w-80 flex flex-col">
            <div className="p-4 border-b">
              <h3 className="font-semibold flex items-center gap-2">
                <MessageSquare className="w-4 h-4" />
                Live Chat
              </h3>
              {/* Participants */}
              <div className="flex flex-wrap gap-1 mt-2">
                {participants.slice(0, 5).map((p) => (
                  <Avatar key={p.id} className="w-6 h-6 border border-border">
                    <AvatarFallback className="text-xs bg-primary/10 text-primary">
                      {p.user_name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                ))}
                {participants.length > 5 && (
                  <span className="text-xs text-muted-foreground ml-1">
                    +{participants.length - 5} more
                  </span>
                )}
              </div>
            </div>
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-3">
                {messages.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No messages yet. Start the conversation.
                  </p>
                ) : (
                  messages.map((msg) => (
                    <div key={msg.id} className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className={cn(
                          "text-sm font-medium",
                          msg.sender_id === user?.id && "text-primary"
                        )}>
                          {msg.sender_id === user?.id ? 'You' : msg.sender_name}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">{msg.message}</p>
                    </div>
                  ))
                )}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>
            <div className="p-4 border-t">
              <div className="flex gap-2">
                <Textarea
                  placeholder="Type a message..."
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                  className="min-h-[40px] max-h-[80px] resize-none"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                />
                <Button 
                  size="icon" 
                  onClick={handleSendMessage}
                  disabled={sendingMessage || !chatMessage.trim()}
                >
                  {sendingMessage ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                </Button>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default LiveLessonView;
