import React from 'react';
import { useApp } from '../../context/AppContext';
import { PRIME_TIERS } from '../../data/mockData';
import { Avatar } from '../ui/Avatar';
import {
  QrCode,
  CheckSquare,
  Calendar,
  ArrowRight,
  CheckCircle2,
  Circle,
  MapPin,
  Shield,
  UserCheck,
  Users,
  BarChart3,
} from 'lucide-react';

export const HomeView: React.FC = () => {
  const {
    currentUser,
    tasks,
    projects,
    sessions,
    events,
    adminInscriptions,
    adminStats,
    navigate,
    updateTaskStatus,
    setSelectedProject,
  } = useApp();

  if (!currentUser) return null;

  const isAdmin = currentUser.role === 'admin';
  const isCenseur = currentUser.role === 'censeur';
  const isCenseurOrAdmin = isAdmin || isCenseur;

  const activeSession = sessions.find(s => s.active);
  const openTasks = tasks.filter(t => t.status !== 'done');
  const nextTier = PRIME_TIERS.find(t => currentUser.points < t.requiredPoints) || PRIME_TIERS[PRIME_TIERS.length - 1];
  const tierProgress = Math.min(100, Math.round((currentUser.points / nextTier.requiredPoints) * 100));
  const nextEvent = events[0];

  return (
    <div className="space-y-6">
      {/* Compact User Overview Card */}
      <section className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <Avatar name={currentUser.name} size="lg" />
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
                {currentUser.name}
              </h2>
              <div className="text-xs text-slate-500 dark:text-slate-400 font-mono mt-0.5">
                {currentUser.level} · {currentUser.pole} · {currentUser.matricule}
              </div>
            </div>
          </div>

          {/* Primary Role-Adapted Quick Actions */}
          <div className="flex flex-wrap items-center gap-2">
            {isAdmin ? (
              <>
                <button
                  onClick={() => navigate('/admin/inscriptions')}
                  className="flex-1 sm:flex-none min-h-[44px] inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-950 text-xs font-semibold hover:opacity-90 transition-opacity"
                >
                  <UserCheck className="w-4 h-4" />
                  <span>Inscriptions ({adminInscriptions.length})</span>
                </button>
                <button
                  onClick={() => navigate('/admin/utilisateurs')}
                  className="flex-1 sm:flex-none min-h-[44px] inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                >
                  <Users className="w-4 h-4 text-slate-500" />
                  <span>Utilisateurs</span>
                </button>
              </>
            ) : isCenseur ? (
              <>
                <button
                  onClick={() => navigate('/censeur/qrcodes')}
                  className="flex-1 sm:flex-none min-h-[44px] inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-950 text-xs font-semibold hover:opacity-90 transition-opacity"
                >
                  <QrCode className="w-4 h-4" />
                  <span>Gérer les séances QR</span>
                </button>
                <button
                  onClick={() => navigate('/censeur/infractions')}
                  className="flex-1 sm:flex-none min-h-[44px] inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                >
                  <Shield className="w-4 h-4 text-slate-500" />
                  <span>Registre disciplinaire</span>
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => navigate('/presences')}
                  className="flex-1 sm:flex-none min-h-[44px] inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-950 text-xs font-semibold hover:opacity-90 transition-opacity"
                >
                  <QrCode className="w-4 h-4" />
                  <span>Pointer présence</span>
                </button>
                <button
                  onClick={() => navigate('/mes-taches')}
                  className="flex-1 sm:flex-none min-h-[44px] inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                >
                  <CheckSquare className="w-4 h-4 text-slate-500" />
                  <span>Sprint ({openTasks.length})</span>
                </button>
              </>
            )}
          </div>
        </div>

        {/* 4 Sober Metric Cells */}
        <div className="mt-6 pt-5 border-t border-slate-100 dark:border-slate-800 grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div>
            <div className="text-[11px] text-slate-500 font-medium">Points XP</div>
            <div className="text-xl font-bold text-slate-900 dark:text-white font-mono tabular-nums mt-0.5">
              {currentUser.points} pts
            </div>
          </div>
          <div>
            <div className="text-[11px] text-slate-500 font-medium">Assiduité</div>
            <div className="text-xl font-bold text-slate-900 dark:text-white font-mono tabular-nums mt-0.5">
              {currentUser.attendanceRate}%
            </div>
          </div>
          <div>
            <div className="text-[11px] text-slate-500 font-medium">Tâches validées</div>
            <div className="text-xl font-bold text-slate-900 dark:text-white font-mono tabular-nums mt-0.5">
              {currentUser.completedTasksCount}
            </div>
          </div>
          <div>
            <div className="text-[11px] text-slate-500 font-medium">Palier actuel</div>
            <div className="text-sm sm:text-base font-semibold text-indigo-600 dark:text-indigo-400 mt-1 truncate">
              {currentUser.rankTitle}
            </div>
          </div>
        </div>

        {/* Next Tier Progress Bar */}
        <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="text-slate-600 dark:text-slate-400">
              Prochain palier : <strong className="text-slate-900 dark:text-white">{nextTier.name}</strong> ({nextTier.cashRewardFCFA})
            </span>
            <span className="font-mono text-slate-600 dark:text-slate-300 tabular-nums">
              {currentUser.points} / {nextTier.requiredPoints} pts
            </span>
          </div>
          <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-indigo-600 dark:bg-indigo-500 rounded-full transition-all duration-500"
              style={{ width: `${tierProgress}%` }}
            />
          </div>
        </div>
      </section>

      {/* Admin Quick Summary Strip (ONLY for admin) */}
      {isAdmin && adminStats && (
        <section className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
              <BarChart3 className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-slate-900 dark:text-white">
                Administration du Club
              </div>
              <div className="text-xs text-slate-500 font-mono">
                {adminStats.totalActiveUsers} membres actifs · {adminStats.pendingInscriptions} en attente · {adminStats.avgAttendance}% assiduité moyenne
              </div>
            </div>
          </div>
          <button
            onClick={() => navigate('/admin/statistiques')}
            className="min-h-[40px] px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 inline-flex items-center gap-1.5 shrink-0"
          >
            <span>Voir statistiques</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </section>
      )}

      {/* Main 2-Column App Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 space-y-6">
          {/* Open Tasks */}
          {!isCenseur && (
            <section className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden">
              <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                  Tâches en cours ({openTasks.length})
                </h3>
                <button
                  onClick={() => navigate('/mes-taches')}
                  className="text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
                >
                  <span>Tout voir</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {openTasks.slice(0, 4).map(task => (
                  <div
                    key={task.id}
                    className="px-5 py-3.5 flex items-center justify-between gap-3 hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors"
                  >
                    <div className="flex items-start gap-3 min-w-0">
                      <button
                        onClick={() => updateTaskStatus(task.id, 'done')}
                        aria-label={`Marquer "${task.title}" comme terminée`}
                        className="min-h-[36px] min-w-[36px] -ml-1.5 flex items-center justify-center text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors shrink-0"
                      >
                        <Circle className="w-4 h-4" />
                      </button>
                      <div className="min-w-0">
                        <div className="text-xs sm:text-sm font-medium text-slate-900 dark:text-white truncate">
                          {task.title}
                        </div>
                        <div className="text-[11px] text-slate-500 font-mono mt-0.5 truncate">
                          {task.projectTitle} · {task.assignedToName} · Échéance {task.dueDate}
                        </div>
                      </div>
                    </div>

                    <span className="text-xs font-mono font-semibold text-indigo-600 dark:text-indigo-400 shrink-0 tabular-nums">
                      +{task.points} pts
                    </span>
                  </div>
                ))}

                {openTasks.length === 0 && (
                  <div className="px-5 py-8 text-center text-xs text-slate-500 flex flex-col items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                    <span>Toutes les tâches du sprint sont terminées.</span>
                  </div>
                )}
              </div>
            </section>
          )}

          {/* Active Projects List */}
          <section className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                Projets actifs ({projects.length})
              </h3>
              <button
                onClick={() => navigate('/projects')}
                className="text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
              >
                <span>Catalogue</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {projects.slice(0, 3).map(proj => (
                <button
                  key={proj.id}
                  onClick={() => setSelectedProject(proj)}
                  className="w-full text-left px-5 py-3.5 flex items-center justify-between gap-4 hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-800 shrink-0 flex items-center justify-center">
                      <img
                        src={proj.image}
                        alt={proj.title}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white truncate">
                        {proj.title}
                      </div>
                      <div className="text-[11px] text-slate-500 font-mono truncate">
                        {proj.pole} · Lead : {proj.leadName}
                      </div>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <div className="text-xs font-mono font-semibold text-slate-800 dark:text-slate-200 tabular-nums">
                      {proj.progress}%
                    </div>
                    <div className="text-[10px] text-slate-400 font-mono">{proj.status}</div>
                  </div>
                </button>
              ))}
            </div>
          </section>
        </div>

        {/* Right Column: Active Session & Next Event */}
        <div className="lg:col-span-5 space-y-6">
          <section className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Séance de présence
              </span>
              <span className={`text-[11px] font-mono font-semibold ${activeSession ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400'}`}>
                {activeSession ? 'Ouverte' : 'Fermée'}
              </span>
            </div>

            {activeSession ? (
              <div className="space-y-3">
                <div className="text-sm font-semibold text-slate-900 dark:text-white">
                  {activeSession.title}
                </div>
                <div className="space-y-1 text-xs text-slate-600 dark:text-slate-400">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>{activeSession.location}</span>
                  </div>
                  <div className="flex items-center gap-2 font-mono">
                    <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>{activeSession.date} · {activeSession.startTime}–{activeSession.endTime}</span>
                  </div>
                </div>
                <button
                  onClick={() => navigate(isCenseurOrAdmin ? '/censeur/qrcodes' : '/presences')}
                  className="w-full min-h-[44px] mt-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
                >
                  <QrCode className="w-4 h-4" />
                  <span>
                    {isCenseurOrAdmin
                      ? 'Afficher le QR code de séance'
                      : `Ouvrir le scanner QR (+${activeSession.pointsAwarded} pts)`}
                  </span>
                </button>
              </div>
            ) : (
              <div className="text-xs text-slate-500 py-3">
                Aucune séance active en ce moment.
              </div>
            )}
          </section>

          {nextEvent && !isCenseur && (
            <section className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden">
              <div className="aspect-[16/9] w-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                <img
                  src={nextEvent.bannerImage}
                  alt={nextEvent.title}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="p-5 space-y-3">
                <div className="text-[11px] font-mono text-indigo-600 dark:text-indigo-400 font-semibold">
                  {nextEvent.type} · {nextEvent.date}
                </div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  {nextEvent.title}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
                  {nextEvent.description}
                </p>
                <div className="pt-2 flex items-center justify-between">
                  <span className="text-[11px] font-mono text-slate-500 tabular-nums">
                    {nextEvent.registeredCount} / {nextEvent.capacity} inscrits
                  </span>
                  <button
                    onClick={() => navigate('/evenements')}
                    className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
                  >
                    <span>Détails</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
};
