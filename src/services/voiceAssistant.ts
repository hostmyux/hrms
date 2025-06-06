
interface VoiceAssistantOptions {
  voice?: SpeechSynthesisVoice;
  pitch?: number;
  rate?: number;
  volume?: number;
}

class VoiceAssistant {
  private static instance: VoiceAssistant;
  private speechSynthesis: SpeechSynthesis | null = null;
  private speechUtterance: SpeechSynthesisUtterance | null = null;
  private voice: SpeechSynthesisVoice | null = null;
  private isEnabled: boolean = true;
  private isSupported: boolean = false;

  private constructor() {
    // Check if speech synthesis is supported
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.speechSynthesis = window.speechSynthesis;
      this.speechUtterance = new SpeechSynthesisUtterance();
      this.isSupported = true;
      
      // Set default properties
      this.speechUtterance.pitch = 1.0;
      this.speechUtterance.rate = 0.9;
      this.speechUtterance.volume = 0.8;
      
      // Try to select a voice
      this.loadVoices();
      
      // Handle voices loading asynchronously in some browsers
      if (this.speechSynthesis && this.speechSynthesis.onvoiceschanged !== undefined) {
        this.speechSynthesis.onvoiceschanged = this.loadVoices.bind(this);
      }
    } else {
      console.warn('Speech synthesis not supported in this environment');
      this.isEnabled = false;
    }
  }

  private loadVoices(): void {
    if (!this.speechSynthesis || !this.speechUtterance) return;
    
    try {
      const voices = this.speechSynthesis.getVoices();
      if (voices.length > 0) {
        // Try to find a female English voice
        const femaleEnVoice = voices.find(
          voice => voice.lang.includes('en') && (
            voice.name.toLowerCase().includes('female') ||
            voice.name.toLowerCase().includes('zira') ||
            voice.name.toLowerCase().includes('hazel')
          )
        );
        
        // Or any English voice
        const anyEnVoice = voices.find(voice => voice.lang.includes('en'));
        
        // Or just use the first available voice
        this.voice = femaleEnVoice || anyEnVoice || voices[0];
        this.speechUtterance.voice = this.voice;
        
        console.log('Voice assistant initialized with voice:', this.voice?.name);
      }
    } catch (error) {
      console.error('Error loading voices:', error);
    }
  }

  public static getInstance(): VoiceAssistant {
    if (!VoiceAssistant.instance) {
      VoiceAssistant.instance = new VoiceAssistant();
    }
    return VoiceAssistant.instance;
  }

  public speak(text: string): void {
    if (!this.isEnabled || !this.isSupported || !this.speechSynthesis || !this.speechUtterance) {
      console.warn('Voice assistant not available or disabled');
      return;
    }
    
    if (!text?.trim()) {
      console.warn('Empty text provided to voice assistant');
      return;
    }
    
    try {
      // Cancel any ongoing speech
      this.speechSynthesis.cancel();
      
      // Create a new utterance for this text
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.pitch = this.speechUtterance.pitch;
      utterance.rate = this.speechUtterance.rate;
      utterance.volume = this.speechUtterance.volume;
      utterance.voice = this.voice;
      
      // Add error handling
      utterance.onerror = (event) => {
        console.error('Speech synthesis error:', event.error);
      };
      
      this.speechSynthesis.speak(utterance);
    } catch (error) {
      console.error('Error in speech synthesis:', error);
    }
  }

  public stop(): void {
    if (this.speechSynthesis) {
      try {
        this.speechSynthesis.cancel();
      } catch (error) {
        console.error('Error stopping speech synthesis:', error);
      }
    }
  }

  public setOptions(options: VoiceAssistantOptions): void {
    if (!this.speechUtterance) return;
    
    try {
      if (options.voice) this.speechUtterance.voice = options.voice;
      if (options.pitch !== undefined) this.speechUtterance.pitch = options.pitch;
      if (options.rate !== undefined) this.speechUtterance.rate = options.rate;
      if (options.volume !== undefined) this.speechUtterance.volume = options.volume;
    } catch (error) {
      console.error('Error setting voice options:', error);
    }
  }

  public enable(): void {
    this.isEnabled = true;
  }

  public disable(): void {
    this.isEnabled = false;
    this.stop();
  }

  public toggle(): boolean {
    this.isEnabled = !this.isEnabled;
    if (!this.isEnabled) {
      this.stop();
    }
    return this.isEnabled;
  }

  public isVoiceEnabled(): boolean {
    return this.isEnabled && this.isSupported;
  }

  public getAvailableVoices(): SpeechSynthesisVoice[] {
    if (!this.speechSynthesis) return [];
    
    try {
      return this.speechSynthesis.getVoices();
    } catch (error) {
      console.error('Error getting available voices:', error);
      return [];
    }
  }
}

export const voiceAssistant = VoiceAssistant.getInstance();

// Hook for React components to use voice assistant
export const useVoiceAssistant = () => {
  return {
    speak: (text: string) => voiceAssistant.speak(text),
    stop: () => voiceAssistant.stop(),
    setOptions: (options: VoiceAssistantOptions) => voiceAssistant.setOptions(options),
    enable: () => voiceAssistant.enable(),
    disable: () => voiceAssistant.disable(),
    toggle: () => voiceAssistant.toggle(),
    isEnabled: () => voiceAssistant.isVoiceEnabled(),
    getVoices: () => voiceAssistant.getAvailableVoices()
  };
};
