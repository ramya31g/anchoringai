import { FileText, Mic, Radio, Trash2, Play, Edit } from 'lucide-react';
import type { Script } from '@/types';

interface AnnouncementCardProps {
  script: Script;
  onOpen: (script: Script) => void;
  onEdit: (script: Script) => void;
  onPlay: (script: Script) => void;
  onDelete: (id: string) => void;
}

export default function AnnouncementCard({ script, onOpen, onEdit, onPlay, onDelete }: AnnouncementCardProps) {
  return (
    <div className="card p-5 hover:shadow-lg transition-all duration-200 group">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-slate-900 dark:text-white truncate">{script.title}</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{script.announcementType}</p>
        </div>
        <span className="text-xs px-2 py-1 rounded-full bg-primary-500/10 text-primary-600 dark:text-primary-400 flex-shrink-0 ml-2">
          {script.tone}
        </span>
      </div>

      <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">{script.eventName}</p>
      <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2 mb-4">{script.content}</p>
      <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">
        {new Date(script.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
      </p>

      <div className="flex items-center gap-2">
        <button onClick={() => onOpen(script)} className="btn-ghost text-xs flex-1">
          <FileText className="w-4 h-4" /> Open
        </button>
        <button onClick={() => onEdit(script)} className="btn-ghost text-xs">
          <Edit className="w-4 h-4" />
        </button>
        <button onClick={() => onPlay(script)} className="btn-ghost text-xs text-accent-500">
          <Play className="w-4 h-4" />
        </button>
        <button
          onClick={() => {
            if (confirm('Are you sure you want to delete this announcement?')) onDelete(script.id);
          }}
          className="btn-ghost text-xs text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
