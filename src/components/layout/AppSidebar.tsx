import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, BookOpen, MessageSquare, Hand, Video, ChevronLeft, ChevronRight, Users, FileText, BarChart3, ArrowRightLeft, Lock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { UserRole } from '@/types';

// Role Display Component
const RoleDisplay: React.FC<{
  collapsed: boolean;
  role: UserRole;
  accountType: UserRole;
  isTeacherAccount: boolean;
  onSwitchMode: (mode: UserRole) => void;
}> = ({
  collapsed,
  role,
  accountType,
  isTeacherAccount,
  onSwitchMode
}) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const handleSwitchMode = (newMode: UserRole) => {
    onSwitchMode(newMode);
    setDialogOpen(false);
  };
  
  return (
    <div className="px-4 py-3 border-t border-sidebar-border">
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogTrigger asChild>
          <button className={cn(
            "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200",
            "bg-sidebar-accent/50 text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-foreground",
            "cursor-pointer"
          )}>
            <div className={cn(
              "w-2.5 h-2.5 rounded-full",
              role === 'student' ? "bg-success" : "bg-warning"
            )} />
            {!collapsed && (
              <span className="text-sm font-medium flex-1 text-left">
                {role === 'student' ? 'Student Mode' : 'Teacher Mode'}
              </span>
            )}
            {!collapsed && <ArrowRightLeft className="w-4 h-4 opacity-60" />}
          </button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {isTeacherAccount ? (
                <>
                  <ArrowRightLeft className="w-5 h-5" />
                  Switch Viewing Mode
                </>
              ) : (
                <>
                  <Lock className="w-5 h-5" />
                  Account Type
                </>
              )}
            </DialogTitle>
            <DialogDescription>
              {isTeacherAccount 
                ? "As a teacher, you can switch between viewing modes to preview what students see." 
                : "Your account type determines which features you can access."}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-3 pt-4">
            {isTeacherAccount ? (
              <>
                <button 
                  onClick={() => handleSwitchMode('teacher')} 
                  className={cn(
                    "w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all",
                    role === 'teacher' 
                      ? "border-warning bg-warning/10" 
                      : "border-border hover:border-warning/50 hover:bg-muted"
                  )}
                >
                  <div className={cn(
                    "w-3 h-3 rounded-full bg-warning",
                    role === 'teacher' && "ring-4 ring-warning/30"
                  )} />
                  <div className="flex-1 text-left">
                    <p className="font-medium">Teacher Mode</p>
                    <p className="text-sm text-muted-foreground">Access all teacher features, manage classes, and view analytics</p>
                  </div>
                  {role === 'teacher' && (
                    <span className="text-xs font-medium text-warning bg-warning/20 px-2 py-1 rounded-lg">Active</span>
                  )}
                </button>
                
                <button 
                  onClick={() => handleSwitchMode('student')} 
                  className={cn(
                    "w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all",
                    role === 'student' 
                      ? "border-success bg-success/10" 
                      : "border-border hover:border-success/50 hover:bg-muted"
                  )}
                >
                  <div className={cn(
                    "w-3 h-3 rounded-full bg-success",
                    role === 'student' && "ring-4 ring-success/30"
                  )} />
                  <div className="flex-1 text-left">
                    <p className="font-medium">Student Mode</p>
                    <p className="text-sm text-muted-foreground">Preview the student experience and revision tools</p>
                  </div>
                  {role === 'student' && (
                    <span className="text-xs font-medium text-success bg-success/20 px-2 py-1 rounded-lg">Active</span>
                  )}
                </button>
              </>
            ) : (
              <>
                <div className="flex items-center gap-4 p-4 rounded-xl border-2 border-success bg-success/10">
                  <div className="w-3 h-3 rounded-full bg-success ring-4 ring-success/30" />
                  <div className="flex-1">
                    <p className="font-medium">Student Account</p>
                    <p className="text-sm text-muted-foreground">You're logged in as a student</p>
                  </div>
                  <span className="text-xs font-medium text-success bg-success/20 px-2 py-1 rounded-lg">Active</span>
                </div>
                
                <div className="flex items-center gap-4 p-4 rounded-xl border-2 border-dashed border-muted-foreground/30 bg-muted/30">
                  <Lock className="w-5 h-5 text-muted-foreground" />
                  <div className="flex-1">
                    <p className="font-medium text-muted-foreground">Teacher Mode</p>
                    <p className="text-sm text-muted-foreground">You need a teacher account to access teacher features.</p>
                  </div>
                </div>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

// Subject colors for navigation items
const subjectColors: Record<string, string> = {
  'Dashboard': 'bg-primary',
  'Revision Hub': 'bg-success',
  'Messages': 'bg-warning',
  'Classroom': 'bg-destructive',
  'Lessons': 'bg-purple-500',
  'Assignments': 'bg-cyan-500',
  'My Classes': 'bg-success',
  'Student Questions': 'bg-destructive',
  'Analytics': 'bg-purple-500',
};

const studentNavItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
  { icon: BookOpen, label: 'Revision Hub', path: '/revision' },
  { icon: MessageSquare, label: 'Messages', path: '/messages' },
  { icon: Hand, label: 'Classroom', path: '/qa' },
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
  const { user, role, accountType, isTeacherAccount, switchViewingMode } = useAuth();
  const navItems = role === 'student' ? studentNavItems : teacherNavItems;

  return (
    <aside className={cn(
      "fixed left-0 top-0 z-40 h-screen transition-all duration-300 ease-in-out flex flex-col bg-sidebar border-r border-sidebar-border",
      collapsed ? "w-20" : "w-72"
    )}>
      {/* Logo Section */}
      <div className="flex items-center h-20 px-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-lg">
            <span className="text-white font-bold text-xl">N</span>
          </div>
          {!collapsed && (
            <span className="font-display text-2xl font-bold text-foreground tracking-tight">
              NOTELY
            </span>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto scrollbar-thin">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const NavIcon = item.icon;
          const indicatorColor = subjectColors[item.label] || 'bg-primary';
          
          const navLink = (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 group relative",
                isActive 
                  ? "bg-primary/10 text-primary" 
                  : "text-muted-foreground hover:bg-accent hover:text-foreground"
              )}
            >
              {/* Colored indicator bar */}
              <div className={cn(
                "absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 rounded-r-full transition-all duration-200",
                isActive ? indicatorColor : "bg-transparent group-hover:bg-muted-foreground/30"
              )} />
              
              <NavIcon className={cn(
                "w-5 h-5 flex-shrink-0 transition-transform duration-200",
                !isActive && "group-hover:scale-110"
              )} />
              
              {!collapsed && (
                <span className="font-medium text-[15px]">{item.label}</span>
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
      <RoleDisplay 
        collapsed={collapsed} 
        role={role} 
        accountType={accountType} 
        isTeacherAccount={isTeacherAccount} 
        onSwitchMode={switchViewingMode} 
      />

      {/* User Profile */}
      <div className="p-4 border-t border-sidebar-border">
        <div className={cn("flex items-center gap-3", collapsed && "justify-center")}>
          <Avatar className="w-10 h-10 border-2 border-primary/20">
            <AvatarFallback className="bg-primary/10 text-primary font-semibold">
              {user?.avatar || 'U'}
            </AvatarFallback>
          </Avatar>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-foreground truncate">
                {user?.name}
              </p>
              <p className="text-xs text-muted-foreground truncate">
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
        className="absolute -right-4 top-24 w-8 h-8 rounded-full bg-card border border-border shadow-md hover:bg-accent"
      >
        {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
      </Button>
    </aside>
  );
};