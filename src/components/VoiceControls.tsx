import { Play, Pause, Square } from 'lucide-react';

interface VoiceControlsProps {
  isSpeaking: boolean;
  isPaused: boolean;
  onPlay: () => void;
  onPause: () => void;
  onResume: () => void;
  onStop: () => void;
  disabled?: boolean;
}

export default function VoiceControls({ isSpeaking, isPaused, onPlay, onPause, onResume, onStop, disabled }: VoiceControlsProps) {
  return (
    <div className="flex items-center gap-3 flex-wrap">
      {!isSpeaking ? (
        <button onClick={onPlay} disabled={disabled} className="btn-primary">
          <Play className="w-5 h-5" /> Generate Voice
        </button>
      ) : isPaused ? (
        <button onClick={onResume} className="btn-primary">
          <Play className="w-5 h-5" /> Resume
        </button>
      ) : (
        <button onClick={onPause} className="btn-primary">
          <Pause className="w-5 h-5" /> Pause
        </button>
      )}

      {isSpeaking && (
        <button onClick={onStop} className="btn-secondary">
          <Square className="w-5 h-5" /> Stop
        </button>
      )}
    </div>
  );
}
