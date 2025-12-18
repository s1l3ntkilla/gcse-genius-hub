import React, { useState } from 'react';
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
  File
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { 
  sampleMessages, 
  sampleTeachers, 
  sampleStudents 
} from '@/data/sampleData';
import { useAuth } from '@/contexts/AuthContext';
import { Message, User } from '@/types';

const Messages: React.FC = () => {
  const { user, role } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedConversation, setSelectedConversation] = useState<string | null>('teacher-1');
  const [newMessage, setNewMessage] = useState('');
  const [messages, setMessages] = useState(sampleMessages);

  // Get conversation partners based on role
  const conversationPartners = role === 'student' ? sampleTeachers : sampleStudents;

  // Get messages for selected conversation
  const conversationMessages = messages.filter(m => 
    (m.senderId === selectedConversation && m.receiverId === user?.id) ||
    (m.senderId === user?.id && m.receiverId === selectedConversation)
  ).sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());

  const selectedPartner = conversationPartners.find(p => p.id === selectedConversation);

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedConversation) return;

    const newMsg: Message = {
      id: `msg-${Date.now()}`,
      senderId: user?.id || '',
      receiverId: selectedConversation,
      content: newMessage,
      timestamp: new Date(),
      read: false,
    };

    setMessages(prev => [...prev, newMsg]);
    setNewMessage('');
  };

  const getLastMessage = (partnerId: string) => {
    const partnerMessages = messages.filter(m => 
      (m.senderId === partnerId && m.receiverId === user?.id) ||
      (m.senderId === user?.id && m.receiverId === partnerId)
    );
    return partnerMessages.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())[0];
  };

  const getUnreadCount = (partnerId: string) => {
    return messages.filter(m => 
      m.senderId === partnerId && 
      m.receiverId === user?.id && 
      !m.read
    ).length;
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
            <div className="p-2 space-y-1">
              {conversationPartners
                .filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()))
                .map((partner) => {
                  const lastMessage = getLastMessage(partner.id);
                  const unreadCount = getUnreadCount(partner.id);
                  const isSelected = selectedConversation === partner.id;

                  return (
                    <button
                      key={partner.id}
                      onClick={() => setSelectedConversation(partner.id)}
                      className={cn(
                        "w-full p-3 rounded-xl text-left transition-colors",
                        isSelected 
                          ? "bg-primary/10 border border-primary/20" 
                          : "hover:bg-muted"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <Avatar className="w-10 h-10">
                          <AvatarFallback className="bg-primary/10 text-primary">
                            {partner.avatar}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <span className="font-medium text-sm truncate">
                              {partner.name}
                            </span>
                            {unreadCount > 0 && (
                              <span className="w-5 h-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">
                                {unreadCount}
                              </span>
                            )}
                          </div>
                          {lastMessage && (
                            <p className="text-xs text-muted-foreground truncate mt-0.5">
                              {lastMessage.content}
                            </p>
                          )}
                        </div>
                      </div>
                    </button>
                  );
                })}
            </div>
          </ScrollArea>
        </Card>

        {/* Chat Area */}
        <Card className="card-elevated flex-1 flex flex-col">
          {selectedPartner ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b border-border flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="w-10 h-10">
                    <AvatarFallback className="bg-primary/10 text-primary">
                      {selectedPartner.avatar}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-medium">{selectedPartner.name}</h3>
                    <p className="text-xs text-success flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-success" />
                      Online
                    </p>
                  </div>
                </div>
                <Button variant="ghost" size="icon">
                  <MoreVertical className="w-5 h-5" />
                </Button>
              </div>

              {/* Messages */}
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                  {conversationMessages.map((message) => {
                    const isOwn = message.senderId === user?.id;
                    
                    return (
                      <div
                        key={message.id}
                        className={cn(
                          "flex",
                          isOwn ? "justify-end" : "justify-start"
                        )}
                      >
                        <div
                          className={cn(
                            "max-w-[70%] rounded-2xl px-4 py-3",
                            isOwn 
                              ? "bg-primary text-primary-foreground rounded-br-sm" 
                              : "bg-muted rounded-bl-sm"
                          )}
                        >
                          <p className="text-sm">{message.content}</p>
                          <div className={cn(
                            "flex items-center gap-1 mt-1",
                            isOwn ? "justify-end" : "justify-start"
                          )}>
                            <span className={cn(
                              "text-xs",
                              isOwn ? "text-primary-foreground/70" : "text-muted-foreground"
                            )}>
                              {message.timestamp.toLocaleTimeString([], { 
                                hour: '2-digit', 
                                minute: '2-digit' 
                              })}
                            </span>
                            {isOwn && (
                              message.read 
                                ? <CheckCheck className="w-4 h-4 text-primary-foreground/70" />
                                : <Check className="w-4 h-4 text-primary-foreground/70" />
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </ScrollArea>

              {/* Input Area */}
              <div className="p-4 border-t border-border">
                <div className="flex items-center gap-3">
                  <Button variant="ghost" size="icon">
                    <Paperclip className="w-5 h-5" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <Image className="w-5 h-5" />
                  </Button>
                  <Input
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="Type a message..."
                    className="flex-1"
                  />
                  <Button 
                    onClick={handleSendMessage}
                    disabled={!newMessage.trim()}
                    className="bg-primary hover:bg-primary-dark"
                  >
                    <Send className="w-5 h-5" />
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-muted-foreground">
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                  <Send className="w-8 h-8 opacity-50" />
                </div>
                <h3 className="font-medium">Select a conversation</h3>
                <p className="text-sm mt-1">Choose a contact to start messaging</p>
              </div>
            </div>
          )}
        </Card>
      </div>
    </MainLayout>
  );
};

export default Messages;
