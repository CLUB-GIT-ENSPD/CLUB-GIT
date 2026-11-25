import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Plus, X } from 'lucide-react';

interface InfractionsManagerProps {
  personalOnly?: boolean;
}

export const InfractionsManager: React.FC<InfractionsManagerProps> = ({ personalOnly = false }) => {
  const { infractions, directoryUsers, addInfraction, resolveInfraction, currentUser } = useApp();

  const isCenseurOrAdmin =
    !personalOnly && (currentUser?.role === 'censeur' || currentUser?.role === 'admin');

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [targetUserId, setTargetUserId] = useState(directoryUsers[0]?.id || '');
  const [reason, setReason] = useState('Retard de plus de 15 minutes à la séance plénière.');
  const [penaltyPoints, setPenaltyPoints] = useState(-10);

  useEffect(() => {
    if (!targetUserId && directoryUsers[0]?.id) {
      setTargetUserId(directoryUsers[0].id);
    }
  }, [directoryUsers, targetUserId]);

  if (!currentUser) return null;

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetUserId || !reason) return;
    await addInfraction({
      userId: targetUserId,
      reason,
      penaltyPoints: -Math.abs(penaltyPoints),
    });
    setIsAddOpen(false);
  };

  const displayedInfractions = isCenseurOrAdmin
    ? infractions
    : infractions.filter(inf => inf.userId === currentUser.id);

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
            {isCenseurOrAdmin ? 'Registre disciplinaire' : 'Mon dossier disciplinaire'}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Suivi des retards, absences non justifiées et régularisations.
          </p>
        </div>

        {isCenseurOrAdmin && (
          <button
            onClick={() => setIsAddOpen(true)}
            className="min-h-[40px] inline-flex items-center justify-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-500 rounded-xl transition-colors whitespace-nowrap shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Ajouter une infraction</span>
          </button>
        )}
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 uppercase font-mono border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Membre</th>
                <th className="py-3 px-4">Motif</th>
                <th className="py-3 px-4 text-center">Pénalité</th>
                <th className="py-3 px-4 text-center">Statut</th>
                {isCenseurOrAdmin && <th className="py-3 px-4 text-right">Action</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {displayedInfractions.length === 0 ? (
                <tr>
                  <td colSpan={isCenseurOrAdmin ? 6 : 5} className="py-10 text-center text-slate-400">
                    Aucune infraction enregistrée.
                  </td>
                </tr>
              ) : (
                displayedInfractions.map(inf => (
                  <tr key={inf.id}>
                    <td className="py-3 px-4 font-mono text-slate-500 whitespace-nowrap">{inf.date}</td>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-900 dark:text-white">{inf.userName}</div>
                      <div className="text-[11px] font-mono text-slate-400">{inf.userMatricule}</div>
                    </td>
                    <td className="py-3 px-4 text-slate-700 dark:text-slate-300 max-w-xs">{inf.reason}</td>
                    <td className="py-3 px-4 text-center font-mono font-bold text-rose-600 dark:text-rose-400 tabular-nums">
                      {inf.penaltyPoints} pts
                    </td>
                    <td className="py-3 px-4 text-center font-mono text-[11px]">
                      <span className={inf.resolved ? 'text-emerald-600 dark:text-emerald-400 font-semibold' : 'text-amber-600 dark:text-amber-400'}>
                        {inf.resolved ? 'Régularisé' : 'Actif'}
                      </span>
                    </td>
                    {isCenseurOrAdmin && (
                      <td className="py-3 px-4 text-right">
                        {!inf.resolved ? (
                          <button
                            onClick={() => resolveInfraction(inf.id)}
                            className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline font-semibold"
                          >
                            Régulariser
                          </button>
                        ) : (
                          <span className="text-[11px] text-slate-400 font-mono">Clos</span>
                        )}
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isAddOpen && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-950/60 backdrop-blur-xs p-0 sm:p-4"
          onClick={() => setIsAddOpen(false)}
        >
          <div
            className="w-full sm:max-w-md rounded-t-2xl sm:rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-10 h-1 bg-slate-200 dark:bg-slate-700 rounded-full mx-auto mb-4 sm:hidden" />
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Notifier une infraction
              </h3>
              <button onClick={() => setIsAddOpen(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAdd} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Membre</label>
                <select
                  value={targetUserId}
                  onChange={(e) => setTargetUserId(e.target.value)}
                  className="w-full min-h-[40px] px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white"
                >
                  {directoryUsers.map(u => (
                    <option key={u.id} value={u.id}>{u.name} ({u.matricule})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Motif</label>
                <textarea
                  rows={2}
                  required
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Pénalité (points)</label>
                <input
                  type="number"
                  max="-5"
                  min="-50"
                  value={penaltyPoints}
                  onChange={(e) => setPenaltyPoints(Number(e.target.value))}
                  className="w-full min-h-[40px] px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white font-mono"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button type="button" onClick={() => setIsAddOpen(false)} className="min-h-[40px] px-4 py-2 text-slate-600 dark:text-slate-400">
                  Annuler
                </button>
                <button type="submit" className="min-h-[40px] px-4 py-2 text-white bg-rose-600 hover:bg-rose-500 rounded-lg font-semibold">
                  Appliquer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
