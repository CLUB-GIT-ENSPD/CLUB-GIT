import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Role, UserStatus } from '../../types';
import { Avatar } from '../ui/Avatar';
import { Trash2 } from 'lucide-react';

interface AdminUsersManagerProps {
  readOnly?: boolean;
}

export const AdminUsersManager: React.FC<AdminUsersManagerProps> = ({ readOnly = false }) => {
  const {
    currentUser,
    adminUsers,
    directoryUsers,
    fetchAdminUsers,
    updateUserRole,
    updateUserStatus,
    adjustUserPoints,
    deleteUser,
  } = useApp();

  const isAdmin = !readOnly && currentUser?.role === 'admin';
  const [filterPole, setFilterPole] = useState<string>('Tous');
  const [filterRole, setFilterRole] = useState<string>('');
  const [filterStatus, setFilterStatus] = useState<string>('');

  useEffect(() => {
    if (isAdmin) {
      fetchAdminUsers(filterRole, filterStatus);
    }
  }, [isAdmin, filterRole, filterStatus, fetchAdminUsers]);

  const sourceUsers = isAdmin ? adminUsers : directoryUsers;
  const poles = ['Tous', 'Dev & Cloud', 'IA & Data Science', 'Réseaux & Télécoms', 'Systèmes Embarqués', 'Cybersécurité'];

  const filtered = filterPole === 'Tous'
    ? sourceUsers
    : sourceUsers.filter(u => u.pole === filterPole);

  const roleLabels: Record<Role, string> = {
    membre: 'Membre',
    chef_projet: 'Chef de projet',
    censeur: 'Censeur',
    admin: 'Admin',
  };

  const statusLabels: Record<UserStatus, string> = {
    actif: 'Actif',
    en_attente: 'En attente',
    suspendu: 'Suspendu',
    renvoye: 'Renvoyé',
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
            {isAdmin ? `Gestion des utilisateurs (${filtered.length})` : `Annuaire des membres (${filtered.length})`}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            {isAdmin
              ? 'Attribution des rôles, gestion des statuts et ajustement des points XP.'
              : 'Liste en lecture seule des membres actifs du club par pôle.'}
          </p>
        </div>

        {isAdmin && (
          <div className="flex items-center gap-2">
            <select
              aria-label="Filtrer par rôle"
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className="min-h-[38px] text-xs px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200"
            >
              <option value="">Tous les rôles</option>
              <option value="membre">Membre</option>
              <option value="chef_projet">Chef de projet</option>
              <option value="censeur">Censeur</option>
              <option value="admin">Admin</option>
            </select>

            <select
              aria-label="Filtrer par statut"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="min-h-[38px] text-xs px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200"
            >
              <option value="">Tous les statuts</option>
              <option value="actif">Actif</option>
              <option value="en_attente">En attente</option>
              <option value="suspendu">Suspendu</option>
              <option value="renvoye">Renvoyé</option>
            </select>
          </div>
        )}
      </div>

      {/* Filter by pole */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {poles.map(p => (
          <button
            key={p}
            onClick={() => setFilterPole(p)}
            className={`min-h-[36px] px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 ${
              filterPole === p
                ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-950'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800'
            }`}
          >
            {p}
          </button>
        ))}
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 uppercase font-mono border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="py-3 px-4">Membre</th>
                <th className="py-3 px-4 hidden sm:table-cell">Pôle</th>
                <th className="py-3 px-4">Rôle</th>
                {isAdmin && <th className="py-3 px-4">Statut</th>}
                <th className="py-3 px-4 text-center hidden md:table-cell">Assiduité</th>
                <th className="py-3 px-4 text-right">Points</th>
                {isAdmin && <th className="py-3 px-4 text-right">Actions</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filtered.map(user => (
                <tr key={user.id}>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2.5">
                      <Avatar name={user.name} size="sm" />
                      <div className="min-w-0">
                        <div className="font-semibold text-slate-900 dark:text-white truncate">
                          {user.name}
                        </div>
                        <div className="text-[11px] font-mono text-slate-400 truncate">
                          {user.matricule} · {user.level}
                        </div>
                      </div>
                    </div>
                  </td>

                  <td className="py-3 px-4 hidden sm:table-cell text-slate-700 dark:text-slate-300">
                    {user.pole}
                  </td>

                  <td className="py-3 px-4">
                    {isAdmin ? (
                      <select
                        aria-label={`Rôle de ${user.name}`}
                        value={user.role}
                        onChange={(e) => updateUserRole(user.id, e.target.value as Role)}
                        className="min-h-[34px] text-xs px-2 py-1 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 font-mono text-slate-800 dark:text-slate-200"
                      >
                        <option value="membre">Membre</option>
                        <option value="chef_projet">Chef de projet</option>
                        <option value="censeur">Censeur</option>
                        <option value="admin">Admin</option>
                      </select>
                    ) : (
                      <span className="font-mono text-[11px] text-slate-600 dark:text-slate-400">
                        {roleLabels[user.role]}
                      </span>
                    )}
                  </td>

                  {isAdmin && (
                    <td className="py-3 px-4">
                      <select
                        aria-label={`Statut de ${user.name}`}
                        value={user.status || 'actif'}
                        onChange={(e) => updateUserStatus(user.id, e.target.value as UserStatus)}
                        className="min-h-[34px] text-xs px-2 py-1 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 font-mono text-slate-800 dark:text-slate-200"
                      >
                        {(['actif', 'en_attente', 'suspendu', 'renvoye'] as UserStatus[]).map(st => (
                          <option key={st} value={st}>{statusLabels[st]}</option>
                        ))}
                      </select>
                    </td>
                  )}

                  <td className="py-3 px-4 text-center hidden md:table-cell font-mono tabular-nums text-slate-700 dark:text-slate-300">
                    {user.attendanceRate}%
                  </td>

                  <td className="py-3 px-4 text-right font-mono font-bold text-indigo-600 dark:text-indigo-400 tabular-nums">
                    {user.points} pts
                  </td>

                  {isAdmin && (
                    <td className="py-3 px-4 text-right whitespace-nowrap space-x-1">
                      <button
                        onClick={() => adjustUserPoints(user.id, 50)}
                        className="min-h-[32px] px-2 py-1 text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 rounded hover:bg-emerald-100"
                      >
                        +50
                      </button>
                      <button
                        onClick={() => adjustUserPoints(user.id, -20)}
                        className="min-h-[32px] px-2 py-1 text-[11px] font-semibold text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 rounded hover:bg-amber-100"
                      >
                        -20
                      </button>
                      {user.id !== currentUser?.id && (
                        <button
                          onClick={() => deleteUser(user.id)}
                          aria-label={`Supprimer ${user.name}`}
                          className="min-h-[32px] min-w-[32px] inline-flex items-center justify-center text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded align-middle"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </td>
                  )}
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={isAdmin ? 7 : 5} className="py-8 text-center text-slate-400">
                    Aucun utilisateur trouvé pour ce filtre.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
