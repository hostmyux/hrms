
import React from 'react';
import { useVoice } from '../../contexts/VoiceContext';
import { Button } from '@/components/ui/button';
import { Mic, MicOff, Volume2, VolumeX, StopCircle, HelpCircle } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Slider } from '@/components/ui/slider';
import { voiceAssistant } from '../../services/voiceAssistant';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export const VoiceControls: React.FC = () => {
  const { isVoiceEnabled, toggleVoice, stopSpeaking } = useVoice();
  const [volume, setVolume] = React.useState(0.8);
  const [showVolumeSlider, setShowVolumeSlider] = React.useState(false);

  const handleVolumeChange = (newVolume: number[]) => {
    const value = newVolume[0];
    setVolume(value);
    voiceAssistant.setOptions({ volume: value });
  };
  
  const getContextualHelp = () => {
    // This function would generate contextual help based on the current route
    // For now, we'll just provide general assistance information
    return {
      title: "Voice Assistant Guide",
      content: [
        "The AI Voice Trainer is designed to guide you through the HR platform with natural voice instructions.",
        "Enable the voice assistant using the microphone button to receive verbal guidance.",
        "Click on various elements to hear detailed explanations about their purpose and functionality.",
        "Navigate between modules to receive context-aware information about each workspace.",
        "Adjust the volume or mute the assistant as needed for your working environment.",
        "The assistant will proactively offer suggestions and best practices for HR processes.",
      ]
    };
  };

  const helpInfo = getContextualHelp();

  return (
    <div className="flex items-center gap-2">
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            onClick={toggleVoice}
            className={isVoiceEnabled ? "border-primary" : ""}
          >
            {isVoiceEnabled ? <Mic className="h-4 w-4 text-primary" /> : <MicOff className="h-4 w-4" />}
          </Button>
        </TooltipTrigger>
        <TooltipContent>{isVoiceEnabled ? "Disable voice assistant" : "Enable voice assistant"}</TooltipContent>
      </Tooltip>

      {isVoiceEnabled && (
        <>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="outline" 
                size="icon" 
                onClick={() => setShowVolumeSlider(!showVolumeSlider)}
              >
                {volume === 0 ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
              </Button>
            </TooltipTrigger>
            <TooltipContent>Adjust volume</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="outline" 
                size="icon" 
                onClick={stopSpeaking} 
                className="ml-1"
              >
                <span className="sr-only">Stop speaking</span>
                <StopCircle className="h-4 w-4 text-destructive" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Stop speaking</TooltipContent>
          </Tooltip>

          {showVolumeSlider && (
            <div className="w-24 ml-1">
              <Slider
                defaultValue={[volume]}
                max={1}
                step={0.1}
                onValueChange={handleVolumeChange}
              />
            </div>
          )}
        </>
      )}
      
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="ghost" size="icon">
            <HelpCircle className="h-4 w-4" />
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{helpInfo.title}</DialogTitle>
            <DialogDescription>
              Learn how to use the AI voice trainer effectively
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <ul className="space-y-2">
              {helpInfo.content.map((item, index) => (
                <li key={index} className="flex items-start">
                  <span className="flex h-2 w-2 mt-1.5 mr-2 rounded-full bg-primary"></span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <p className="text-sm text-muted-foreground pt-2 border-t">
              The AI Voice Trainer adapts to each module to provide contextual guidance. Try navigating between different HR modules to experience personalized assistance.
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
