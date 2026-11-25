import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Role } from '../../types';
import { PWAInstallButton } from '../pwa/PWAInstallButton';
import { OfflineIndicator } from '../pwa/OfflineIndicator';
import { Avatar } from '../ui/Avatar';
import {
  Home,
  FolderKanban,
  CheckSquare,
  QrCode,
  MessageSquare,
  Trophy,
  Calendar,
  Shield,
  Users,
  Sun,
  Moon,
  MoreHorizontal,
  LogOut,
  UserCheck,
  BarChart3,
  Globe,
  FileWarning,
  X,
  ChevronRight,
  CheckCircle2,
  AlertCircle,
  Info,
} from 'lucide-react';

interface NavLinkItem {
  path: string;
  label: string;
  shortLabel?: string;
  icon: React.ReactNode;
  badge?: number;
}

interface AppShellProps {
  children: React.ReactNode;
}

export const AppShell: React.FC<AppShellProps> = ({ children }) => {
  const {
    theme,
    toggleTheme,
    currentPath,
    navigate,
    currentUser,
    logout,
    adminInscriptions,
    toast,
  } = useApp();

  const [isMoreSheetOpen, setIsMoreSheetOpen] = useState(false);
  const [isProfileSheetOpen, setIsProfileSheetOpen] = useState(false);

  if (!currentUser) return null;

  const role = currentUser.role;
  const isAdmin = role === 'admin';
  const isCenseur = role === 'censeur';
  const isCenseurOrAdmin = isCenseur || isAdmin;

  const roleLabels: Record<Role, string> = {
    membre: 'Membre',
    chef_projet: 'Chef de projet',
    censeur: 'Censeur',
    admin: 'Administrateur',
  };

  // 1. Espace Utilisateur Connecté
  const memberNavItems: NavLinkItem[] = [
    { path: '/dashboard', label: 'Tableau de bord', shortLabel: 'Accueil', icon: <Home className="w-4 h-4" /> },
    { path: '/projects', label: 'Projets du club', shortLabel: 'Projets', icon: <FolderKanban className="w-4 h-4" /> },
    ...(!isCenseur
      ? [{ path: '/mes-taches', label: 'Tâches du sprint', shortLabel: 'Tâches', icon: <CheckSquare className="w-4 h-4" /> }]
      : []),
    ...(!isCenseurOrAdmin
      ? [{ path: '/presences', label: 'Présences QR', shortLabel: 'Scan QR', icon: <QrCode className="w-4 h-4" /> }]
      : []),
    ...(!isCenseur
      ? [
          { path: '/scores', label: 'Classement & Primes', shortLabel: 'Scores', icon: <Trophy className="w-4 h-4" /> },
          { path: '/evenements', label: 'Événements', shortLabel: 'Événements', icon: <Calendar className="w-4 h-4" /> },
        ]
      : []),
    { path: '/forum', label: 'Forum technique', shortLabel: 'Forum', icon: <MessageSquare className="w-4 h-4" /> },
    ...(!isCenseurOrAdmin
      ? [{ path: '/mon-dossier', label: 'Mon dossier', shortLabel: 'Dossier', icon: <FileWarning className="w-4 h-4" /> }]
      : []),
  ];

  // 2. Espace Censeur (Censeur & Admin uniquement)
  const censeurNavItems: NavLinkItem[] = isCenseurOrAdmin
    ? [
        { path: '/censeur/qrcodes', label: 'Séances & QR Codes', shortLabel: 'QR Séance', icon: <QrCode className="w-4 h-4" /> },
        { path: '/censeur/infractions', label: 'Registre disciplinaire', shortLabel: 'Discipline', icon: <Shield className="w-4 h-4" /> },
        ...(isCenseur
          ? [{ path: '/censeur/membres', label: 'Annuaire membres', shortLabel: 'Annuaire', icon: <Users className="w-4 h-4" /> }]
          : []),
      ]
    : [];

  // 3. Espace Administration (Admin strict uniquement)
  const adminNavItems: NavLinkItem[] = isAdmin
    ? [
        {
          path: '/admin/inscriptions',
          label: 'Inscriptions',
          shortLabel: 'Inscriptions',
          icon: <UserCheck className="w-4 h-4" />,
          badge: adminInscriptions.length > 0 ? adminInscriptions.length : undefined,
        },
        { path: '/admin/utilisateurs', label: 'Utilisateurs & Rôles', shortLabel: 'Utilisateurs', icon: <Users className="w-4 h-4" /> },
        { path: '/admin/statistiques', label: 'Statistiques', shortLabel: 'Stats', icon: <BarChart3 className="w-4 h-4" /> },
      ]
    : [];

  const allPermittedItems = [...memberNavItems, ...censeurNavItems, ...adminNavItems];

  const pageTitles: Record<string, string> = {
    '/dashboard': 'Tableau de bord',
    '/projects': 'Projets du club',
    '/mes-taches': 'Tâches du sprint',
    '/presences': 'Présences QR',
    '/scores': 'Classement & Primes',
    '/evenements': 'Événements',
    '/forum': 'Forum technique',
    '/mon-dossier': 'Mon dossier disciplinaire',
    '/censeur/qrcodes': 'Séances & QR Codes',
    '/censeur/infractions': 'Registre disciplinaire',
    '/censeur/membres': 'Annuaire des membres',
    '/admin/inscriptions': 'Validation des inscriptions',
    '/admin/utilisateurs': 'Gestion des utilisateurs',
    '/admin/statistiques': 'Statistiques du club',
  };

  // Mobile bottom nav: pick 4 role-appropriate primary items + "Plus"
  const mobilePrimaryPaths = isAdmin
    ? ['/dashboard', '/admin/inscriptions', '/admin/utilisateurs', '/admin/statistiques']
    : isCenseur
    ? ['/dashboard', '/censeur/qrcodes', '/censeur/infractions', '/censeur/membres']
    : ['/dashboard', '/projects', '/mes-taches', '/presences'];

  const mobilePrimaryItems = mobilePrimaryPaths
    .map(p => allPermittedItems.find(i => i.path === p))
    .filter((i): i is NavLinkItem => Boolean(i));

  const mobileSecondaryItems = allPermittedItems.filter(
    i => !mobilePrimaryPaths.includes(i.path)
  );
  const isMoreActive = mobileSecondaryItems.some(i => i.path === currentPath);

  const handleNav = (path: string) => {
    navigate(path);
    setIsMoreSheetOpen(false);
  };

  const renderNavSection = (title: string | null, items: NavLinkItem[]) => {
    if (items.length === 0) return null;
    return (
      <div className="space-y-1">
        {title && (
          <div className="px-3 pt-3 pb-1 text-[10px] font-mono font-semibold uppercase tracking-wider text-slate-400">
            {title}
          </div>
        )}
        {items.map(item => {
          const active = currentPath === item.path;
          return (
            <button
              key={item.path}
              onClick={() => handleNav(item.path)}
              className={`w-full flex items-center justify-between gap-2 px-3 py-2.5 rounded-lg text-xs font-medium transition-colors ${
                active
                  ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <span className="flex items-center gap-3 min-w-0">
                <span className={active ? 'text-indigo-600 dark:text-indigo-400 shrink-0' : 'text-slate-400 shrink-0'}>
                  {item.icon}
                </span>
                <span className="truncate">{item.label}</span>
              </span>
              {item.badge !== undefined && (
                <span className="px-1.5 py-0.5 rounded-md bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 font-mono text-[10px] font-bold tabular-nums">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col lg:flex-row overflow-x-clip">
      {/* Desktop Left Sidebar */}
      <aside className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 z-30">
        {/* Brand */}
        <div className="h-14 px-5 flex items-center justify-between border-b border-slate-200 dark:border-slate-800">
          <button
            onClick={() => handleNav('/dashboard')}
            className="flex items-center gap-2.5 text-left focus:outline-none"
          >
            <div className="w-8 h-8 rounded-lg bg-slate-900 dark:bg-white text-white dark:text-slate-950 flex items-center justify-center font-mono font-bold text-xs tracking-wider">
              GIT
            </div>
            <div>
              <div className="text-sm font-bold tracking-tight text-slate-900 dark:text-white leading-tight">
                Club GIT
              </div>
              <div className="text-[11px] text-slate-500 font-mono leading-tight">
                ENSPD Douala
              </div>
            </div>
          </button>
        </div>

        {/* Role-Separated Navigation Links */}
        <nav className="flex-1 overflow-y-auto px-3 py-3 space-y-2">
          {renderNavSection(null, memberNavItems)}
          {renderNavSection('Discipline & Censeur', censeurNavItems)}
          {renderNavSection('Administration', adminNavItems)}

          <div className="pt-3 mt-3 border-t border-slate-100 dark:border-slate-800">
            <button
              onClick={() => handleNav('/vitrine')}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors"
            >
              <Globe className="w-4 h-4 text-slate-400" />
              <span>Vitrine publique</span>
            </button>
          </div>
        </nav>

        {/* Sidebar Footer */}
        <div className="p-3 border-t border-slate-200 dark:border-slate-800 space-y-2.5">
          <PWAInstallButton />

          <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2">
            <div className="flex items-center gap-2.5">
              <Avatar name={currentUser.name} size="sm" />
              <div className="min-w-0 flex-1">
                <div className="text-xs font-semibold text-slate-900 dark:text-white truncate">
                  {currentUser.name}
                </div>
                <div className="text-[11px] text-slate-500 font-mono truncate">
                  {roleLabels[currentUser.role]} · {currentUser.points} pts
                </div>
              </div>
              <button
                onClick={toggleTheme}
                aria-label="Changer de thème"
                className="p-1.5 rounded-md text-slate-500 hover:bg-slate-200/70 dark:hover:bg-slate-800 transition-colors"
              >
                {theme === 'dark' ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5" />}
              </button>
            </div>

            <button
              onClick={logout}
              className="w-full min-h-[34px] px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-[11px] font-medium text-slate-700 dark:text-slate-300 hover:text-rose-600 dark:hover:text-rose-400 hover:border-rose-200 dark:hover:border-rose-900/60 flex items-center justify-center gap-1.5 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Déconnexion</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Column */}
      <div className="flex-1 lg:pl-64 flex flex-col min-h-screen min-w-0">
        {/* Mobile Compact Top App Bar (48px) */}
        <header className="lg:hidden sticky top-0 z-30 border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md pt-safe">
          <div className="h-12 px-3 sm:px-4 flex items-center justify-between gap-2 min-w-0">
            <button
              onClick={() => handleNav('/dashboard')}
              className="flex items-center gap-2 min-w-0 flex-1 text-left"
            >
              <span className="w-7 h-7 rounded-md bg-slate-900 dark:bg-white text-white dark:text-slate-950 flex items-center justify-center font-mono font-bold text-[10px] shrink-0">
                GIT
              </span>
              <span className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                {pageTitles[currentPath] || 'Espace membre'}
              </span>
            </button>

            <div className="flex items-center gap-1.5 shrink-0">
              <PWAInstallButton compact />
              <button
                onClick={() => setIsProfileSheetOpen(true)}
                className="min-h-[36px] min-w-[36px] flex items-center justify-center rounded-full"
                aria-label="Profil et déconnexion"
              >
                <Avatar name={currentUser.name} size="sm" />
              </button>
            </div>
          </div>
        </header>

        {/* Desktop Minimal Top Bar */}
        <header className="hidden lg:flex sticky top-0 z-20 h-14 px-8 border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md items-center justify-between">
          <div className="flex items-center gap-2 text-sm">
            <h1 className="font-semibold text-slate-900 dark:text-white">
              {pageTitles[currentPath] || 'Espace Club GIT'}
            </h1>
            <span className="text-slate-300 dark:text-slate-700">/</span>
            <span className="text-xs text-slate-500 font-mono">
              {roleLabels[currentUser.role]}
            </span>
          </div>

          <div className="flex items-center gap-4 text-xs text-slate-600 dark:text-slate-300">
            <span className="font-mono tabular-nums">
              {currentUser.matricule} · {currentUser.points} pts · {currentUser.attendanceRate}% assiduité
            </span>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 pb-20 lg:pb-10">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-6">
            {children}
          </div>
        </main>
      </div>

      {/* Mobile Fixed Bottom Tab Bar (56px height) */}
      <nav
        aria-label="Navigation principale"
        className="lg:hidden fixed bottom-0 left-0 right-0 z-40 border-t border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md pb-safe"
      >
        <div className="grid grid-cols-5 h-14">
          {mobilePrimaryItems.map(item => {
            const active = currentPath === item.path;
            return (
              <button
                key={item.path}
                onClick={() => handleNav(item.path)}
                className={`relative flex flex-col items-center justify-center gap-0.5 text-[10px] font-medium transition-colors ${
                  active
                    ? 'text-indigo-600 dark:text-indigo-400 font-semibold'
                    : 'text-slate-500 dark:text-slate-400'
                }`}
              >
                <span className="[&>svg]:w-5 [&>svg]:h-5">{item.icon}</span>
                <span className="truncate max-w-[64px]">{item.shortLabel || item.label}</span>
              </button>
            );
          })}

          <button
            onClick={() => setIsMoreSheetOpen(true)}
            className={`flex flex-col items-center justify-center gap-0.5 text-[10px] font-medium transition-colors ${
              isMoreActive || isMoreSheetOpen
                ? 'text-indigo-600 dark:text-indigo-400 font-semibold'
                : 'text-slate-500 dark:text-slate-400'
            }`}
          >
            <MoreHorizontal className="w-5 h-5" />
            <span>Plus</span>
          </button>
        </div>
      </nav>

      {/* Mobile "Plus" Bottom Sheet */}
      {isMoreSheetOpen && (
        <div
          className="lg:hidden fixed inset-0 z-50 flex items-end bg-slate-950/50 backdrop-blur-xs"
          onClick={() => setIsMoreSheetOpen(false)}
        >
          <div
            className="w-full rounded-t-2xl bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 p-4 pb-8 space-y-2 max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-10 h-1 bg-slate-300 dark:bg-slate-700 rounded-full mx-auto mb-3" />
            <div className="flex items-center justify-between px-2 pb-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Navigation ({roleLabels[currentUser.role]})
              </span>
              <button
                onClick={() => setIsMoreSheetOpen(false)}
                className="min-h-[36px] min-w-[36px] flex items-center justify-center text-slate-400"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {mobileSecondaryItems.map(item => (
              <button
                key={item.path}
                onClick={() => handleNav(item.path)}
                className={`w-full min-h-[48px] px-3 rounded-xl flex items-center justify-between text-sm font-medium transition-colors ${
                  currentPath === item.path
                    ? 'bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400'
                    : 'text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center gap-3">
                  {item.icon}
                  <span>{item.label}</span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </button>
            ))}

            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-1">
              <button
                onClick={() => handleNav('/vitrine')}
                className="w-full min-h-[48px] px-3 rounded-xl flex items-center justify-between text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800"
              >
                <div className="flex items-center gap-3">
                  <Globe className="w-4 h-4 text-slate-400" />
                  <span>Vitrine publique</span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </button>

              <button
                onClick={() => {
                  setIsMoreSheetOpen(false);
                  logout();
                }}
                className="w-full min-h-[48px] px-3 rounded-xl flex items-center justify-between text-sm font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50/60 dark:hover:bg-rose-950/30"
              >
                <div className="flex items-center gap-3">
                  <LogOut className="w-4 h-4" />
                  <span>Déconnexion</span>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Profile Sheet */}
      {isProfileSheetOpen && (
        <div
          className="lg:hidden fixed inset-0 z-50 flex items-end bg-slate-950/50 backdrop-blur-xs"
          onClick={() => setIsProfileSheetOpen(false)}
        >
          <div
            className="w-full rounded-t-2xl bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 p-5 pb-8 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-10 h-1 bg-slate-300 dark:bg-slate-700 rounded-full mx-auto" />

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar name={currentUser.name} size="md" />
                <div>
                  <div className="text-sm font-bold text-slate-900 dark:text-white">
                    {currentUser.name}
                  </div>
                  <div className="text-xs text-slate-500 font-mono">
                    {roleLabels[currentUser.role]} · {currentUser.matricule} · {currentUser.points} pts
                  </div>
                </div>
              </div>
              <button
                onClick={toggleTheme}
                aria-label="Changer de thème"
                className="min-h-[44px] min-w-[44px] rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-center text-slate-700 dark:text-slate-200"
              >
                {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
              </button>
            </div>

            <PWAInstallButton />

            <button
              onClick={() => {
                setIsProfileSheetOpen(false);
                logout();
              }}
              className="w-full min-h-[44px] rounded-xl border border-rose-200 dark:border-rose-900/60 text-rose-600 dark:text-rose-400 text-xs font-semibold flex items-center justify-center gap-2 hover:bg-rose-50 dark:hover:bg-rose-950/30"
            >
              <LogOut className="w-4 h-4" />
              <span>Se déconnecter</span>
            </button>
          </div>
        </div>
      )}

      {/* Sober Toast Notification */}
      {toast && (
        <div
          role="status"
          className="fixed bottom-18 lg:bottom-5 right-4 left-4 sm:left-auto sm:max-w-sm z-50 flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-medium text-slate-800 dark:text-slate-100 shadow-lg"
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
