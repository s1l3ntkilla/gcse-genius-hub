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
  File,
  MessageSquare,
  Users
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';

const Messages: React.FC = () => {
  const { user, role } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState('');

  // Empty state - no mock data
  const conversationPartners: any[] = [];
  const conversationMessages: any[] = [];

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedConversation) return;
    // Would send message to backend
    setNewMessage('');
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
              {conversationPartners.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Users className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p className="text-sm">No conversations yet</p>
                  <p className="text-xs mt-1">
                    {role === 'student' 
                      ? 'Messages from teachers will appear here'
                      : 'Messages from students will appear here'}
                  </p>
                </div>
              ) : (
                <div className="space-y-1">
                  {conversationPartners.map((partner: any) => (
                    <button
                      key={partner.id}
                      onClick={() => setSelectedConversation(partner.id)}
                      className={cn(
                        "w-full p-3 rounded-xl text-left transition-colors",
                        selectedConversation === partner.id 
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
                          <span className="font-medium text-sm truncate block">
                            {partner.name}
                          </span>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </ScrollArea>
        </Card>

        {/* Chat Area */}
        <Card className="card-elevated flex-1 flex flex-col">
          <div className="flex-1 flex items-center justify-center text-muted-foreground">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                <MessageSquare className="w-8 h-8 opacity-50" />
              </div>
              <h3 className="font-medium">No conversations</h3>
              <p className="text-sm mt-1">
                {role === 'student' 
                  ? 'Your teachers will message you here'
                  : 'Select a student to start messaging'}
              </p>
            </div>
          </div>
        </Card>
      </div>
    </MainLayout>
  );
};

export default Messages;
