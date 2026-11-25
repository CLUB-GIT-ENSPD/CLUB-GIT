import React, { useEffect } from 'react';
import { AppProvider, useApp, PUBLIC_ROUTES } from './context/AppContext';
import { VisitorShell } from './components/visitor/VisitorShell';
import { VisitorHomePage } from './components/visitor/VisitorHomePage';
import { VisitorShowcasePage } from './components/visitor/VisitorShowcasePage';
import { VisitorGamificationPage } from './components/visitor/VisitorGamificationPage';
import { LoginPage } from './components/auth/LoginPage';
import { RegisterPage } from './components/auth/RegisterPage';
import { AppShell } from './components/layout/AppShell';
import { HomeView } from './components/dashboard/HomeView';
import { ProjectsShowcase } from './components/public/ProjectsShowcase';
import { KanbanBoard } from './components/dashboard/KanbanBoard';
import { AttendanceQrManager } from './components/dashboard/AttendanceQrManager';
import { ForumView } from './components/dashboard/ForumView';
import { RankingAndRewardsView } from './components/dashboard/RankingAndRewardsView';
import { EventsSection } from './components/public/EventsSection';
import { InfractionsManager } from './components/dashboard/InfractionsManager';
import { AdminUsersManager } from './components/dashboard/AdminUsersManager';
import { AdminInscriptionsPage } from './components/admin/AdminInscriptionsPage';
import { AdminStatsPage } from './components/admin/AdminStatsPage';
import { ProjectDetailsModal } from './components/dashboard/ProjectDetailsModal';

const AppRouter: React.FC = () => {
  const { currentPath, navigate, currentUser, isAuthenticated, authLoading } = useApp();

  const isPublicRoute = PUBLIC_ROUTES.includes(currentPath);
  const isAuthPage = currentPath === '/login' || currentPath === '/register';
  const isAdminRoute = currentPath.startsWith('/admin/');
  const isCenseurRoute = currentPath.startsWith('/censeur/');

  useEffect(() => {
    if (authLoading) return;

    // 1. Unauthenticated users trying to access private or admin routes -> /login
    if (!isAuthenticated && !isPublicRoute) {
      navigate('/login');
      return;
    }

    // 2. Authenticated users visiting /login or /register -> /dashboard
    if (isAuthenticated && isAuthPage) {
      navigate('/dashboard');
      return;
    }

    // 3. Non-admin users trying to access /admin/* -> /dashboard
    if (isAuthenticated && isAdminRoute && currentUser?.role !== 'admin') {
      navigate('/dashboard');
      return;
    }

    // 4. Non-censeur/non-admin users trying to access /censeur/* -> /dashboard
    if (
      isAuthenticated &&
      isCenseurRoute &&
      currentUser?.role !== 'censeur' &&
      currentUser?.role !== 'admin'
    ) {
      navigate('/dashboard');
    }
  }, [
    authLoading,
    isAuthenticated,
    isPublicRoute,
    isAuthPage,
    isAdminRoute,
    isCenseurRoute,
    currentUser,
    navigate,
  ]);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
        <div className="text-xs font-mono text-slate-500">Chargement de la session...</div>
      </div>
    );
  }

  // ZONE 1: VISITOR / CONSULTANT & AUTH PAGES
  if (isPublicRoute) {
    let publicView: React.ReactNode = <VisitorHomePage />;
    if (currentPath === '/vitrine') publicView = <VisitorShowcasePage />;
    else if (currentPath === '/gamification') publicView = <VisitorGamificationPage />;
    else if (currentPath === '/login') publicView = <LoginPage />;
    else if (currentPath === '/register') publicView = <RegisterPage />;

    return <VisitorShell>{publicView}</VisitorShell>;
  }

  // Protected guard fallback while redirecting
  if (!isAuthenticated || !currentUser) {
    return (
      <VisitorShell>
        <LoginPage />
      </VisitorShell>
    );
  }

  // ZONE 2 & 3: AUTHENTICATED USER & STRICT ADMIN PAGES
  const renderProtectedView = () => {
    switch (currentPath) {
      case '/dashboard':
        return <HomeView />;
      case '/projects':
        return <ProjectsShowcase />;
      case '/mes-taches':
        return <KanbanBoard />;
      case '/presences':
        return <AttendanceQrManager mode="scanner" />;
      case '/scores':
        return <RankingAndRewardsView />;
      case '/evenements':
        return <EventsSection />;
      case '/forum':
        return <ForumView />;
      case '/mon-dossier':
        return <InfractionsManager personalOnly />;
      // Censeur & Admin
      case '/censeur/qrcodes':
        return currentUser.role === 'censeur' || currentUser.role === 'admin' ? (
          <AttendanceQrManager mode="censeur" />
        ) : (
          <HomeView />
        );
      case '/censeur/infractions':
        return currentUser.role === 'censeur' || currentUser.role === 'admin' ? (
          <InfractionsManager />
        ) : (
          <HomeView />
        );
      case '/censeur/membres':
        return currentUser.role === 'censeur' || currentUser.role === 'admin' ? (
          <AdminUsersManager readOnly />
        ) : (
          <HomeView />
        );
      // Strict Admin
      case '/admin/inscriptions':
        return currentUser.role === 'admin' ? <AdminInscriptionsPage /> : <HomeView />;
      case '/admin/utilisateurs':
        return currentUser.role === 'admin' ? <AdminUsersManager /> : <HomeView />;
      case '/admin/statistiques':
        return currentUser.role === 'admin' ? <AdminStatsPage /> : <HomeView />;
      default:
        return <HomeView />;
    }
  };

  return <AppShell>{renderProtectedView()}</AppShell>;
};

export default function App() {
  return (
    <AppProvider>
      <AppRouter />
      <ProjectDetailsModal />
    </AppProvider>
  );
}
