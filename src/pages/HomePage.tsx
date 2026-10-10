import { FileText, Mic, Radio, Sparkles, ArrowRight } from 'lucide-react';
import AURAOrb from '@/components/AURAOrb';
import Waveform from '@/components/Waveform';
import DashboardStats from '@/components/DashboardStats';
import { useScripts } from '@/context/ScriptContext';
import type { PageId } from '@/components/Sidebar';

interface HomePageProps {
  onNavigate: (page: PageId) => void;
}

export default function HomePage({ onNavigate }: HomePageProps) {
  const { scripts } = useScripts();

  return (
    <div className="space-y-8">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-50 to-primary-50 dark:from-slate-900 dark:to-primary-950/50 border border-black/5 dark:border-white/10 p-8 sm:p-12">
        <div className="absolute inset-0 bg-grid opacity-50" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl animate-pulse-glow" />
        <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-accent-500/10 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: '1s' }} />

        <div className="relative flex flex-col lg:flex-row items-center gap-8">
          <div className="flex-1 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass mb-6 animate-fade-in">
              <Sparkles className="w-3.5 h-3.5 text-primary-500" />
              <span className="text-xs font-medium text-slate-600 dark:text-slate-300">AI POWERED • TECH FEST 2026</span>
            </div>
            <h1 className="font-display text-4xl sm:text-5xl font-bold text-slate-900 dark:text-white mb-4 animate-fade-in-up">
              Meet AURA — Your <span className="text-gradient">AI Voice Anchor</span>
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-400 mb-8 max-w-xl animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
              Generate event scripts, transform them into AI voice, and let AURA take the stage.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              <button onClick={() => onNavigate('generate')} className="btn-primary">
                <Sparkles className="w-5 h-5" /> Create Announcement
              </button>
              <button onClick={() => onNavigate('live')} className="btn-secondary">
                <Radio className="w-5 h-5" /> Live Anchor
              </button>
            </div>
          </div>

          <div className="flex flex-col items-center gap-4">
            <AURAOrb state="idle" size="lg" />
            <Waveform active={false} bars={20} />
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400 px-3 py-1 rounded-full glass">
              AI Voice Anchor
            </span>
          </div>
        </div>
      </section>

      {/* Dashboard Welcome */}
      <section>
        <div className="mb-6">
          <h2 className="font-display text-2xl font-bold text-slate-900 dark:text-white">
            Welcome to AURA
          </h2>
          <p className="text-slate-600 dark:text-slate-400 mt-1">Ready to take the stage?</p>
        </div>

        <DashboardStats
          scriptsGenerated={scripts.length}
          voiceAnnouncements={Math.floor(scripts.length * 0.6)}
          savedAnnouncements={scripts.length}
        />
      </section>

      {/* Quick Actions */}
      <section>
        <h2 className="font-display text-xl font-semibold text-slate-900 dark:text-white mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => onNavigate('generate')}
            className="card p-6 text-left hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group"
          >
            <div className="w-12 h-12 rounded-xl bg-primary-500/10 dark:bg-primary-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200">
              <FileText className="w-6 h-6 text-primary-500" />
            </div>
            <h3 className="font-display font-semibold text-lg text-slate-900 dark:text-white mb-1">Generate Script</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">Generate a new AI announcement.</p>
            <div className="flex items-center gap-1 mt-3 text-primary-500 text-sm font-medium">
              Get started <ArrowRight className="w-4 h-4" />
            </div>
          </button>

          <button
            onClick={() => onNavigate('voice')}
            className="card p-6 text-left hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group"
          >
            <div className="w-12 h-12 rounded-xl bg-accent-500/10 dark:bg-accent-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200">
              <Mic className="w-6 h-6 text-accent-500" />
            </div>
            <h3 className="font-display font-semibold text-lg text-slate-900 dark:text-white mb-1">Voice Studio</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">Convert a script into speech.</p>
            <div className="flex items-center gap-1 mt-3 text-accent-500 text-sm font-medium">
              Open studio <ArrowRight className="w-4 h-4" />
            </div>
          </button>

          <button
            onClick={() => onNavigate('live')}
            className="card p-6 text-left hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group"
          >
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 dark:bg-emerald-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200">
              <Radio className="w-6 h-6 text-emerald-500" />
            </div>
            <h3 className="font-display font-semibold text-lg text-slate-900 dark:text-white mb-1">Live Anchor</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">Let AURA speak on stage.</p>
            <div className="flex items-center gap-1 mt-3 text-emerald-500 text-sm font-medium">
              Go live <ArrowRight className="w-4 h-4" />
            </div>
          </button>
        </div>
      </section>
    </div>
  );
}
