
import React from 'react';
import { useVoice } from '../../contexts/VoiceContext';
import { Button } from '@/components/ui/button';
import { Mic, MicOff, Volume2, VolumeX } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { voiceAssistant } from '../../services/voiceAssistant';

export const VoiceControls: React.FC = () => {
  const { isVoiceEnabled, toggleVoice, stopSpeaking } = useVoice();
  const [volume, setVolume] = React.useState(0.8);

  const handleVolumeChange = (newVolume: number) => {
    setVolume(newVolume);
    voiceAssistant.setOptions({ volume: newVolume });
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
              <Button variant="outline" size="icon" onClick={stopSpeaking}>
                {volume === 0 ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
              </Button>
            </TooltipTrigger>
            <TooltipContent>Stop speaking</TooltipContent>
          </Tooltip>
        </>
      )}
    </div>
  );
};
