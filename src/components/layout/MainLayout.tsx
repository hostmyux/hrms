
import React from 'react';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { useVoice } from '../../contexts/VoiceContext';

interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const { speak } = useVoice();

  // Speak when layout mounts to provide location context
  React.useEffect(() => {
    speak("Main dashboard loaded. Navigate using the sidebar menu for different HR modules.");
  }, [speak]);

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex flex-col flex-1">
        <Topbar />
        <main className="flex-1 p-6 overflow-auto animate-fade-in">
          {children}
        </main>
      </div>
    </div>
  );
};
