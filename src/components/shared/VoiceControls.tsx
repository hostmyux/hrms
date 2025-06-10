
import React from 'react';
import { useVoice } from '../../contexts/VoiceContext';
import { Button } from '@/components/ui/button';
import { Mic, MicOff, Volume2, VolumeX, StopCircle, HelpCircle, BookOpen } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Slider } from '@/components/ui/slider';
import { voiceAssistant } from '../../services/voiceAssistant';
import { voiceTrainingService } from '../../services/voiceTrainingService';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useLocation } from 'react-router-dom';

export const VoiceControls: React.FC = () => {
  const { isVoiceEnabled, toggleVoice, stopSpeaking, speak } = useVoice();
  const [volume, setVolume] = React.useState(0.8);
  const [showVolumeSlider, setShowVolumeSlider] = React.useState(false);
  const location = useLocation();

  const handleVolumeChange = (newVolume: number[]) => {
    const value = newVolume[0];
    setVolume(value);
    voiceAssistant.setOptions({ volume: value });
  };
  
  const getCurrentModule = () => {
    const path = location.pathname;
    const moduleMap: Record<string, string> = {
      '/': 'dashboard',
      '/organization': 'organization',
      '/employees': 'employees',
      '/recruitment': 'recruitment',
      '/attendance': 'attendance',
      '/payroll': 'payroll',
      '/performance': 'performance',
      '/learning': 'learning',
      '/reports': 'reports',
      '/helpdesk': 'helpdesk'
    };
    return moduleMap[path] || 'general';
  };

  const getContextualHelp = () => {
    const currentModule = getCurrentModule();
    const training = voiceTrainingService.getModuleTraining(currentModule);
    
    if (training) {
      return {
        title: `${training.module} - Voice Assistant Guide`,
        content: [
          training.welcomeMessage,
          training.navigationGuide,
          ...training.actionInstructions,
          ...training.tips
        ]
      };
    }

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

  const handleTrainingMode = () => {
    const currentModule = getCurrentModule();
    const guidance = voiceTrainingService.provideDetailedGuidance(currentModule);
    
    if (guidance) {
      speak(`Entering training mode for ${currentModule}. ${guidance}`);
    } else {
      speak("Training mode activated. I'll provide comprehensive guidance as you navigate through the system. Each module has specific voice training tailored to its functionality.");
    }
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
                <StopCircle className="h-4 w-4 text-destructive" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Stop speaking</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="outline" 
                size="icon" 
                onClick={handleTrainingMode}
              >
                <BookOpen className="h-4 w-4 text-blue-600" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Activate training mode</TooltipContent>
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
              Learn how to use the AI voice trainer effectively for this module
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
              The AI Voice Trainer adapts to each module to provide contextual guidance. Use the training mode button for comprehensive module-specific instruction.
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
