import { useState } from 'react';
import { ThemeProvider } from '@/context/ThemeContext';
import { ToastProvider } from '@/context/ToastContext';
import { ScriptProvider } from '@/context/ScriptContext';
import Sidebar, { type PageId } from '@/components/Sidebar';
import Navbar from '@/components/Navbar';
import HomePage from '@/pages/HomePage';
import GenerateScriptPage from '@/pages/GenerateScriptPage';
import VoiceStudioPage from '@/pages/VoiceStudioPage';
import LiveAnchorPage from '@/pages/LiveAnchorPage';
import HistoryPage from '@/pages/HistoryPage';
import SettingsPage from '@/pages/SettingsPage';

function AppContent() {
  const [currentPage, setCurrentPage] = useState<PageId>('home');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const handleNavigate = (page: PageId) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      <Sidebar
        currentPage={currentPage}
        onNavigate={handleNavigate}
        mobileOpen={mobileSidebarOpen}
        onCloseMobile={() => setMobileSidebarOpen(false)}
      />

      <div className="flex-1 flex flex-col min-w-0">
        <Navbar onOpenMobile={() => setMobileSidebarOpen(true)} onNavigate={handleNavigate} />

        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          {currentPage === 'home' && <HomePage onNavigate={handleNavigate} />}
          {currentPage === 'generate' && <GenerateScriptPage onNavigate={handleNavigate} />}
          {currentPage === 'voice' && <VoiceStudioPage />}
          {currentPage === 'live' && <LiveAnchorPage />}
          {currentPage === 'history' && <HistoryPage onNavigate={handleNavigate} />}
          {currentPage === 'settings' && <SettingsPage />}
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <ScriptProvider>
          <AppContent />
        </ScriptProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}
