import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, BookOpen, MessageSquare, Hand, Video, Bot, Settings, ChevronLeft, ChevronRight, Users, FileText, BarChart3, LogOut, Palette, ArrowRightLeft, Lock } from 'lucide-react';
import notedlyLogo from '@/assets/notedly-logo.png';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { UserRole } from '@/types';

const SIDEBAR_COLORS = [
  { name: 'Default', value: 'hsl(var(--sidebar-background))' },
  { name: 'Slate', value: 'hsl(215, 28%, 17%)' },
  { name: 'Navy', value: 'hsl(224, 50%, 17%)' },
  { name: 'Forest', value: 'hsl(150, 30%, 15%)' },
  { name: 'Wine', value: 'hsl(340, 30%, 18%)' },
  { name: 'Purple', value: 'hsl(270, 30%, 18%)' },
  { name: 'Charcoal', value: 'hsl(0, 0%, 12%)' },
  { name: 'Ocean', value: 'hsl(200, 40%, 16%)' },
];
// Role Display Component (shows current mode based on profile)
const RoleDisplay: React.FC<{
  collapsed: boolean;
  role: UserRole;
  accountType: UserRole;
  isTeacherAccount: boolean;
  onSwitchMode: (mode: UserRole) => void;
}> = ({ collapsed, role, accountType, isTeacherAccount, onSwitchMode }) => {
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleSwitchMode = (newMode: UserRole) => {
    onSwitchMode(newMode);
    setDialogOpen(false);
  };

  return (
    <div className="px-3 py-2 border-t border-sidebar-border">
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogTrigger asChild>
          <button
            className={cn(
              "w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200",
              "bg-sidebar-accent/50 text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-foreground",
              "cursor-pointer"
            )}
          >
            <div className={cn("w-2 h-2 rounded-full", role === 'student' ? "bg-success" : "bg-warning")} />
            {!collapsed && (
              <span className="text-xs font-medium flex-1 text-left">
                {role === 'student' ? 'Student Mode' : 'Teacher Mode'}
              </span>
            )}
            {!collapsed && (
              <ArrowRightLeft className="w-3 h-3 opacity-60" />
            )}
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
                : "Your account type determines which features you can access."
              }
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-3 pt-4">
            {isTeacherAccount ? (
              <>
                {/* Teacher can switch modes */}
                <button
                  onClick={() => handleSwitchMode('teacher')}
                  className={cn(
                    "w-full flex items-center gap-4 p-4 rounded-lg border-2 transition-all",
                    role === 'teacher' 
                      ? "border-warning bg-warning/10" 
                      : "border-border hover:border-warning/50 hover:bg-muted"
                  )}
                >
                  <div className={cn("w-3 h-3 rounded-full bg-warning", role === 'teacher' && "ring-4 ring-warning/30")} />
                  <div className="flex-1 text-left">
                    <p className="font-medium">Teacher Mode</p>
                    <p className="text-sm text-muted-foreground">Access all teacher features, manage classes, and view analytics</p>
                  </div>
                  {role === 'teacher' && (
                    <span className="text-xs font-medium text-warning bg-warning/20 px-2 py-1 rounded">Active</span>
                  )}
                </button>
                
                <button
                  onClick={() => handleSwitchMode('student')}
                  className={cn(
                    "w-full flex items-center gap-4 p-4 rounded-lg border-2 transition-all",
                    role === 'student' 
                      ? "border-success bg-success/10" 
                      : "border-border hover:border-success/50 hover:bg-muted"
                  )}
                >
                  <div className={cn("w-3 h-3 rounded-full bg-success", role === 'student' && "ring-4 ring-success/30")} />
                  <div className="flex-1 text-left">
                    <p className="font-medium">Student Mode</p>
                    <p className="text-sm text-muted-foreground">Preview the student experience and revision tools</p>
                  </div>
                  {role === 'student' && (
                    <span className="text-xs font-medium text-success bg-success/20 px-2 py-1 rounded">Active</span>
                  )}
                </button>
              </>
            ) : (
              <>
                {/* Student account - can't switch */}
                <div className="flex items-center gap-4 p-4 rounded-lg border-2 border-success bg-success/10">
                  <div className="w-3 h-3 rounded-full bg-success ring-4 ring-success/30" />
                  <div className="flex-1">
                    <p className="font-medium">Student Account</p>
                    <p className="text-sm text-muted-foreground">You're logged in as a student</p>
                  </div>
                  <span className="text-xs font-medium text-success bg-success/20 px-2 py-1 rounded">Active</span>
                </div>
                
                <div className="flex items-center gap-4 p-4 rounded-lg border-2 border-dashed border-muted-foreground/30 bg-muted/30">
                  <Lock className="w-5 h-5 text-muted-foreground" />
                  <div className="flex-1">
                    <p className="font-medium text-muted-foreground">Teacher Mode</p>
                    <p className="text-sm text-muted-foreground">You need a teacher account to access teacher features. Contact your administrator if you believe this is an error.</p>
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
const studentNavItems = [{
  icon: LayoutDashboard,
  label: 'Dashboard',
  path: '/'
}, {
  icon: BookOpen,
  label: 'Revision Hub',
  path: '/revision'
}, {
  icon: MessageSquare,
  label: 'Messages',
  path: '/messages'
}, {
  icon: Hand,
  label: 'Classroom Q&A',
  path: '/qa'
}, {
  icon: Video,
  label: 'Lessons',
  path: '/lessons'
}, {
  icon: FileText,
  label: 'Assignments',
  path: '/assignments'
}];
const teacherNavItems = [{
  icon: LayoutDashboard,
  label: 'Dashboard',
  path: '/'
}, {
  icon: Users,
  label: 'My Classes',
  path: '/classes'
}, {
  icon: MessageSquare,
  label: 'Messages',
  path: '/messages'
}, {
  icon: Hand,
  label: 'Student Questions',
  path: '/qa'
}, {
  icon: Video,
  label: 'Lessons',
  path: '/lessons'
}, {
  icon: FileText,
  label: 'Assignments',
  path: '/assignments'
}, {
  icon: BarChart3,
  label: 'Analytics',
  path: '/analytics'
}];
export const AppSidebar: React.FC<SidebarProps> = ({
  collapsed,
  onToggle
}) => {
  const location = useLocation();
  const { user, role, accountType, isTeacherAccount, switchViewingMode, logout } = useAuth();
  const navItems = role === 'student' ? studentNavItems : teacherNavItems;
  
  // Sidebar color customization
  const [sidebarColor, setSidebarColor] = useState(() => {
    return localStorage.getItem('sidebar-color') || SIDEBAR_COLORS[0].value;
  });
  const [colorPickerOpen, setColorPickerOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('sidebar-color', sidebarColor);
  }, [sidebarColor]);

  return <aside 
    className={cn("fixed left-0 top-0 z-40 h-screen transition-all duration-300 ease-in-out flex flex-col", collapsed ? "w-16" : "w-64")}
    style={{ backgroundColor: sidebarColor }}
  >
      {/* Logo Section */}
      <div className="flex items-center justify-between h-16 px-4 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <img 
            src={notedlyLogo} 
            alt="Notedly" 
            className={cn("h-8 object-contain", collapsed ? "w-8" : "w-auto max-w-[140px]")}
          />
        </div>
        {!collapsed && (
          <Popover open={colorPickerOpen} onOpenChange={setColorPickerOpen}>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent">
                <Palette className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent side="right" align="start" className="w-48 p-3">
              <div className="space-y-2">
                <p className="text-sm font-medium">Sidebar Color</p>
                <div className="grid grid-cols-4 gap-2">
                  {SIDEBAR_COLORS.map((color) => (
                    <button
                      key={color.name}
                      onClick={() => {
                        setSidebarColor(color.value);
                        setColorPickerOpen(false);
                      }}
                      className={cn(
                        "w-8 h-8 rounded-md border-2 transition-all hover:scale-110",
                        sidebarColor === color.value ? "border-primary ring-2 ring-primary/30" : "border-transparent"
                      )}
                      style={{ backgroundColor: color.value }}
                      title={color.name}
                    />
                  ))}
                </div>
              </div>
            </PopoverContent>
          </Popover>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto scrollbar-thin">
        {navItems.map(item => {
        const isActive = location.pathname === item.path;
        const NavIcon = item.icon;
        const navLink = <Link key={item.path} to={item.path} className={cn("flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group", isActive ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-md" : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground")}>
              <NavIcon className={cn("w-5 h-5 flex-shrink-0 transition-transform duration-200", !isActive && "group-hover:scale-110")} />
              {!collapsed && <span className="font-medium text-sm text-primary-light">{item.label}</span>}
            </Link>;
        if (collapsed) {
          return <Tooltip key={item.path} delayDuration={0}>
                <TooltipTrigger asChild>{navLink}</TooltipTrigger>
                <TooltipContent side="right" className="ml-2">
                  {item.label}
                </TooltipContent>
              </Tooltip>;
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
      <div className="p-3 border-t border-sidebar-border">
        <div className={cn("flex items-center gap-3", collapsed && "justify-center")}>
          <Avatar className="w-9 h-9 border-2 border-sidebar-primary/30">
            <AvatarFallback className="bg-sidebar-accent text-sidebar-foreground text-sm font-medium">
              {user?.avatar || 'U'}
            </AvatarFallback>
          </Avatar>
          {!collapsed && <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-sidebar-foreground truncate">
                {user?.name}
              </p>
              <p className="text-xs text-sidebar-foreground/60 truncate">
                {user?.email}
              </p>
            </div>}
        </div>
      </div>

      {/* Collapse Toggle */}
      <Button variant="ghost" size="icon" onClick={onToggle} className="absolute -right-3 top-20 w-6 h-6 rounded-full bg-card border border-border shadow-md hover:bg-muted">
        {collapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronLeft className="w-3 h-3" />}
      </Button>
    </aside>;
};