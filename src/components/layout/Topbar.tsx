
import React from 'react';
import { Bell, Search, User } from 'lucide-react';
import { useVoice } from '../../contexts/VoiceContext';

export const Topbar: React.FC = () => {
  const { speak } = useVoice();

  return (
    <header className="flex items-center h-16 px-6 border-b border-border bg-card">
      <div className="flex-1">
        <SearchBar />
      </div>
      <div className="flex items-center gap-4">
        <button 
          className="p-2 rounded-full hover:bg-accent"
          onClick={() => speak("Notifications panel. Here you can view all your HR related notifications.")}
        >
          <Bell size={20} />
          <span className="absolute top-3 right-3 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>
        <div className="h-8 w-px bg-border"></div>
        <UserMenu />
      </div>
    </header>
  );
};

const SearchBar: React.FC = () => {
  const { speak } = useVoice();
  return (
    <div 
      className="relative max-w-md"
      onClick={() => speak("Search across the entire HRMS system. Type employee names, departments, or any HR related queries.")}
    >
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
      <input
        type="text"
        placeholder="Search..."
        className="pl-10 pr-4 py-2 w-full bg-accent/50 text-foreground rounded-md border border-transparent focus:border-ring focus:outline-none"
      />
    </div>
  );
};

const UserMenu: React.FC = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const { speak } = useVoice();
  const menuRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      speak("User menu opened. Access your profile, settings, or log out.");
    }
  };

  return (
    <div className="relative" ref={menuRef}>
      <button 
        className="flex items-center gap-2 hover:bg-accent p-1 rounded-md"
        onClick={toggleMenu}
      >
        <div className="w-8 h-8 rounded-full bg-hrms-primary/20 flex items-center justify-center text-hrms-primary">
          <User size={18} />
        </div>
        <span className="text-sm font-medium">Admin</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-1 w-48 rounded-md bg-card border border-border shadow-lg animate-scale-in z-10">
          <div className="py-1">
            <a 
              href="#" 
              className="block px-4 py-2 text-sm hover:bg-accent"
              onClick={() => speak("View or edit your profile")}
            >
              Your Profile
            </a>
            <a 
              href="#" 
              className="block px-4 py-2 text-sm hover:bg-accent"
              onClick={() => speak("Adjust your account settings")}
            >
              Settings
            </a>
            <a 
              href="#" 
              className="block px-4 py-2 text-sm hover:bg-accent"
              onClick={() => speak("Signing out of HRMS Nexus")}
            >
              Sign out
            </a>
          </div>
        </div>
      )}
    </div>
  );
};
