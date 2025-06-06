
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
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Initialize voice assistant
    try {
      const enabled = voiceAssistant.isVoiceEnabled();
      setIsVoiceEnabled(enabled);
      setIsInitialized(true);
      console.log('Voice assistant initialized:', enabled);
    } catch (error) {
      console.error('Error initializing voice assistant:', error);
      setIsVoiceEnabled(false);
      setIsInitialized(true);
    }
  }, []);

  useEffect(() => {
    // Only run welcome message after initialization and if voice is enabled
    if (!isInitialized || !isVoiceEnabled) return;

    // Check if speech synthesis is available
    if (!window.speechSynthesis) {
      console.warn('Speech synthesis not supported in this browser');
      return;
    }

    // Speak a welcome message when the app first loads
    const timer = setTimeout(() => {
      try {
        voiceAssistant.speak("Welcome to HRMS Nexus. Your voice-guided HR management system is ready.");
      } catch (error) {
        console.error('Error speaking welcome message:', error);
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [isVoiceEnabled, isInitialized]);

  const toggleVoice = () => {
    try {
      const newState = voiceAssistant.toggle();
      setIsVoiceEnabled(newState);
      
      if (newState) {
        voiceAssistant.speak("Voice guidance enabled.");
      }
    } catch (error) {
      console.error('Error toggling voice:', error);
      setIsVoiceEnabled(false);
    }
  };

  const speak = (text: string) => {
    if (!isVoiceEnabled || !text?.trim()) return;
    
    try {
      voiceAssistant.speak(text);
    } catch (error) {
      console.error('Error speaking text:', error);
    }
  };

  const stopSpeaking = () => {
    try {
      voiceAssistant.stop();
    } catch (error) {
      console.error('Error stopping speech:', error);
    }
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
