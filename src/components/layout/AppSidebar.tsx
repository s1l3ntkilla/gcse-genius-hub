import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  BookOpen, 
  MessageSquare, 
  Hand, 
  Video, 
  Bot, 
  Settings,
  ChevronLeft,
  ChevronRight,
  GraduationCap,
  Users,
  FileText,
  BarChart3,
  LogOut,
  ShieldAlert,
  X
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

// Role Switcher Component
const RoleSwitcher: React.FC<{ 
  collapsed: boolean; 
  role: string; 
  switchRole: () => void;
}> = ({ collapsed, role, switchRole }) => {
  const { profile } = useSupabaseAuth();
  const [open, setOpen] = useState(false);
  
  const isTeacher = profile?.user_type === 'teacher';
  
  const handleSwitchRole = () => {
    if (isTeacher) {
      switchRole();
      setOpen(false);
    }
  };

  return (
    <div className="px-3 py-2 border-t border-sidebar-border">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button
            className={cn(
              "w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors",
              "bg-sidebar-accent/50 hover:bg-sidebar-accent text-sidebar-foreground/80 hover:text-sidebar-foreground"
            )}
          >
            <div className={cn(
              "w-2 h-2 rounded-full",
              role === 'student' ? "bg-success" : "bg-warning"
            )} />
            {!collapsed && (
              <span className="text-xs font-medium">
                {role === 'student' ? 'Student Mode' : 'Teacher Mode'}
              </span>
            )}
          </button>
        </PopoverTrigger>
        <PopoverContent side="top" align="start" className="w-64 p-3">
          {isTeacher ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Switch Mode</span>
                <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setOpen(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                You're registered as a teacher. You can switch between modes.
              </p>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant={role === 'student' ? 'default' : 'outline'}
                  className="flex-1"
                  onClick={() => { if (role !== 'student') handleSwitchRole(); setOpen(false); }}
                >
                  Student View
                </Button>
                <Button
                  size="sm"
                  variant={role === 'teacher' ? 'default' : 'outline'}
                  className="flex-1"
                  onClick={() => { if (role !== 'teacher') handleSwitchRole(); setOpen(false); }}
                >
                  Teacher View
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-warning">
                <ShieldAlert className="h-5 w-5" />
                <span className="text-sm font-medium">Access Restricted</span>
              </div>
              <p className="text-xs text-muted-foreground">
                Teacher mode is only available for accounts registered as teachers. 
                Please sign up with a teacher account to access teacher features.
              </p>
              <Button variant="outline" size="sm" className="w-full" onClick={() => setOpen(false)}>
                Close
              </Button>
            </div>
          )}
        </PopoverContent>
      </Popover>
    </div>
  );
};

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

const studentNavItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
  { icon: BookOpen, label: 'Revision Hub', path: '/revision' },
  { icon: MessageSquare, label: 'Messages', path: '/messages' },
  { icon: Hand, label: 'Classroom Q&A', path: '/qa' },
  { icon: Video, label: 'Lessons', path: '/lessons' },
  { icon: FileText, label: 'Assignments', path: '/assignments' },
];

const teacherNavItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
  { icon: Users, label: 'My Classes', path: '/classes' },
  { icon: MessageSquare, label: 'Messages', path: '/messages' },
  { icon: Hand, label: 'Student Questions', path: '/qa' },
  { icon: Video, label: 'Lessons', path: '/lessons' },
  { icon: FileText, label: 'Assignments', path: '/assignments' },
  { icon: BarChart3, label: 'Analytics', path: '/analytics' },
];

export const AppSidebar: React.FC<SidebarProps> = ({ collapsed, onToggle }) => {
  const location = useLocation();
  const { user, role, switchRole, logout } = useAuth();

  const navItems = role === 'student' ? studentNavItems : teacherNavItems;

  return (
    <aside 
      className={cn(
        "fixed left-0 top-0 z-40 h-screen bg-sidebar transition-all duration-300 ease-in-out flex flex-col",
        collapsed ? "w-16" : "w-64"
      )}
    >
      {/* Logo Section */}
      <div className="flex items-center h-16 px-4 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center">
            <GraduationCap className="w-5 h-5 text-primary-foreground" />
          </div>
          {!collapsed && (
            <span className="font-display font-bold text-lg text-sidebar-foreground">
              LearnAI
            </span>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto scrollbar-thin">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const NavIcon = item.icon;

          const navLink = (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group",
                isActive 
                  ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-md" 
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground"
              )}
            >
              <NavIcon className={cn(
                "w-5 h-5 flex-shrink-0 transition-transform duration-200",
                !isActive && "group-hover:scale-110"
              )} />
              {!collapsed && (
                <span className="font-medium text-sm">{item.label}</span>
              )}
            </Link>
          );

          if (collapsed) {
            return (
              <Tooltip key={item.path} delayDuration={0}>
                <TooltipTrigger asChild>{navLink}</TooltipTrigger>
                <TooltipContent side="right" className="ml-2">
                  {item.label}
                </TooltipContent>
              </Tooltip>
            );
          }

          return navLink;
        })}
      </nav>

      {/* Role Switcher */}
      <RoleSwitcher collapsed={collapsed} role={role} switchRole={switchRole} />

      {/* User Profile */}
      <div className="p-3 border-t border-sidebar-border">
        <div className={cn(
          "flex items-center gap-3",
          collapsed && "justify-center"
        )}>
          <Avatar className="w-9 h-9 border-2 border-sidebar-primary/30">
            <AvatarFallback className="bg-sidebar-accent text-sidebar-foreground text-sm font-medium">
              {user?.avatar || 'U'}
            </AvatarFallback>
          </Avatar>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-sidebar-foreground truncate">
                {user?.name}
              </p>
              <p className="text-xs text-sidebar-foreground/60 truncate">
                {user?.email}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Collapse Toggle */}
      <Button
        variant="ghost"
        size="icon"
        onClick={onToggle}
        className="absolute -right-3 top-20 w-6 h-6 rounded-full bg-card border border-border shadow-md hover:bg-muted"
      >
        {collapsed ? (
          <ChevronRight className="w-3 h-3" />
        ) : (
          <ChevronLeft className="w-3 h-3" />
        )}
      </Button>
    </aside>
  );
};
