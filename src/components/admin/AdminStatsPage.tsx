import React, { useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Users, UserPlus, FolderKanban, CheckSquare, TrendingUp } from 'lucide-react';

export const AdminStatsPage: React.FC = () => {
  const { adminStats, refreshAdminData, navigate } = useApp();

  useEffect(() => {
    refreshAdminData();
  }, [refreshAdminData]);

  if (!adminStats) {
    return (
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-8 text-center text-xs text-slate-500">
        Chargement des statistiques...
      </div>
    );
  }

  const polesEntries = Object.entries(adminStats.poleDistribution || {}) as [string, number][];
  const totalInPoles = polesEntries.reduce((acc, [, v]) => acc + v, 0) || 1;
  const taskRate = adminStats.totalTasks
    ? Math.round((adminStats.completedTasks / adminStats.totalTasks) * 100)
    : 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
            Statistiques du Club GIT
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Indicateurs consolidés réservés à l’administration.
          </p>
        </div>

        {adminStats.pendingInscriptions > 0 && (
          <button
            onClick={() => navigate('/admin/inscriptions')}
            className="min-h-[40px] px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold inline-flex items-center gap-2 shrink-0"
          >
            <UserPlus className="w-4 h-4" />
            <span>{adminStats.pendingInscriptions} inscription(s) à valider</span>
          </button>
        )}
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span>Membres actifs</span>
            <Users className="w-4 h-4" />
          </div>
          <div className="text-2xl font-bold font-mono tabular-nums text-slate-900 dark:text-white mt-2">
            {adminStats.totalActiveUsers}
          </div>
          <div className="text-[11px] text-slate-500 font-mono mt-1">
            {adminStats.pendingInscriptions} en attente
          </div>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span>Projets & Tâches</span>
            <FolderKanban className="w-4 h-4" />
          </div>
          <div className="text-2xl font-bold font-mono tabular-nums text-slate-900 dark:text-white mt-2">
            {adminStats.totalProjects}
          </div>
          <div className="text-[11px] text-slate-500 font-mono mt-1">
            {adminStats.completedTasks}/{adminStats.totalTasks} tâches ({taskRate}%)
          </div>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span>Assiduité moyenne</span>
            <CheckSquare className="w-4 h-4" />
          </div>
          <div className="text-2xl font-bold font-mono tabular-nums text-emerald-600 dark:text-emerald-400 mt-2">
            {adminStats.avgAttendance}%
          </div>
          <div className="text-[11px] text-slate-500 font-mono mt-1">
            Séances de laboratoire
          </div>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span>Total points XP</span>
            <TrendingUp className="w-4 h-4" />
          </div>
          <div className="text-2xl font-bold font-mono tabular-nums text-indigo-600 dark:text-indigo-400 mt-2">
            {adminStats.totalPoints}
          </div>
          <div className="text-[11px] text-slate-500 font-mono mt-1">
            Cumul membres actifs
          </div>
        </div>
      </div>

      {/* Pole distribution */}
      <section className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 sm:p-6 space-y-4">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white">
          Répartition des membres actifs par pôle
        </h3>

        <div className="space-y-3.5">
          {polesEntries.map(([pole, count]) => {
            const pct = Math.round((count / totalInPoles) * 100);
            return (
              <div key={pole} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-slate-800 dark:text-slate-200">{pole}</span>
                  <span className="font-mono text-slate-500 tabular-nums">
                    {count} membre{count > 1 ? 's' : ''} ({pct}%)
                  </span>
                </div>
                <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-indigo-600 dark:bg-indigo-500 rounded-full"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};
