import React, { useState } from 'react';
import { Bell, Search, Hand, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/contexts/AuthContext';
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext';
import { cn } from '@/lib/utils';
import { QuickQuestionModal } from '../features/QuickQuestionModal';
import { useNavigate } from 'react-router-dom';

// Empty notifications - will be populated from database later
const notifications: { id: string; title: string; content: string; read: boolean }[] = [];

export const TopBar: React.FC = () => {
  const { role } = useAuth();
  const { signOut, profile } = useSupabaseAuth();
  const navigate = useNavigate();
  const [showQuestionModal, setShowQuestionModal] = useState(false);

  const handleLogout = async () => {
    await signOut();
    navigate('/auth');
  };
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <>
      <header className="sticky top-0 z-30 h-16 bg-card/80 backdrop-blur-md border-b border-border flex items-center justify-between px-6">
        {/* Search Bar */}
        <div className="relative w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search lessons, topics, messages..."
            className="pl-10 bg-muted/50 border-0 focus-visible:ring-1 focus-visible:ring-primary"
          />
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          {/* Quick Question Button (Student only) */}
          {role === 'student' && (
            <Button
              variant="default"
              size="sm"
              className="gap-2 bg-primary hover:bg-primary-dark btn-glow"
              onClick={() => setShowQuestionModal(true)}
            >
              <Hand className="w-4 h-4" />
              <span className="hidden sm:inline">Raise Hand</span>
            </Button>
          )}

          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <Badge 
                    className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs bg-destructive"
                  >
                    {unreadCount}
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <DropdownMenuLabel className="flex items-center justify-between">
                Notifications
                <span className="text-xs text-muted-foreground font-normal">
                  {unreadCount} unread
                </span>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              {notifications.length > 0 ? notifications.slice(0, 5).map((notification) => (
                <DropdownMenuItem 
                  key={notification.id}
                  className={cn(
                    "flex flex-col items-start gap-1 cursor-pointer",
                    !notification.read && "bg-primary/5"
                  )}
                >
                  <div className="flex items-center gap-2 w-full">
                    {!notification.read && (
                      <div className="w-2 h-2 rounded-full bg-primary" />
                    )}
                    <span className="font-medium text-sm truncate">
                      {notification.title}
                    </span>
                  </div>
                  <span className="text-xs text-muted-foreground pl-4">
                    {notification.content}
                  </span>
                </DropdownMenuItem>
              )) : (
                <DropdownMenuItem className="text-center text-muted-foreground text-sm py-4">
                  No notifications yet
                </DropdownMenuItem>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-center text-primary text-sm">
                View all notifications
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* User & Logout */}
          <div className="flex items-center gap-2 pl-2 border-l border-border">
            {profile && (
              <span className="text-sm text-muted-foreground hidden sm:inline">
                {profile.full_name || profile.email}
              </span>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={handleLogout}
              title="Log out"
            >
              <LogOut className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </header>

      <QuickQuestionModal 
        open={showQuestionModal} 
        onOpenChange={setShowQuestionModal} 
      />
    </>
  );
};
