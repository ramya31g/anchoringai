import { Menu, Sparkles } from 'lucide-react';
import ThemeToggle from '@/components/ThemeToggle';
import type { PageId } from '@/components/Sidebar';

interface NavbarProps {
  onOpenMobile: () => void;
  onNavigate: (page: PageId) => void;
}

export default function Navbar({ onOpenMobile, onNavigate }: NavbarProps) {
  return (
    <header className="sticky top-0 z-30 glass-strong">
      <div className="flex items-center justify-between px-4 sm:px-6 h-16">
        <div className="flex items-center gap-3">
          <button onClick={onOpenMobile} className="lg:hidden p-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/10">
            <Menu className="w-5 h-5 text-slate-700 dark:text-slate-300" />
          </button>
          <div className="flex items-center gap-2 lg:hidden">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="font-display font-bold text-lg text-slate-900 dark:text-white">AURA</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <button onClick={() => onNavigate('live')} className="btn-primary text-sm">
            Start Anchoring
          </button>
        </div>
      </div>
    </header>
  );
}
