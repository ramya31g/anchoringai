import { useState, useMemo } from 'react';
import { Search, Plus, FileText, Edit, Play, Trash2 } from 'lucide-react';
import { useScripts } from '@/context/ScriptContext';
import { useToast } from '@/context/ToastContext';
import AnnouncementCard from '@/components/AnnouncementCard';
import { isSpeechSupported, speak as ttsSpeak, stop as ttsStop } from '@/services/ttsService';
import { DEFAULT_VOICE_SETTINGS, type Script } from '@/types';
import type { PageId } from '@/components/Sidebar';

interface HistoryPageProps {
  onNavigate: (page: PageId) => void;
}

const FILTERS = ['All', 'Welcome', 'Competition', 'Winner', 'Inauguration', 'Closing', 'Custom'] as const;
type Filter = (typeof FILTERS)[number];

export default function HistoryPage({ onNavigate }: HistoryPageProps) {
  const { scripts, removeScript } = useScripts();
  const { showToast } = useToast();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<Filter>('All');
  const [viewing, setViewing] = useState<Script | null>(null);

  const filtered = useMemo(() => {
    return scripts.filter((s) => {
      const matchesSearch =
        s.title.toLowerCase().includes(search.toLowerCase()) ||
        s.content.toLowerCase().includes(search.toLowerCase()) ||
        s.eventName.toLowerCase().includes(search.toLowerCase());

      if (!matchesSearch) return false;
      if (filter === 'All') return true;
      if (filter === 'Welcome') return s.announcementType === 'Welcome Speech';
      if (filter === 'Competition') return s.announcementType === 'Competition Announcement';
      if (filter === 'Winner') return s.announcementType === 'Winner Announcement';
      if (filter === 'Inauguration') return s.announcementType === 'Inauguration';
      if (filter === 'Closing') return s.announcementType === 'Closing Ceremony';
      if (filter === 'Custom') return s.announcementType === 'Custom Announcement';
      return true;
    });
  }, [scripts, search, filter]);

  const handlePlay = async (script: Script) => {
    if (!isSpeechSupported()) {
      showToast('Voice generation is not supported by this browser. Please use Google Chrome or another modern browser.', 'error');
      return;
    }
    showToast('Playing announcement...', 'info');
    await ttsSpeak(script.content, DEFAULT_VOICE_SETTINGS);
  };

  const handleDelete = (id: string) => {
    removeScript(id);
    showToast('Announcement deleted.', 'success');
    if (viewing?.id === id) setViewing(null);
  };

  const handleEdit = (script: Script) => {
    setViewing(script);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold text-slate-900 dark:text-white mb-1">Announcement History</h1>
          <p className="text-slate-600 dark:text-slate-400">Your saved AURA announcements.</p>
        </div>
        <button onClick={() => onNavigate('generate')} className="btn-primary text-sm">
          <Plus className="w-4 h-4" /> New Announcement
        </button>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search announcements..."
            className="input-field pl-11"
          />
        </div>
      </div>

      <div className="flex gap-2 flex-wrap">
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
              filter === f
                ? 'bg-primary-500 text-white'
                : 'bg-black/5 dark:bg-white/10 text-slate-600 dark:text-slate-400 hover:bg-black/10 dark:hover:bg-white/20'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Empty state */}
      {filtered.length === 0 ? (
        <div className="card p-12 text-center">
          <FileText className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
          <p className="text-slate-500 dark:text-slate-400 mb-1">Your AURA history is empty.</p>
          <p className="text-sm text-slate-400 dark:text-slate-500 mb-6">Create your first announcement to get started.</p>
          <button onClick={() => onNavigate('generate')} className="btn-primary">
            <Plus className="w-4 h-4" /> Create Your First Announcement
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((script) => (
            <AnnouncementCard
              key={script.id}
              script={script}
              onOpen={(s) => setViewing(s)}
              onEdit={handleEdit}
              onPlay={handlePlay}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {/* View/Edit modal */}
      {viewing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={() => setViewing(null)}>
          <div className="card p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display text-xl font-semibold text-slate-900 dark:text-white">{viewing.title}</h2>
              <button onClick={() => setViewing(null)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xl">&times;</button>
            </div>
            <div className="flex flex-wrap gap-2 mb-4 text-xs">
              <span className="px-2 py-1 rounded-full bg-primary-500/10 text-primary-600 dark:text-primary-400">{viewing.announcementType}</span>
              <span className="px-2 py-1 rounded-full bg-accent-500/10 text-accent-600 dark:text-accent-400">{viewing.tone}</span>
              <span className="px-2 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">{viewing.eventName}</span>
            </div>
            <textarea
              value={viewing.content}
              onChange={(e) => setViewing({ ...viewing, content: e.target.value })}
              rows={10}
              className="input-field resize-none mb-4 leading-relaxed"
            />
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => {
                  ttsStop();
                  handlePlay(viewing);
                }}
                className="btn-primary text-sm"
              >
                <Play className="w-4 h-4" /> Play
              </button>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(viewing.content);
                  showToast('Script copied to clipboard!', 'success');
                }}
                className="btn-secondary text-sm"
              >
                <FileText className="w-4 h-4" /> Copy
              </button>
              <button
                onClick={() => {
                  setViewing(null);
                  onNavigate('generate');
                }}
                className="btn-secondary text-sm"
              >
                <Edit className="w-4 h-4" /> Edit in Generator
              </button>
              <button
                onClick={() => {
                  if (confirm('Are you sure you want to delete this announcement?')) {
                    handleDelete(viewing.id);
                  }
                }}
                className="btn-danger text-sm"
              >
                <Trash2 className="w-4 h-4" /> Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
