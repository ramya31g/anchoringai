import { useState, useEffect, useCallback } from 'react';
import { Mic, Loader2, AlertCircle } from 'lucide-react';
import {
  getAvailableVoices,
  onVoicesChanged,
  isSpeechSupported,
  speak as ttsSpeak,
  pause as ttsPause,
  resume as ttsResume,
  stop as ttsStop,
} from '@/services/ttsService';
import { useScripts } from '@/context/ScriptContext';
import { useToast } from '@/context/ToastContext';
import Waveform from '@/components/Waveform';
import VoiceControls from '@/components/VoiceControls';
import { TONES, DEFAULT_VOICE_SETTINGS, type VoiceSettings, type Script } from '@/types';

export default function VoiceStudioPage() {
  const { scripts } = useScripts();
  const { showToast } = useToast();
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [settings, setSettings] = useState<VoiceSettings>(() => {
    const stored = localStorage.getItem('aura-voice-settings');
    if (stored) return { ...DEFAULT_VOICE_SETTINGS, ...JSON.parse(stored) };
    return DEFAULT_VOICE_SETTINGS;
  });
  const [selectedScript, setSelectedScript] = useState<Script | null>(null);
  const [textContent, setTextContent] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (scripts.length > 0 && !selectedScript) {
      setSelectedScript(scripts[0]);
      setTextContent(scripts[0].content);
    }
  }, [scripts, selectedScript]);

  const refreshVoices = useCallback(() => {
    setVoices(getAvailableVoices());
  }, []);

  useEffect(() => {
    refreshVoices();
    const cleanup = onVoicesChanged(refreshVoices);
    return cleanup;
  }, [refreshVoices]);

  useEffect(() => {
    localStorage.setItem('aura-voice-settings', JSON.stringify(settings));
  }, [settings]);

  const handleSelectScript = (id: string) => {
    const script = scripts.find((s) => s.id === id);
    if (script) {
      setSelectedScript(script);
      setTextContent(script.content);
      ttsStop();
      setIsSpeaking(false);
      setIsPaused(false);
    }
  };

  const handlePlay = async () => {
    if (!textContent.trim()) {
      showToast('Please generate or enter a script first.', 'error');
      return;
    }
    if (!isSpeechSupported()) {
      showToast('Voice generation is not supported by this browser. Please use Google Chrome or another modern browser.', 'error');
      return;
    }
    setIsSpeaking(true);
    setIsPaused(false);
    try {
      await ttsSpeak(textContent, settings);
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'AURA couldn\'t generate the announcement. Please try again.', 'error');
    }
    setIsSpeaking(false);
    setIsPaused(false);
  };

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
    setIsSpeaking(false);
    setIsPaused(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold text-slate-900 dark:text-white mb-2">AURA Voice Studio</h1>
        <p className="text-slate-600 dark:text-slate-400">Convert your script into AI speech.</p>
      </div>

      {!isSpeechSupported() && (
        <div className="flex items-start gap-3 p-4 rounded-xl bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20">
          <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-amber-700 dark:text-amber-400">
            Voice generation is not supported by this browser. Please use Google Chrome or another modern browser.
          </p>
        </div>
      )}

      {/* Script selector */}
      <div className="card p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Select Announcement</label>
          <select
            value={selectedScript?.id ?? ''}
            onChange={(e) => handleSelectScript(e.target.value)}
            className="input-field cursor-pointer"
          >
            <option value="">Choose an announcement...</option>
            {scripts.map((s) => (
              <option key={s.id} value={s.id}>{s.title}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Script Text</label>
          <textarea
            value={textContent}
            onChange={(e) => setTextContent(e.target.value)}
            rows={6}
            className="input-field resize-none leading-relaxed"
            placeholder="Select an announcement or paste text here..."
          />
        </div>
      </div>

      {/* Waveform display */}
      <div className="card p-8 flex flex-col items-center gap-4">
        <Waveform active={isSpeaking && !isPaused} bars={32} />
        <p className="text-sm text-slate-500 dark:text-slate-400">
          {isSpeaking ? (isPaused ? 'Paused' : 'AURA is speaking...') : 'Ready to speak'}
        </p>
      </div>

      {/* Voice Settings */}
      <div className="card p-6 space-y-5">
        <h2 className="font-display text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
          <Mic className="w-5 h-5 text-primary-500" /> Voice Settings
        </h2>

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Voice</label>
          <select
            value={settings.voiceURI}
            onChange={(e) => setSettings({ ...settings, voiceURI: e.target.value })}
            className="input-field cursor-pointer"
          >
            <option value="">Default</option>
            {voices.map((v) => (
              <option key={v.voiceURI} value={v.voiceURI}>
                {v.name} ({v.lang})
              </option>
            ))}
          </select>
          {voices.length === 0 && (
            <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
              <Loader2 className="w-3 h-3 animate-spin" /> Loading available voices...
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Voice Style</label>
          <div className="flex gap-2">
            {TONES.map((t) => (
              <button
                key={t}
                onClick={() => setSettings({ ...settings, style: t })}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  settings.style === t
                    ? 'bg-primary-500 text-white'
                    : 'bg-black/5 dark:bg-white/10 text-slate-600 dark:text-slate-400 hover:bg-black/10 dark:hover:bg-white/20'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Speech Speed</label>
              <span className="text-sm text-primary-500 font-medium">{settings.rate}x</span>
            </div>
            <input
              type="range"
              min="0.5"
              max="2"
              step="0.25"
              value={settings.rate}
              onChange={(e) => setSettings({ ...settings, rate: parseFloat(e.target.value) })}
              className="w-full accent-primary-500"
            />
            <div className="flex justify-between text-xs text-slate-400 mt-1">
              <span>0.5x</span><span>1x</span><span>1.5x</span><span>2x</span>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Volume</label>
              <span className="text-sm text-primary-500 font-medium">{Math.round(settings.volume * 100)}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={settings.volume}
              onChange={(e) => setSettings({ ...settings, volume: parseFloat(e.target.value) })}
              className="w-full accent-primary-500"
            />
            <div className="flex justify-between text-xs text-slate-400 mt-1">
              <span>0%</span><span>50%</span><span>100%</span>
            </div>
          </div>
        </div>

        <VoiceControls
          isSpeaking={isSpeaking}
          isPaused={isPaused}
          onPlay={handlePlay}
          onPause={handlePause}
          onResume={handleResume}
          onStop={handleStop}
        />
      </div>
    </div>
  );
}
