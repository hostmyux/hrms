
import React from 'react';
import { useVoice } from '../../contexts/VoiceContext';
import { Button } from '@/components/ui/button';
import { Mic, MicOff, Volume2, VolumeX, StopCircle, HelpCircle, BookOpen, Smartphone } from 'lucide-react';
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
import { useResponsive } from '../../hooks/useResponsive';

export const VoiceControls: React.FC = () => {
  const { isVoiceEnabled, toggleVoice, stopSpeaking, speak } = useVoice();
  const [volume, setVolume] = React.useState(0.8);
  const [showVolumeSlider, setShowVolumeSlider] = React.useState(false);
  const location = useLocation();
  const { isMobile, isTablet, isDesktop } = useResponsive();

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
        title: `${training.module} - Comprehensive Voice Assistant Guide`,
        content: [
          training.welcomeMessage,
          training.navigationGuide,
          'Detailed Actions Available:',
          ...training.actionInstructions,
          'Professional Tips and Best Practices:',
          ...training.tips,
          'Keyboard Shortcuts and Efficiency:',
          ...training.shortcuts,
          'Common Daily Tasks:',
          ...training.commonTasks
        ]
      };
    }

    return {
      title: "Comprehensive Voice Assistant Guide",
      content: [
        "The AI Voice Trainer provides comprehensive guidance through the HR platform with natural voice instructions tailored to your device.",
        "Enable the voice assistant using the microphone button to receive detailed verbal guidance for all features.",
        "Click on various elements to hear comprehensive explanations about their purpose, functionality, and best practices.",
        "Navigate between modules to receive context-aware information about each workspace with detailed instructions.",
        "Adjust the volume, stop speaking, or use training mode as needed for your working environment.",
        "The assistant provides proactive suggestions, accessibility features, and responsive design guidance.",
        "Training mode offers comprehensive module-specific instruction with detailed workflows and shortcuts.",
        "Voice guidance adapts to your screen size - mobile, tablet, or desktop - with appropriate instructions."
      ]
    };
  };

  const handleTrainingMode = () => {
    const currentModule = getCurrentModule();
    const guidance = voiceTrainingService.provideDetailedGuidance(currentModule);
    const responsiveInfo = voiceTrainingService.provideResponsiveGuidance();
    const deviceInfo = isMobile ? 'mobile device' : isTablet ? 'tablet' : 'desktop computer';
    
    if (guidance) {
      speak(`Entering comprehensive training mode for ${currentModule} on your ${deviceInfo}. ${guidance} ${responsiveInfo} You now have access to all detailed instructions, shortcuts, and best practices for this module.`);
    } else {
      speak(`Comprehensive training mode activated for your ${deviceInfo}. I'll provide detailed guidance as you navigate through the responsive system. Each module has specific voice training tailored to its functionality, with device-appropriate instructions and accessibility features.`);
    }
  };

  const handleResponsiveInfo = () => {
    const deviceInfo = isMobile ? 'mobile device with touch-optimized interface' : isTablet ? 'tablet with hybrid touch and click interface' : 'desktop computer with full mouse and keyboard support';
    const responsiveGuidance = voiceTrainingService.provideResponsiveGuidance();
    speak(`You are currently using this application on a ${deviceInfo}. ${responsiveGuidance} The voice trainer adapts its instructions to your current device and screen size for optimal guidance.`);
  };

  const helpInfo = getContextualHelp();

  return (
    <div className="flex items-center gap-1 sm:gap-2">
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            onClick={toggleVoice}
            className={`h-8 w-8 sm:h-10 sm:w-10 ${isVoiceEnabled ? "border-primary" : ""}`}
          >
            {isVoiceEnabled ? <Mic className="h-3 w-3 sm:h-4 sm:w-4 text-primary" /> : <MicOff className="h-3 w-3 sm:h-4 sm:w-4" />}
          </Button>
        </TooltipTrigger>
        <TooltipContent>{isVoiceEnabled ? "Disable comprehensive voice assistant" : "Enable comprehensive voice assistant"}</TooltipContent>
      </Tooltip>

      {isVoiceEnabled && (
        <>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="outline" 
                size="icon" 
                onClick={() => setShowVolumeSlider(!showVolumeSlider)}
                className="h-8 w-8 sm:h-10 sm:w-10"
              >
                {volume === 0 ? <VolumeX className="h-3 w-3 sm:h-4 sm:w-4" /> : <Volume2 className="h-3 w-3 sm:h-4 sm:w-4" />}
              </Button>
            </TooltipTrigger>
            <TooltipContent>Adjust voice volume</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="outline" 
                size="icon" 
                onClick={stopSpeaking}
                className="h-8 w-8 sm:h-10 sm:w-10"
              >
                <StopCircle className="h-3 w-3 sm:h-4 sm:w-4 text-destructive" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Stop current speech</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="outline" 
                size="icon" 
                onClick={handleTrainingMode}
                className="h-8 w-8 sm:h-10 sm:w-10"
              >
                <BookOpen className="h-3 w-3 sm:h-4 sm:w-4 text-secondary" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Activate comprehensive training mode</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="outline" 
                size="icon" 
                onClick={handleResponsiveInfo}
                className="h-8 w-8 sm:h-10 sm:w-10"
              >
                <Smartphone className="h-3 w-3 sm:h-4 sm:w-4 text-accent-foreground" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Get responsive design guidance</TooltipContent>
          </Tooltip>

          {showVolumeSlider && (
            <div className="w-16 sm:w-24">
              <Slider
                defaultValue={[volume]}
                max={1}
                step={0.1}
                onValueChange={handleVolumeChange}
                className="w-full"
              />
            </div>
          )}
        </>
      )}
      
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8 sm:h-10 sm:w-10">
            <HelpCircle className="h-3 w-3 sm:h-4 sm:w-4" />
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-lg sm:text-xl">{helpInfo.title}</DialogTitle>
            <DialogDescription className="text-sm sm:text-base">
              Learn how to use the comprehensive AI voice trainer effectively for this module on your current device
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <ul className="space-y-2">
              {helpInfo.content.map((item, index) => (
                <li key={index} className="flex items-start">
                  <span className="flex h-2 w-2 mt-1.5 mr-2 rounded-full bg-primary flex-shrink-0"></span>
                  <span className="text-sm sm:text-base">{item}</span>
                </li>
              ))}
            </ul>
            <div className="pt-2 border-t space-y-2">
              <p className="text-xs sm:text-sm text-muted-foreground">
                The AI Voice Trainer adapts to each module and your device type to provide contextual, comprehensive guidance. Use the training mode button for detailed module-specific instruction.
              </p>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Currently optimized for: {isMobile ? 'Mobile Device' : isTablet ? 'Tablet' : 'Desktop Computer'}
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
