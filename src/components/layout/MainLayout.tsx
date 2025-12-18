import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { AppSidebar } from './AppSidebar';
import { TopBar } from './TopBar';
import { AIAssistantWidget } from '../features/AIAssistantWidget';

interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      {/* Skip link for keyboard accessibility */}
      <a 
        href="#main-content" 
        className="skip-link"
      >
        Skip to main content
      </a>

      <AppSidebar 
        collapsed={sidebarCollapsed} 
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} 
      />
      
      <div className={cn(
        "transition-all duration-300 ease-in-out",
        sidebarCollapsed ? "ml-16" : "ml-64"
      )}>
        <TopBar />
        <main id="main-content" className="p-6" role="main" aria-label="Main content">
          {children}
        </main>
      </div>

      {/* AI Assistant Widget */}
      <AIAssistantWidget />
    </div>
  );
};