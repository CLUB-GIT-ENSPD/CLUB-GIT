import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { PRIME_TIERS } from '../../data/mockData';
import { Avatar } from '../ui/Avatar';
import { Search, Medal, CheckCircle2, AlertTriangle } from 'lucide-react';

export const RankingAndRewardsView: React.FC = () => {
  const { directoryUsers, currentUser } = useApp();
  const [subTab, setSubTab] = useState<'classement' | 'primes'>('classement');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'points' | 'attendance' | 'tasks'>('points');

  if (!currentUser) return null;

  const sortedUsers = [...directoryUsers]
    .filter(u =>
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.matricule.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.pole.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === 'points') return b.points - a.points;
      if (sortBy === 'attendance') return b.attendanceRate - a.attendanceRate;
      return b.completedTasksCount - a.completedTasksCount;
    });

  const getRankIcon = (index: number) => {
    if (index === 0) return <Medal className="w-4 h-4 text-amber-500 mx-auto" />;
    if (index === 1) return <Medal className="w-4 h-4 text-slate-400 mx-auto" />;
    if (index === 2) return <Medal className="w-4 h-4 text-amber-700 mx-auto" />;
    return <span className="font-mono text-xs text-slate-400 tabular-nums">{index + 1}</span>;
  };

  return (
    <div className="space-y-5">
      {/* Header & Sub-tab Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
            Classement & Primes
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Suivi des points XP, de l’assiduité et des paliers de prime semestrielle.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-1 p-1 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shrink-0">
          <button
            onClick={() => setSubTab('classement')}
            className={`min-h-[36px] px-4 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              subTab === 'classement'
                ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-semibold shadow-xs'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            Classement
          </button>
          <button
            onClick={() => setSubTab('primes')}
            className={`min-h-[36px] px-4 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              subTab === 'primes'
                ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-semibold shadow-xs'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            Grille des primes
          </button>
        </div>
      </div>

      {subTab === 'classement' ? (
        <div className="space-y-4">
          {/* Filters */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="relative flex-1 sm:max-w-xs">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Filtrer par nom, matricule..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full min-h-[40px] pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
              />
            </div>

            <div className="flex items-center gap-1 p-1 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs">
              <button
                onClick={() => setSortBy('points')}
                className={`min-h-[32px] px-3 py-1 rounded-lg transition-colors ${sortBy === 'points' ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-950 font-semibold' : 'text-slate-600 dark:text-slate-400'}`}
              >
                Points
              </button>
              <button
                onClick={() => setSortBy('attendance')}
                className={`min-h-[32px] px-3 py-1 rounded-lg transition-colors ${sortBy === 'attendance' ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-950 font-semibold' : 'text-slate-600 dark:text-slate-400'}`}
              >
                Assiduité
              </button>
              <button
                onClick={() => setSortBy('tasks')}
                className={`min-h-[32px] px-3 py-1 rounded-lg transition-colors ${sortBy === 'tasks' ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-950 font-semibold' : 'text-slate-600 dark:text-slate-400'}`}
              >
                Tâches
              </button>
            </div>
          </div>

          {/* Leaderboard Table */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 uppercase font-mono border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    <th className="py-3 px-4 w-12 text-center">#</th>
                    <th className="py-3 px-4">Membre</th>
                    <th className="py-3 px-4 hidden sm:table-cell">Pôle & Niveau</th>
                    <th className="py-3 px-4 text-right hidden md:table-cell">Tâches</th>
                    <th className="py-3 px-4 text-right">Assiduité</th>
                    <th className="py-3 px-4 text-right">Points</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {sortedUsers.map((user, idx) => (
                    <tr
                      key={user.id}
                      className={user.id === currentUser.id ? 'bg-indigo-50/40 dark:bg-indigo-950/20' : ''}
                    >
                      <td className="py-3 px-4 text-center">{getRankIcon(idx)}</td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2.5">
                          <Avatar name={user.name} size="sm" />
                          <div className="min-w-0">
                            <div className="font-semibold text-slate-900 dark:text-white truncate">
                              {user.name}
                            </div>
                            <div className="text-[11px] font-mono text-slate-400">
                              {user.matricule} · {user.level}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 hidden sm:table-cell text-slate-600 dark:text-slate-300">
                        {user.pole}
                      </td>
                      <td className="py-3 px-4 text-right hidden md:table-cell font-mono tabular-nums text-slate-600 dark:text-slate-300">
                        {user.completedTasksCount}
                      </td>
                      <td className="py-3 px-4 text-right font-mono tabular-nums text-slate-700 dark:text-slate-200">
                        {user.attendanceRate}%
                      </td>
                      <td className="py-3 px-4 text-right font-mono tabular-nums font-bold text-indigo-600 dark:text-indigo-400">
                        {user.points} pts
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {PRIME_TIERS.map((tier, idx) => {
              const unlocked = currentUser.points >= tier.requiredPoints && currentUser.attendanceRate >= tier.minAttendance;
              return (
                <div
                  key={tier.id}
                  className={`rounded-2xl p-5 border flex flex-col justify-between ${
                    unlocked
                      ? 'border-indigo-500/50 bg-indigo-50/20 dark:bg-indigo-950/20'
                      : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between text-xs mb-2">
                      <span className="font-bold text-slate-900 dark:text-white">
                        {idx + 1}. {tier.name}
                      </span>
                      <span className="font-mono text-slate-500 tabular-nums">
                        {tier.requiredPoints} pts
                      </span>
                    </div>

                    <div className="text-lg font-bold font-mono text-indigo-600 dark:text-indigo-400 mb-1">
                      {tier.cashRewardFCFA}
                    </div>
                    <div className="text-[11px] font-mono text-slate-500 mb-4">
                      Assiduité requise : {tier.minAttendance}%
                    </div>

                    <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
                      {tier.perks.map((perk, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                          <span>{perk}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] font-mono flex items-center justify-between">
                    <span className={unlocked ? 'text-emerald-600 dark:text-emerald-400 font-semibold' : 'text-slate-400'}>
                      {unlocked ? 'Palier atteint' : `Manque ${Math.max(0, tier.requiredPoints - currentUser.points)} pts`}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs text-slate-600 dark:text-slate-400 flex items-start gap-3">
            <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
            <span>
              Les points sont validés par le Censeur et le Bureau Exécutif. Les retards (-10 pts) ou absences non justifiées aux séances plénières affectent le solde et l’éligibilité aux primes.
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
