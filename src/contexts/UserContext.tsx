import React, { createContext, useContext, useState, ReactNode } from 'react';

interface UserAction {
  id: string;
  type: string;
  description: string;
  timestamp: number;
  module: string;
}

interface UserPreferences {
  theme: 'light' | 'dark';
  sidebarCollapsed: boolean;
  recentlyVisitedPages: string[];
  favoriteModules: string[];
}

interface UserContextType {
  actions: UserAction[];
  preferences: UserPreferences;
  addAction: (action: Omit<UserAction, 'id' | 'timestamp'>) => void;
  clearActions: () => void;
  updatePreferences: (preferences: Partial<UserPreferences>) => void;
}

const defaultPreferences: UserPreferences = {
  theme: 'light',
  sidebarCollapsed: false,
  recentlyVisitedPages: [],
  favoriteModules: ['Dashboard', 'Employees']
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [actions, setActions] = useState<UserAction[]>([]);
  const [preferences, setPreferences] = useState<UserPreferences>(defaultPreferences);

  const addAction = (action: Omit<UserAction, 'id' | 'timestamp'>) => {
    const newAction = {
      ...action,
      id: Date.now().toString(),
      timestamp: Date.now()
    };
    
    setActions(prev => {
      // Keep only the last 100 actions to prevent storage bloat
      const updatedActions = [newAction, ...prev];
      if (updatedActions.length > 100) {
        return updatedActions.slice(0, 100);
      }
      return updatedActions;
    });
  };

  const clearActions = () => {
    setActions([]);
  };

  const updatePreferences = (newPrefs: Partial<UserPreferences>) => {
    setPreferences(prev => ({ ...prev, ...newPrefs }));
  };

  const value = {
    actions,
    preferences,
    addAction,
    clearActions,
    updatePreferences
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
