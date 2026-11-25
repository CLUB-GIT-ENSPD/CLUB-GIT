import React from 'react';
import { useApp } from '../../context/AppContext';
import { PWAInstallButton } from '../pwa/PWAInstallButton';
import { OfflineIndicator } from '../pwa/OfflineIndicator';
import {
  Home,
  FolderKanban,
  Trophy,
  LogIn,
  ArrowRight,
  Sun,
  Moon,
  CheckCircle2,
  AlertCircle,
  Info,
  LayoutDashboard,
} from 'lucide-react';

interface VisitorShellProps {
  children: React.ReactNode;
}

export const VisitorShell: React.FC<VisitorShellProps> = ({ children }) => {
  const {
    theme,
    toggleTheme,
    currentPath,
    navigate,
    isAuthenticated,
    currentUser,
    toast,
  } = useApp();

  const navItems = [
    { path: '/', label: 'Accueil', icon: <Home className="w-4 h-4" /> },
    { path: '/vitrine', label: 'Vitrine projets', icon: <FolderKanban className="w-4 h-4" /> },
    { path: '/gamification', label: 'Primes & Paliers', icon: <Trophy className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col overflow-x-clip">
      {/* Desktop & Mobile Top Navigation */}
      <header className="sticky top-0 z-30 border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md pt-safe">
        <div className="max-w-6xl mx-auto h-14 px-3 sm:px-6 flex items-center justify-between gap-2 min-w-0">
          {/* Brand */}
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 sm:gap-2.5 text-left focus:outline-none min-w-0"
          >
            <div className="w-8 h-8 rounded-lg bg-slate-900 dark:bg-white text-white dark:text-slate-950 flex items-center justify-center font-mono font-bold text-xs tracking-wider shrink-0">
              GIT
            </div>
            <div className="min-w-0">
              <div className="text-sm font-bold tracking-tight text-slate-900 dark:text-white leading-tight truncate">
                Club GIT
              </div>
              <div className="hidden min-[420px]:block text-[10px] text-slate-500 font-mono leading-tight truncate">
                ENSPD Douala
              </div>
            </div>
          </button>

          {/* Desktop Links */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map(item => {
              const active = currentPath === item.path;
              return (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    active
                      ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-semibold'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/50'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            <PWAInstallButton compact />

            <button
              onClick={toggleTheme}
              aria-label="Changer de thème"
              className="min-h-[36px] min-w-[36px] flex items-center justify-center rounded-lg border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
            </button>

            {isAuthenticated && currentUser ? (
              <button
                onClick={() => navigate('/dashboard')}
                className="min-h-[36px] px-2.5 sm:px-3 py-1.5 rounded-lg bg-slate-900 dark:bg-white text-white dark:text-slate-950 text-xs font-semibold flex items-center gap-1.5 hover:opacity-90 transition-opacity"
              >
                <LayoutDashboard className="w-3.5 h-3.5 shrink-0" />
                <span className="hidden sm:inline">Mon espace</span>
                <ArrowRight className="w-3.5 h-3.5 sm:hidden shrink-0" />
              </button>
            ) : (
              <>
                <button
                  onClick={() => navigate('/register')}
                  className="hidden sm:inline-flex min-h-[36px] items-center px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                >
                  Rejoindre
                </button>
                <button
                  onClick={() => navigate('/login')}
                  className="min-h-[36px] px-2.5 sm:px-3 py-1.5 rounded-lg bg-slate-900 dark:bg-white text-white dark:text-slate-950 text-xs font-semibold inline-flex items-center gap-1.5 hover:opacity-90 transition-opacity"
                >
                  <LogIn className="w-3.5 h-3.5 shrink-0" />
                  <span>Connexion</span>
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Main Public Content */}
      <main className="flex-1 pb-20 md:pb-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
          {children}
        </div>
      </main>

      {/* Sober Desktop Footer */}
      <footer className="hidden md:block border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-5">
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between text-xs text-slate-500">
          <span className="font-mono">Club Génie Informatique & Télécoms · ENSPD Douala</span>
          <div className="flex items-center gap-4">
            <button onClick={() => navigate('/vitrine')} className="hover:text-slate-900 dark:hover:text-white">
              Vitrine
            </button>
            <button onClick={() => navigate('/gamification')} className="hover:text-slate-900 dark:hover:text-white">
              Primes
            </button>
            <button onClick={() => navigate('/register')} className="hover:text-slate-900 dark:hover:text-white">
              Inscription
            </button>
          </div>
        </div>
      </footer>

      {/* Mobile Fixed Bottom Navigation (56px, Consultant space) */}
      <nav
        aria-label="Navigation visiteur"
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 border-t border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md pb-safe"
      >
        <div className="grid grid-cols-4 h-14">
          <button
            onClick={() => navigate('/')}
            className={`flex flex-col items-center justify-center gap-0.5 text-[10px] font-medium ${
              currentPath === '/' ? 'text-indigo-600 dark:text-indigo-400 font-semibold' : 'text-slate-500 dark:text-slate-400'
            }`}
          >
            <Home className="w-5 h-5" />
            <span>Accueil</span>
          </button>

          <button
            onClick={() => navigate('/vitrine')}
            className={`flex flex-col items-center justify-center gap-0.5 text-[10px] font-medium ${
              currentPath === '/vitrine' ? 'text-indigo-600 dark:text-indigo-400 font-semibold' : 'text-slate-500 dark:text-slate-400'
            }`}
          >
            <FolderKanban className="w-5 h-5" />
            <span>Vitrine</span>
          </button>

          <button
            onClick={() => navigate('/gamification')}
            className={`flex flex-col items-center justify-center gap-0.5 text-[10px] font-medium ${
              currentPath === '/gamification' ? 'text-indigo-600 dark:text-indigo-400 font-semibold' : 'text-slate-500 dark:text-slate-400'
            }`}
          >
            <Trophy className="w-5 h-5" />
            <span>Primes</span>
          </button>

          <button
            onClick={() => navigate(isAuthenticated ? '/dashboard' : '/login')}
            className={`flex flex-col items-center justify-center gap-0.5 text-[10px] font-medium ${
              currentPath === '/login' || currentPath === '/register'
                ? 'text-indigo-600 dark:text-indigo-400 font-semibold'
                : 'text-slate-500 dark:text-slate-400'
            }`}
          >
            {isAuthenticated ? <LayoutDashboard className="w-5 h-5" /> : <LogIn className="w-5 h-5" />}
            <span>{isAuthenticated ? 'Espace' : 'Connexion'}</span>
          </button>
        </div>
      </nav>

      {/* Toast */}
      {toast && (
        <div
          role="status"
          className="fixed bottom-18 md:bottom-5 right-4 left-4 sm:left-auto sm:max-w-sm z-50 flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-medium text-slate-800 dark:text-slate-100 shadow-lg"
        >
          {toast.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />}
          {toast.type === 'warning' && <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />}
          {toast.type === 'info' && <Info className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />}
          <span>{toast.message}</span>
        </div>
      )}

      <OfflineIndicator />
    </div>
  );
};
