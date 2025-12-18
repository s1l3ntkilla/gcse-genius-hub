import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
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
  Maximize2,
  Send
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface LiveLessonViewProps {
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
  sender: string;
  message: string;
  timestamp: Date;
}

const LiveLessonView: React.FC<LiveLessonViewProps> = ({
  lessonData,
  onEndLesson,
  role
}) => {
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [showChat, setShowChat] = useState(true);
  const [handRaised, setHandRaised] = useState(false);
  const [chatMessage, setChatMessage] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: '1', sender: 'System', message: 'Live lesson has started', timestamp: new Date() }
  ]);
  const [participants] = useState([
    { id: '1', name: 'Teacher', isTeacher: true },
    { id: '2', name: 'Student 1', isTeacher: false },
    { id: '3', name: 'Student 2', isTeacher: false },
  ]);

  const handleSendMessage = () => {
    if (!chatMessage.trim()) return;
    
    setMessages(prev => [...prev, {
      id: Date.now().toString(),
      sender: role === 'teacher' ? 'Teacher' : 'You',
      message: chatMessage,
      timestamp: new Date()
    }]);
    setChatMessage('');
  };

  return (
    <div className="h-[calc(100vh-200px)] flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold flex items-center gap-2">
            <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
            {lessonData.title}
          </h2>
          <p className="text-sm text-muted-foreground">
            {lessonData.classroomName} • Live Now
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="gap-1">
            <Users className="w-3 h-3" />
            {participants.length} participants
          </Badge>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex gap-4">
        {/* Video Area */}
        <div className="flex-1 flex flex-col gap-4">
          {/* Main Video */}
          <Card className="flex-1 bg-gray-900 relative overflow-hidden">
            <CardContent className="p-0 h-full flex items-center justify-center">
              {isVideoOn ? (
                <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-24 h-24 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
                      <Video className="w-12 h-12 text-primary" />
                    </div>
                    <p className="text-white text-lg font-medium">
                      {role === 'teacher' ? 'Your Camera' : 'Teacher\'s Camera'}
                    </p>
                    <p className="text-gray-400 text-sm">Camera preview would appear here</p>
                  </div>
                </div>
              ) : (
                <div className="text-center text-gray-400">
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
                    onClick={() => setHandRaised(!handRaised)}
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
                  onClick={onEndLesson}
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
            </div>
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-3">
                {messages.map((msg) => (
                  <div key={msg.id} className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">{msg.sender}</span>
                      <span className="text-xs text-muted-foreground">
                        {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">{msg.message}</p>
                  </div>
                ))}
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
                <Button size="icon" onClick={handleSendMessage}>
                  <Send className="w-4 h-4" />
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
