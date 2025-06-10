
import React, { createContext, useContext, useState, useEffect } from 'react';
import { voiceAssistant } from '../services/voiceAssistant';
import { voiceTrainingService } from '../services/voiceTrainingService';

interface VoiceContextType {
  isVoiceEnabled: boolean;
  toggleVoice: () => void;
  speak: (text: string) => void;
  stopSpeaking: () => void;
  provideModuleGuidance: (module: string) => void;
  provideActionGuidance: (module: string, action: string) => void;
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

    // Speak a comprehensive welcome message when the app first loads
    const timer = setTimeout(() => {
      try {
        voiceAssistant.speak("Welcome to HRMS Nexus, your comprehensive voice-guided HR management system. I'm your AI voice trainer, ready to guide you through all HR operations. Voice assistance is now active and will provide detailed explanations as you navigate. You can toggle voice guidance using the microphone button in the top navigation, adjust volume, or stop speaking at any time. Let's begin exploring your HR dashboard.");
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
        voiceAssistant.speak("Voice guidance enabled. I will now provide comprehensive assistance as you navigate through the HR system. All buttons, forms, and actions will include detailed voice instructions.");
      } else {
        voiceAssistant.speak("Voice guidance disabled. You can re-enable it anytime using the microphone button.");
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

  const provideModuleGuidance = (module: string) => {
    if (!isVoiceEnabled) return;
    
    const guidance = voiceTrainingService.provideContextualHelp(module);
    speak(guidance);
  };

  const provideActionGuidance = (module: string, action: string) => {
    if (!isVoiceEnabled) return;
    
    const guidance = voiceTrainingService.provideContextualHelp(module, action);
    speak(guidance);
  };

  const value = {
    isVoiceEnabled,
    toggleVoice,
    speak,
    stopSpeaking,
    provideModuleGuidance,
    provideActionGuidance
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
