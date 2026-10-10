import { FileText, Mic, Save, Calendar } from 'lucide-react';

interface DashboardStatsProps {
  scriptsGenerated: number;
  voiceAnnouncements: number;
  savedAnnouncements: number;
}

export default function DashboardStats({ scriptsGenerated, voiceAnnouncements, savedAnnouncements }: DashboardStatsProps) {
  const stats = [
    { label: 'Scripts Generated', value: scriptsGenerated, icon: FileText, color: 'text-primary-500', bg: 'bg-primary-500/10 dark:bg-primary-500/20' },
    { label: 'Voice Announcements', value: voiceAnnouncements, icon: Mic, color: 'text-accent-500', bg: 'bg-accent-500/10 dark:bg-accent-500/20' },
    { label: 'Saved Announcements', value: savedAnnouncements, icon: Save, color: 'text-emerald-500', bg: 'bg-emerald-500/10 dark:bg-emerald-500/20' },
    { label: 'Event', value: 'Tech Fest 2026', icon: Calendar, color: 'text-amber-500', bg: 'bg-amber-500/10 dark:bg-amber-500/20' },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <div key={stat.label} className="card p-5">
          <div className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center mb-3`}>
            <stat.icon className={`w-5 h-5 ${stat.color}`} />
          </div>
          <p className="text-2xl font-display font-bold text-slate-900 dark:text-white">{stat.value}</p>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{stat.label}</p>
        </div>
      ))}
    </div>
  );
}
