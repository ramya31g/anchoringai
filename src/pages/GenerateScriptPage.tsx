import { useState } from 'react';
import { Sparkles, RefreshCw, Copy, Save, Mic, Loader2, Check } from 'lucide-react';
import { generateScript } from '@/services/aiService';
import { useScripts } from '@/context/ScriptContext';
import { useToast } from '@/context/ToastContext';
import {
  ANNOUNCEMENT_TYPES,
  TONES,
  LANGUAGES,
  DEFAULT_FORM_DATA,
  type ScriptFormData,
  type Script,
} from '@/types';
import type { PageId } from '@/components/Sidebar';

interface GenerateScriptPageProps {
  onNavigate: (page: PageId) => void;
}

export default function GenerateScriptPage({ onNavigate }: GenerateScriptPageProps) {
  const { addScript } = useScripts();
  const { showToast } = useToast();
  const [formData, setFormData] = useState<ScriptFormData>(DEFAULT_FORM_DATA);
  const [generatedContent, setGeneratedContent] = useState('');
  const [generatedTitle, setGeneratedTitle] = useState('');
  const [generating, setGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleGenerate = () => {
    setGenerating(true);
    setGeneratedContent('');
    setSaved(false);
    setTimeout(() => {
      const result = generateScript(formData);
      setGeneratedContent(result.content);
      setGeneratedTitle(result.title);
      setGenerating(false);
      showToast('Script generated successfully!', 'success');
    }, 1200);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedContent);
    setCopied(true);
    showToast('Script copied to clipboard!', 'success');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSave = () => {
    if (!generatedContent.trim()) {
      showToast('Please generate or enter a script first.', 'error');
      return;
    }
    const script: Script = {
      id: `script-${Date.now()}`,
      title: generatedTitle || `${formData.eventName} — ${formData.announcementType}`,
      announcementType: formData.announcementType,
      collegeName: formData.collegeName,
      techFestName: formData.techFestName,
      eventName: formData.eventName,
      content: generatedContent,
      tone: formData.tone,
      language: formData.language,
      createdAt: new Date().toISOString(),
    };
    addScript(script);
    setSaved(true);
    showToast('Announcement saved to history!', 'success');
  };

  const wordCount = generatedContent.trim() ? generatedContent.trim().split(/\s+/).length : 0;
  const charCount = generatedContent.length;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold text-slate-900 dark:text-white mb-2">AI Script Generator</h1>
        <p className="text-slate-600 dark:text-slate-400">Tell AURA what you want to announce.</p>
      </div>

      {/* Form */}
      <div className="card p-6 space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">College Name</label>
            <input
              type="text"
              value={formData.collegeName}
              onChange={(e) => setFormData({ ...formData, collegeName: e.target.value })}
              className="input-field"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Tech Fest Name</label>
            <input
              type="text"
              value={formData.techFestName}
              onChange={(e) => setFormData({ ...formData, techFestName: e.target.value })}
              className="input-field"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Announcement Type</label>
            <select
              value={formData.announcementType}
              onChange={(e) => setFormData({ ...formData, announcementType: e.target.value as ScriptFormData['announcementType'] })}
              className="input-field cursor-pointer"
            >
              {ANNOUNCEMENT_TYPES.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Event Name</label>
            <input
              type="text"
              value={formData.eventName}
              onChange={(e) => setFormData({ ...formData, eventName: e.target.value })}
              placeholder="e.g., Coding Challenge"
              className="input-field"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Important Details</label>
          <textarea
            value={formData.details}
            onChange={(e) => setFormData({ ...formData, details: e.target.value })}
            placeholder="Enter the important information AURA should mention..."
            rows={3}
            className="input-field resize-none"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Tone</label>
            <div className="flex gap-2">
              {TONES.map((t) => (
                <button
                  key={t}
                  onClick={() => setFormData({ ...formData, tone: t })}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    formData.tone === t
                      ? 'bg-primary-500 text-white'
                      : 'bg-black/5 dark:bg-white/10 text-slate-600 dark:text-slate-400 hover:bg-black/10 dark:hover:bg-white/20'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Language</label>
            <select
              value={formData.language}
              onChange={(e) => setFormData({ ...formData, language: e.target.value as ScriptFormData['language'] })}
              className="input-field cursor-pointer"
            >
              {LANGUAGES.map((l) => (
                <option key={l} value={l}>{l}</option>
              ))}
            </select>
          </div>
        </div>

        <button onClick={handleGenerate} disabled={generating} className="btn-primary w-full text-base">
          {generating ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" /> AURA is crafting your announcement...
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5" /> Generate Script
            </>
          )}
        </button>
      </div>

      {/* Generated Script */}
      {generating && (
        <div className="card p-8 flex flex-col items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-primary-500/10 flex items-center justify-center animate-pulse-glow">
            <Sparkles className="w-8 h-8 text-primary-500 animate-pulse" />
          </div>
          <p className="text-slate-500 dark:text-slate-400">AURA is crafting your announcement...</p>
        </div>
      )}

      {!generating && generatedContent && (
        <div className="card p-6 space-y-4 animate-fade-in-up">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <h2 className="font-display text-xl font-semibold text-slate-900 dark:text-white">Your AI-Generated Script</h2>
            <div className="flex gap-4 text-xs text-slate-500 dark:text-slate-400">
              <span>{wordCount} words</span>
              <span>{charCount} characters</span>
            </div>
          </div>

          <textarea
            value={generatedContent}
            onChange={(e) => {
              setGeneratedContent(e.target.value);
              setSaved(false);
            }}
            rows={10}
            className="input-field resize-none font-sans leading-relaxed"
          />

          <div className="flex flex-wrap gap-2">
            <button onClick={handleGenerate} className="btn-secondary text-sm">
              <RefreshCw className="w-4 h-4" /> Regenerate
            </button>
            <button onClick={handleCopy} className="btn-secondary text-sm">
              {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />} Copy
            </button>
            <button onClick={handleSave} className="btn-secondary text-sm">
              {saved ? <Check className="w-4 h-4 text-emerald-500" /> : <Save className="w-4 h-4" />} Save
            </button>
            <button
              onClick={() => {
                handleSave();
                onNavigate('voice');
              }}
              className="btn-primary text-sm"
            >
              <Mic className="w-4 h-4" /> Generate Voice
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
