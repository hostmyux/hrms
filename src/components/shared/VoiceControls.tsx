
import React from 'react';
import { useVoice } from '../../contexts/VoiceContext';
import { Button } from '@/components/ui/button';
import { Mic, MicOff, Volume2, VolumeX, StopCircle } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Slider } from '@/components/ui/slider';
import { voiceAssistant } from '../../services/voiceAssistant';

export const VoiceControls: React.FC = () => {
  const { isVoiceEnabled, toggleVoice, stopSpeaking } = useVoice();
  const [volume, setVolume] = React.useState(0.8);
  const [showVolumeSlider, setShowVolumeSlider] = React.useState(false);

  const handleVolumeChange = (newVolume: number[]) => {
    const value = newVolume[0];
    setVolume(value);
    voiceAssistant.setOptions({ volume: value });
  };

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
    </div>
  );
};
