
import React, { useState, useRef, useEffect } from 'react';
import { Bell, Search, User, X, History, FileText, Briefcase } from 'lucide-react';
import { useVoice } from '../../contexts/VoiceContext';
import { useUser } from '../../contexts/UserContext';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useResponsive } from '../../hooks/useResponsive';
import { Button } from '@/components/ui/button';
import RoleSwitcher from './RoleSwitcher';

export const Topbar: React.FC = () => {
  const { speak } = useVoice();
  const { addAction } = useUser();
  const { isMobile } = useResponsive();
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const notificationsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
        setNotificationsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleNotifications = () => {
    setNotificationsOpen(!notificationsOpen);
    if (!notificationsOpen) {
      speak("Notifications panel. Here you can view all your HR related notifications.");
      
      // Record the action
      addAction({
        type: "view",
        description: "Opened notifications panel",
        module: "Notifications"
      });
    }
  };

  return (
    <header className={`flex items-center h-16 px-3 sm:px-6 border-b border-border bg-card ${isMobile ? 'justify-end' : ''}`}>
      {!isMobile && (
        <div className="flex-1">
          <SearchBar />
        </div>
      )}
        <div className="flex items-center gap-4">
        <Button 
          variant="outline" 
          className="hidden sm:flex"
          onClick={() => {
            window.open('https://skillsim.vercel.app/dashboard', '_self');
            addAction({
              type: "navigation",
              description: "Accessed Master Dashboard",
              module: "External Dashboard"
            });
          }}
        >
          Master Dashboard
        </Button>
        
        <div className="relative" ref={notificationsRef}>
          <button 
            className="p-2 rounded-full hover:bg-accent relative"
            onClick={toggleNotifications}
            aria-label="View notifications"
          >
            <Bell size={20} />
            <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
          
          {notificationsOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-card border border-border rounded-md shadow-lg z-50 animate-fade-in">
              <div className="flex justify-between items-center p-4 border-b border-border">
                <h3 className="font-medium">Notifications</h3>
                <Link 
                  to="/notifications" 
                  className="text-sm text-primary hover:underline"
                  onClick={() => {
                    setNotificationsOpen(false);
                    addAction({
                      type: "navigation",
                      description: "Viewed all notifications",
                      module: "Notifications"
                    });
                  }}
                >
                  View All
                </Link>
              </div>
              <div className="max-h-72 overflow-y-auto">
                {[1, 2, 3].map((item) => (
                  <div 
                    key={item} 
                    className="p-4 border-b border-border hover:bg-muted/30 cursor-pointer"
                    onClick={() => {
                      addAction({
                        type: "view",
                        description: `Viewed notification: Leave Request Approved`,
                        module: "Notifications"
                      });
                    }}
                  >
                    <p className="font-medium text-sm">Leave Request Approved</p>
                    <p className="text-xs text-muted-foreground mt-1">John's vacation has been approved</p>
                    <p className="text-xs text-muted-foreground mt-2">2 hours ago</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        
        <Link 
          to="/user-activity"
          className="p-2 rounded-full hover:bg-accent"
          onClick={() => {
            addAction({
              type: "navigation",
              description: "Accessed user activity history",
              module: "User Activity"
            });
          }}
        >
          <History size={20} />
        </Link>
        
        <div className="h-8 w-px bg-border hidden md:block"></div>
        <RoleSwitcher />
      </div>
    </header>
  );
};

const SearchBar: React.FC = () => {
  const { speak } = useVoice();
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const navigate = useNavigate();
  const searchRef = useRef<HTMLDivElement>(null);

  const mockSearchResults = [
    { type: 'employee', name: 'John Doe', path: '/employees/1' },
    { type: 'employee', name: 'Jane Smith', path: '/employees/2' },
    { type: 'document', name: 'Employee Handbook', path: '/documents/1' },
    { type: 'job', name: 'Senior Developer', path: '/recruitment/jobs/1' }
  ];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchFocused(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    
    if (value.length > 1) {
      // Filter mock results based on search term
      const filtered = mockSearchResults.filter(
        item => item.name.toLowerCase().includes(value.toLowerCase())
      );
      setSearchResults(filtered);
    } else {
      setSearchResults([]);
    }
  };
  
  const handleResultClick = (path: string) => {
    navigate(path);
    setSearchTerm('');
    setIsSearchFocused(false);
    toast.info("Navigating to search result");
  };

  return (
    <div 
      className="relative max-w-md"
      ref={searchRef}
    >
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
      <input
        type="text"
        value={searchTerm}
        onChange={handleSearchChange}
        onFocus={() => {
          setIsSearchFocused(true);
          speak("Search across the entire HRMS system. Type employee names, departments, or any HR related queries.");
        }}
        placeholder="Search..."
        className="pl-10 pr-4 py-2 w-full bg-accent/50 text-foreground rounded-md border border-transparent focus:border-ring focus:outline-none"
      />
      
      {isSearchFocused && searchTerm.length > 0 && (
        <div className="absolute left-0 right-0 mt-2 bg-card border border-border rounded-md shadow-lg z-50 animate-fade-in max-h-72 overflow-y-auto">
          {searchResults.length > 0 ? (
            <>
              {searchResults.map((result, index) => (
                <div 
                  key={index}
                  className="p-3 hover:bg-muted cursor-pointer flex items-center"
                  onClick={() => handleResultClick(result.path)}
                >
                  {result.type === 'employee' && <User size={16} className="mr-2 text-muted-foreground" />}
                  {result.type === 'document' && <FileText size={16} className="mr-2 text-muted-foreground" />}
                  {result.type === 'job' && <Briefcase size={16} className="mr-2 text-muted-foreground" />}
                  <div>
                    <p className="text-sm font-medium">{result.name}</p>
                    <p className="text-xs text-muted-foreground capitalize">{result.type}</p>
                  </div>
                </div>
              ))}
            </>
          ) : (
            <div className="p-4 text-sm text-muted-foreground text-center">
              No results found for "{searchTerm}"
            </div>
          )}
        </div>
      )}
      
      {isSearchFocused && searchTerm && (
        <button 
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
          onClick={() => setSearchTerm('')}
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
};

const UserMenu: React.FC = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const { speak } = useVoice();
  const { addAction } = useUser();
  const menuRef = React.useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

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

  const handleMenuItemClick = (action: string) => {
    setIsOpen(false);
    
    switch(action) {
      case 'profile':
        navigate('/settings/profile');
        speak("View or edit your profile");
        toast.info("Navigating to your profile");
        addAction({
          type: "navigation",
          description: "Viewed user profile",
          module: "Settings"
        });
        break;
      case 'settings':
        navigate('/settings');
        speak("Adjust your account settings");
        toast.info("Navigating to settings");
        addAction({
          type: "navigation",
          description: "Accessed settings",
          module: "Settings"
        });
        break;
      case 'signout':
        speak("Signing out of HRMS Nexus");
        toast.info("Signing out...");
        addAction({
          type: "auth",
          description: "Signed out",
          module: "Authentication"
        });
        // In a real app, would handle actual logout here
        setTimeout(() => {
          toast.success("Successfully signed out");
        }, 1000);
        break;
    }
  };

  return (
    <div className="relative" ref={menuRef}>
      <button 
        className="flex items-center gap-2 hover:bg-accent p-1 rounded-md"
        onClick={toggleMenu}
      >
        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary">
          <User size={18} />
        </div>
        <span className="text-sm font-medium">Admin</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-1 w-48 rounded-md bg-card border border-border shadow-lg animate-scale-in z-10">
          <div className="py-1">
            <button 
              className="flex w-full items-center px-4 py-2 text-sm hover:bg-accent text-left"
              onClick={() => handleMenuItemClick('profile')}
            >
              Your Profile
            </button>
            <button 
              className="flex w-full items-center px-4 py-2 text-sm hover:bg-accent text-left"
              onClick={() => handleMenuItemClick('settings')}
            >
              Settings
            </button>
            <button 
              className="flex w-full items-center px-4 py-2 text-sm hover:bg-accent text-left"
              onClick={() => handleMenuItemClick('signout')}
            >
              Sign out
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

