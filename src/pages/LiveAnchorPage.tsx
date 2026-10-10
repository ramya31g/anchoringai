import { useState, useEffect, useCallback } from 'react';
import { Play, Pause, Square, SkipForward, Radio, AlertCircle } from 'lucide-react';
import {
  isSpeechSupported,
  speak as ttsSpeak,
  pause as ttsPause,
  resume as ttsResume,
  stop as ttsStop,
} from '@/services/ttsService';
import { useScripts } from '@/context/ScriptContext';
import { useToast } from '@/context/ToastContext';
import { DEFAULT_VOICE_SETTINGS, type VoiceSettings, type Script } from '@/types';
import AURAOrb from '@/components/AURAOrb';
import Waveform from '@/components/Waveform';

export default function LiveAnchorPage() {
  const { scripts } = useScripts();
  const { showToast } = useToast();
  const [selectedScript, setSelectedScript] = useState<Script | null>(null);
  const [orbState, setOrbState] = useState<'idle' | 'speaking' | 'completed'>('idle');
  const [isPaused, setIsPaused] = useState(false);
  const [settings] = useState<VoiceSettings>(() => {
    const stored = localStorage.getItem('aura-voice-settings');
    if (stored) return { ...DEFAULT_VOICE_SETTINGS, ...JSON.parse(stored) };
    return DEFAULT_VOICE_SETTINGS;
  });

  useEffect(() => {
    if (scripts.length > 0 && !selectedScript) {
      setSelectedScript(scripts[0]);
    }
  }, [scripts, selectedScript]);

  const handleSpeak = useCallback(async () => {
    if (!selectedScript) {
      showToast('Please select an announcement first.', 'error');
      return;
    }
    if (!isSpeechSupported()) {
      showToast('Voice generation is not supported by this browser. Please use Google Chrome or another modern browser.', 'error');
      return;
    }
    setOrbState('speaking');
    setIsPaused(false);
    try {
      await ttsSpeak(selectedScript.content, settings);
      setOrbState('completed');
      setTimeout(() => setOrbState('idle'), 3000);
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'AURA couldn\'t generate the announcement. Please try again.', 'error');
      setOrbState('idle');
    }
  }, [selectedScript, settings, showToast]);

  const handlePause = () => {
    ttsPause();
    setIsPaused(true);
  };

  const handleResume = () => {
    ttsResume();
    setIsPaused(false);
  };

  const handleStop = () => {
    ttsStop();
    setOrbState('idle');
    setIsPaused(false);
  };

  const handleNext = () => {
    if (!selectedScript || scripts.length === 0) return;
    const currentIndex = scripts.findIndex((s) => s.id === selectedScript.id);
    const nextIndex = (currentIndex + 1) % scripts.length;
    ttsStop();
    setOrbState('idle');
    setIsPaused(false);
    setSelectedScript(scripts[nextIndex]);
  };

  const statusText =
    orbState === 'speaking' ? (isPaused ? 'Paused' : 'AURA is speaking...') :
    orbState === 'completed' ? 'Announcement completed.' :
    'AURA is ready to anchor.';

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col">
      {/* Top bar */}
      <div className="text-center py-6">
        <h1 className="font-display text-4xl font-bold text-slate-900 dark:text-white tracking-wider">AURA</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 tracking-widest mt-1">AI VOICE ANCHOR</p>
      </div>

      {/* Main stage area */}
      <div className="flex-1 flex flex-col items-center justify-center relative overflow-hidden px-4">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-primary-950/20 via-transparent to-accent-950/20 dark:from-primary-950/40 dark:via-slate-950 dark:to-accent-950/40 rounded-3xl" />
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-primary-500/10 rounded-full blur-3xl animate-pulse-glow" />

        <div className="relative flex flex-col items-center gap-8">
          <AURAOrb state={orbState} size="xl" />
          <Waveform active={orbState === 'speaking' && !isPaused} bars={40} />

          <div className="text-center">
            <p className={`font-display text-xl font-medium ${
              orbState === 'speaking' ? 'text-primary-500 dark:text-primary-400' :
              orbState === 'completed' ? 'text-emerald-500' :
              'text-slate-600 dark:text-slate-400'
            }`}>
              {statusText}
            </p>
            {selectedScript && (
              <p className="text-sm text-slate-400 dark:text-slate-500 mt-2">{selectedScript.title}</p>
            )}
          </div>
        </div>
      </div>

      {/* Controls panel */}
      <div className="card p-6 m-4 space-y-4 glass-strong">
        {!isSpeechSupported() && (
          <div className="flex items-start gap-3 p-3 rounded-xl bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20">
            <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-amber-700 dark:text-amber-400">
              Voice generation is not supported by this browser. Please use Google Chrome or another modern browser.
            </p>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Announcement</label>
          <select
            value={selectedScript?.id ?? ''}
            onChange={(e) => {
              const script = scripts.find((s) => s.id === e.target.value);
              if (script) {
                ttsStop();
                setOrbState('idle');
                setIsPaused(false);
                setSelectedScript(script);
              }
            }}
            className="input-field cursor-pointer"
          >
            <option value="">Select an announcement...</option>
            {scripts.map((s) => (
              <option key={s.id} value={s.id}>{s.title}</option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-3 flex-wrap justify-center">
          {orbState !== 'speaking' ? (
            <button
              onClick={handleSpeak}
              disabled={!selectedScript}
              className="px-8 py-3 rounded-xl bg-primary-600 hover:bg-primary-700 text-white font-display font-semibold text-base transition-all duration-200 shadow-lg shadow-primary-600/30 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center gap-2"
            >
              <Play className="w-5 h-5" /> SPEAK NOW
            </button>
          ) : isPaused ? (
            <button onClick={handleResume} className="px-8 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-display font-semibold text-base transition-all duration-200 shadow-lg shadow-emerald-600/30 hover:-translate-y-0.5 inline-flex items-center gap-2">
              <Play className="w-5 h-5" /> Resume
            </button>
          ) : (
            <button onClick={handlePause} className="px-8 py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-display font-semibold text-base transition-all duration-200 shadow-lg shadow-amber-500/30 hover:-translate-y-0.5 inline-flex items-center gap-2">
              <Pause className="w-5 h-5" /> Pause
            </button>
          )}

          {orbState === 'speaking' && (
            <button onClick={handleStop} className="btn-secondary">
              <Square className="w-5 h-5" /> Stop
            </button>
          )}

          <button onClick={handleNext} disabled={scripts.length === 0} className="btn-secondary">
            <SkipForward className="w-5 h-5" /> Next Announcement
          </button>
        </div>

        <div className="flex items-center justify-center gap-2 pt-2 border-t border-black/5 dark:border-white/10">
          <Radio className="w-4 h-4 text-slate-400" />
          <span className="text-xs text-slate-400 dark:text-slate-500">Optimized for projector and stage presentation</span>
        </div>
      </div>
    </div>
  );
}
