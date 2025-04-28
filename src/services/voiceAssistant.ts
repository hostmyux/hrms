
interface VoiceAssistantOptions {
  voice?: SpeechSynthesisVoice;
  pitch?: number;
  rate?: number;
  volume?: number;
}

class VoiceAssistant {
  private static instance: VoiceAssistant;
  private speechSynthesis: SpeechSynthesis;
  private speechUtterance: SpeechSynthesisUtterance;
  private voice: SpeechSynthesisVoice | null = null;
  private isEnabled: boolean = true;

  private constructor() {
    this.speechSynthesis = window.speechSynthesis;
    this.speechUtterance = new SpeechSynthesisUtterance();
    
    // Set default properties
    this.speechUtterance.pitch = 1.0;
    this.speechUtterance.rate = 1.0;
    this.speechUtterance.volume = 0.8;
    
    // Try to select a female voice if available
    this.loadVoices();
    
    // Handle voices loading asynchronously in some browsers
    if (speechSynthesis.onvoiceschanged !== undefined) {
      speechSynthesis.onvoiceschanged = this.loadVoices.bind(this);
    }
  }

  private loadVoices(): void {
    const voices = this.speechSynthesis.getVoices();
    if (voices.length > 0) {
      // Try to find a female English voice
      const femaleEnVoice = voices.find(
        voice => voice.lang.includes('en') && voice.name.includes('Female')
      );
      
      // Or any English voice
      const anyEnVoice = voices.find(voice => voice.lang.includes('en'));
      
      // Or just use the first available voice
      this.voice = femaleEnVoice || anyEnVoice || voices[0];
      this.speechUtterance.voice = this.voice;
    }
  }

  public static getInstance(): VoiceAssistant {
    if (!VoiceAssistant.instance) {
      VoiceAssistant.instance = new VoiceAssistant();
    }
    return VoiceAssistant.instance;
  }

  public speak(text: string): void {
    if (!this.isEnabled) return;
    
    // Cancel any ongoing speech
    this.speechSynthesis.cancel();
    
    this.speechUtterance.text = text;
    this.speechSynthesis.speak(this.speechUtterance);
  }

  public stop(): void {
    this.speechSynthesis.cancel();
  }

  public setOptions(options: VoiceAssistantOptions): void {
    if (options.voice) this.speechUtterance.voice = options.voice;
    if (options.pitch !== undefined) this.speechUtterance.pitch = options.pitch;
    if (options.rate !== undefined) this.speechUtterance.rate = options.rate;
    if (options.volume !== undefined) this.speechUtterance.volume = options.volume;
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
    return this.isEnabled;
  }

  public getAvailableVoices(): SpeechSynthesisVoice[] {
    return this.speechSynthesis.getVoices();
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
