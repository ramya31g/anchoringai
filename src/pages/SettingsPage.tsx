import { useState, useEffect, useCallback } from 'react';
import { Moon, Sun, Mic, Sparkles, Trash2 } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { useToast } from '@/context/ToastContext';
import { useScripts } from '@/context/ScriptContext';
import { getAvailableVoices, onVoicesChanged } from '@/services/ttsService';
import { TONES, DEFAULT_VOICE_SETTINGS, type VoiceSettings } from '@/types';

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const { showToast } = useToast();
  const { clearAll, scripts } = useScripts();
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [voiceSettings, setVoiceSettings] = useState<VoiceSettings>(() => {
    const stored = localStorage.getItem('aura-voice-settings');
    if (stored) return { ...DEFAULT_VOICE_SETTINGS, ...JSON.parse(stored) };
    return DEFAULT_VOICE_SETTINGS;
  });

  const refreshVoices = useCallback(() => setVoices(getAvailableVoices()), []);

  useEffect(() => {
    refreshVoices();
    const cleanup = onVoicesChanged(refreshVoices);
    return cleanup;
  }, [refreshVoices]);

  useEffect(() => {
    localStorage.setItem('aura-voice-settings', JSON.stringify(voiceSettings));
  }, [voiceSettings]);

  const handleClearAll = () => {
    if (confirm('Are you sure you want to delete ALL announcements? This cannot be undone.')) {
      clearAll();
      showToast('All announcements cleared.', 'success');
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold text-slate-900 dark:text-white mb-1">Settings</h1>
        <p className="text-slate-600 dark:text-slate-400">Customize your AURA experience.</p>
      </div>

      {/* Appearance */}
      <div className="card p-6 space-y-4">
        <h2 className="font-display text-lg font-semibold text-slate-900 dark:text-white">Appearance</h2>
        <div className="flex gap-3">
          <button
            onClick={() => setTheme('light')}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 transition-all duration-200 ${
              theme === 'light'
                ? 'border-primary-500 bg-primary-500/10 text-primary-600 dark:text-primary-400'
                : 'border-black/10 dark:border-white/10 text-slate-600 dark:text-slate-400 hover:border-primary-500/30'
            }`}
          >
            <Sun className="w-5 h-5" /> Light Mode
          </button>
          <button
            onClick={() => setTheme('dark')}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 transition-all duration-200 ${
              theme === 'dark'
                ? 'border-primary-500 bg-primary-500/10 text-primary-600 dark:text-primary-400'
                : 'border-black/10 dark:border-white/10 text-slate-600 dark:text-slate-400 hover:border-primary-500/30'
            }`}
          >
            <Moon className="w-5 h-5" /> Dark Mode
          </button>
        </div>
      </div>

      {/* Voice Preferences */}
      <div className="card p-6 space-y-4">
        <h2 className="font-display text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
          <Mic className="w-5 h-5 text-primary-500" /> Voice Preferences
        </h2>

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Default Voice</label>
          <select
            value={voiceSettings.voiceURI}
            onChange={(e) => setVoiceSettings({ ...voiceSettings, voiceURI: e.target.value })}
            className="input-field cursor-pointer"
          >
            <option value="">Default</option>
            {voices.map((v) => (
              <option key={v.voiceURI} value={v.voiceURI}>
                {v.name} ({v.lang})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Default Voice Style</label>
          <div className="flex gap-2">
            {TONES.map((t) => (
              <button
                key={t}
                onClick={() => setVoiceSettings({ ...voiceSettings, style: t })}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  voiceSettings.style === t
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
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Default Speed</label>
              <span className="text-sm text-primary-500 font-medium">{voiceSettings.rate}x</span>
            </div>
            <input
              type="range"
              min="0.5"
              max="2"
              step="0.25"
              value={voiceSettings.rate}
              onChange={(e) => setVoiceSettings({ ...voiceSettings, rate: parseFloat(e.target.value) })}
              className="w-full accent-primary-500"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Default Volume</label>
              <span className="text-sm text-primary-500 font-medium">{Math.round(voiceSettings.volume * 100)}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={voiceSettings.volume}
              onChange={(e) => setVoiceSettings({ ...voiceSettings, volume: parseFloat(e.target.value) })}
              className="w-full accent-primary-500"
            />
          </div>
        </div>
      </div>

      {/* Application */}
      <div className="card p-6 space-y-4">
        <h2 className="font-display text-lg font-semibold text-slate-900 dark:text-white">Application</h2>
        <div className="flex items-center gap-3 p-4 rounded-xl bg-gradient-to-r from-primary-500/10 to-accent-500/10">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="font-display font-semibold text-slate-900 dark:text-white">AURA — AI Voice Anchor</p>
            <p className="text-sm text-slate-500 dark:text-slate-400">Tech Fest 2026</p>
            <p className="text-xs text-primary-500 mt-0.5">Generate. Speak. Anchor.</p>
          </div>
        </div>

        <div className="flex items-center justify-between p-4 rounded-xl bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20">
          <div>
            <p className="text-sm font-medium text-red-700 dark:text-red-400">Clear All Announcements</p>
            <p className="text-xs text-red-500/70 dark:text-red-400/70">{scripts.length} announcement(s) stored</p>
          </div>
          <button onClick={handleClearAll} className="btn-danger text-sm">
            <Trash2 className="w-4 h-4" /> Clear All
          </button>
        </div>
      </div>
    </div>
  );
}
