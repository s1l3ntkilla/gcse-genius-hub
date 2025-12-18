import React, { useState, useEffect, useRef, useCallback } from 'react';
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
  Loader2,
  AlertCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext';
import { toast } from 'sonner';
import { WebRTCManager } from '@/utils/WebRTCManager';

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

interface RemoteStream {
  peerId: string;
  peerName: string;
  stream: MediaStream;
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
  const [mediaError, setMediaError] = useState<string | null>(null);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStreams, setRemoteStreams] = useState<RemoteStream[]>([]);
  const [connecting, setConnecting] = useState(true);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const webrtcManagerRef = useRef<WebRTCManager | null>(null);

  const userName = profile?.full_name || user?.email?.split('@')[0] || 'User';

  // Handle remote stream callback
  const handleRemoteStream = useCallback((peerId: string, peerName: string, stream: MediaStream | null) => {
    console.log('[LiveLesson] Remote stream received from:', peerName);
    if (stream) {
      setRemoteStreams(prev => {
        const existing = prev.find(s => s.peerId === peerId);
        if (existing) {
          return prev.map(s => s.peerId === peerId ? { ...s, stream } : s);
        }
        return [...prev, { peerId, peerName, stream }];
      });
    }
  }, []);

  // Handle peer disconnection
  const handlePeerDisconnected = useCallback((peerId: string) => {
    console.log('[LiveLesson] Peer disconnected:', peerId);
    setRemoteStreams(prev => prev.filter(s => s.peerId !== peerId));
  }, []);

  // Initialize WebRTC and data
  useEffect(() => {
    if (!lessonId || !user) return;

    const initializeLesson = async () => {
      setLoading(true);
      setConnecting(true);
      
      try {
        // Fetch existing participants FIRST (before we join)
        const { data: existingParticipants } = await supabase
          .from('live_lesson_participants')
          .select('*')
          .eq('lesson_id', lessonId)
          .is('left_at', null);

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

        // Update participants state
        const { data: participantsData } = await supabase
          .from('live_lesson_participants')
          .select('*')
          .eq('lesson_id', lessonId)
          .is('left_at', null);

        if (participantsData) setParticipants(participantsData);

        // Initialize WebRTC
        const manager = new WebRTCManager(
          lessonId,
          user.id,
          userName,
          handleRemoteStream,
          handlePeerDisconnected
        );
        
        webrtcManagerRef.current = manager;
        
        const stream = await manager.initialize();
        if (stream) {
          setLocalStream(stream);
          setMediaError(null);
          
          // Connect to ALL existing participants (those who were there before us)
          // This is critical - when student joins, they need to initiate connection to teacher
          if (existingParticipants && existingParticipants.length > 0) {
            console.log('[LiveLesson] Connecting to existing participants:', existingParticipants.length);
            for (const participant of existingParticipants) {
              if (participant.user_id !== user.id) {
                console.log('[LiveLesson] Initiating connection to:', participant.user_name);
                await manager.connectToPeer(participant.user_id, participant.user_name);
              }
            }
          }
        } else {
          setMediaError('Could not access camera/microphone. Please check permissions.');
        }
      } catch (error) {
        console.error('Error initializing lesson:', error);
        setMediaError('Failed to initialize video call');
      } finally {
        setLoading(false);
        setConnecting(false);
      }
    };

    initializeLesson();

    return () => {
      webrtcManagerRef.current?.cleanup();
    };
  }, [lessonId, user, userName, role, handleRemoteStream, handlePeerDisconnected]);

  // Set local video element
  useEffect(() => {
    if (localVideoRef.current && localStream) {
      localVideoRef.current.srcObject = localStream;
    }
  }, [localStream]);

  // Real-time subscriptions
  useEffect(() => {
    if (!lessonId || !user) return;

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
        async (payload) => {
          // Refetch participants
          const { data } = await supabase
            .from('live_lesson_participants')
            .select('*')
            .eq('lesson_id', lessonId)
            .is('left_at', null);
          
          if (data) {
            setParticipants(data);
            
            // Connect to new participants
            if (payload.eventType === 'INSERT' && webrtcManagerRef.current) {
              const newParticipant = payload.new as Participant;
              if (newParticipant.user_id !== user.id) {
                await webrtcManagerRef.current.connectToPeer(
                  newParticipant.user_id, 
                  newParticipant.user_name
                );
              }
            }
          }
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
  }, [lessonId, user, onEndLesson]);

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

  const handleToggleVideo = () => {
    const newState = !isVideoOn;
    setIsVideoOn(newState);
    webrtcManagerRef.current?.toggleVideo(newState);
  };

  const handleToggleMute = () => {
    const newState = !isMuted;
    setIsMuted(newState);
    webrtcManagerRef.current?.toggleAudio(!newState);
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
      setHandRaised(!newHandRaised);
    }
  };

  const handleEndLesson = async () => {
    if (!user) return;
    
    try {
      await webrtcManagerRef.current?.cleanup();
      
      if (role === 'teacher') {
        await supabase
          .from('live_lessons')
          .update({ status: 'ended', ended_at: new Date().toISOString() })
          .eq('id', lessonId);
        toast.success('Lesson ended');
      } else {
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
  const teacher = participants.find(p => p.role === 'teacher');
  const teacherStream = remoteStreams.find(s => s.peerId === teacher?.user_id);

  if (loading) {
    return (
      <div className="h-[calc(100vh-200px)] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Joining lesson...</p>
        </div>
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
          {connecting && (
            <Badge variant="outline" className="gap-1">
              <Loader2 className="w-3 h-3 animate-spin" />
              Connecting...
            </Badge>
          )}
          {raisedHands.length > 0 && role === 'teacher' && (
            <Badge variant="default" className="gap-1 bg-warning text-warning-foreground">
              <Hand className="w-3 h-3" />
              {raisedHands.length} hand{raisedHands.length > 1 ? 's' : ''} raised
            </Badge>
          )}
          <Badge variant="secondary" className="gap-1">
            <Users className="w-3 h-3" />
            {participants.length}
          </Badge>
        </div>
      </div>

      {/* Media Error Alert */}
      {mediaError && (
        <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-destructive" />
          <div>
            <p className="font-medium text-destructive">Camera/Microphone Error</p>
            <p className="text-sm text-muted-foreground">{mediaError}</p>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex gap-4">
        {/* Video Area */}
        <div className="flex-1 flex flex-col gap-4">
          {/* Main Video - Teacher's view or featured stream */}
          <Card className="flex-1 bg-foreground/5 relative overflow-hidden">
            <CardContent className="p-0 h-full">
              {role === 'student' && teacherStream ? (
                <VideoPlayer stream={teacherStream.stream} muted={false} className="w-full h-full object-cover" />
              ) : role === 'teacher' && localStream ? (
                <video
                  ref={localVideoRef}
                  autoPlay
                  playsInline
                  muted
                  className={cn(
                    "w-full h-full object-cover",
                    !isVideoOn && "hidden"
                  )}
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-24 h-24 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
                      <VideoOff className="w-12 h-12 text-primary" />
                    </div>
                    <p className="text-muted-foreground">
                      {mediaError ? 'Camera unavailable' : 'Waiting for video...'}
                    </p>
                  </div>
                </div>
              )}
              
              {/* Show camera off placeholder */}
              {!isVideoOn && role === 'teacher' && (
                <div className="absolute inset-0 bg-muted flex items-center justify-center">
                  <div className="text-center">
                    <VideoOff className="w-16 h-16 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-muted-foreground">Camera is off</p>
                  </div>
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

          {/* Participant Videos Grid */}
          {remoteStreams.length > 0 && (
            <div className="flex gap-2 overflow-x-auto pb-2">
              {/* Show local video as thumbnail for students */}
              {role === 'student' && localStream && (
                <div className="relative flex-shrink-0 w-32 h-24 rounded-lg overflow-hidden bg-muted">
                  <video
                    ref={localVideoRef}
                    autoPlay
                    playsInline
                    muted
                    className={cn("w-full h-full object-cover", !isVideoOn && "hidden")}
                  />
                  {!isVideoOn && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <VideoOff className="w-6 h-6 text-muted-foreground" />
                    </div>
                  )}
                  <div className="absolute bottom-1 left-1">
                    <Badge variant="secondary" className="text-xs">You</Badge>
                  </div>
                </div>
              )}
              
              {/* Remote streams (excluding teacher if student view) */}
              {remoteStreams
                .filter(s => role === 'teacher' || s.peerId !== teacher?.user_id)
                .map(({ peerId, peerName, stream }) => (
                  <div key={peerId} className="relative flex-shrink-0 w-32 h-24 rounded-lg overflow-hidden bg-muted">
                    <VideoPlayer stream={stream} muted={false} className="w-full h-full object-cover" />
                    <div className="absolute bottom-1 left-1">
                      <Badge variant="secondary" className="text-xs">{peerName}</Badge>
                    </div>
                  </div>
                ))}
            </div>
          )}

          {/* Controls */}
          <Card className="bg-card">
            <CardContent className="p-4">
              <div className="flex items-center justify-center gap-2">
                <Button
                  variant={isMuted ? "destructive" : "secondary"}
                  size="icon"
                  onClick={handleToggleMute}
                  className="h-12 w-12 rounded-full"
                  disabled={!localStream}
                >
                  {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                </Button>
                
                <Button
                  variant={isVideoOn ? "secondary" : "destructive"}
                  size="icon"
                  onClick={handleToggleVideo}
                  className="h-12 w-12 rounded-full"
                  disabled={!localStream}
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

// Video player component for remote streams
const VideoPlayer: React.FC<{ stream: MediaStream; muted: boolean; className?: string }> = ({ 
  stream, 
  muted, 
  className 
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  return (
    <video
      ref={videoRef}
      autoPlay
      playsInline
      muted={muted}
      className={className}
    />
  );
};

export default LiveLessonView;
