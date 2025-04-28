
import React, { createContext, useContext, useState, useEffect } from 'react';
import { voiceAssistant } from '../services/voiceAssistant';

interface VoiceContextType {
  isVoiceEnabled: boolean;
  toggleVoice: () => void;
  speak: (text: string) => void;
  stopSpeaking: () => void;
}

const VoiceContext = createContext<VoiceContextType | undefined>(undefined);

export function VoiceProvider({ children }: { children: React.ReactNode }) {
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(() => voiceAssistant.isVoiceEnabled());

  useEffect(() => {
    // Speak a welcome message when the app first loads
    const timer = setTimeout(() => {
      if (isVoiceEnabled) {
        voiceAssistant.speak("Welcome to HRMS Nexus. Your voice-guided HR management system.");
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const toggleVoice = () => {
    const newState = voiceAssistant.toggle();
    setIsVoiceEnabled(newState);
    
    if (newState) {
      voiceAssistant.speak("Voice guidance enabled");
    }
  };

  const speak = (text: string) => {
    voiceAssistant.speak(text);
  };

  const stopSpeaking = () => {
    voiceAssistant.stop();
  };

  const value = {
    isVoiceEnabled,
    toggleVoice,
    speak,
    stopSpeaking
  };

  return <VoiceContext.Provider value={value}>{children}</VoiceContext.Provider>;
}

export function useVoice() {
  const context = useContext(VoiceContext);
  if (context === undefined) {
    throw new Error('useVoice must be used within a VoiceProvider');
  }
  return context;
}
