import React, { useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Avatar } from '../ui/Avatar';
import { Check, X, UserCheck, Phone, Mail } from 'lucide-react';

export const AdminInscriptionsPage: React.FC = () => {
  const {
    adminInscriptions,
    refreshAdminData,
    validateInscription,
    rejectInscription,
  } = useApp();

  useEffect(() => {
    refreshAdminData();
  }, [refreshAdminData]);

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
          Inscriptions en attente ({adminInscriptions.length})
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Validez les nouvelles demandes d’adhésion pour activer l’accès membre (+50 pts de bienvenue).
        </p>
      </div>

      {adminInscriptions.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-10 text-center space-y-2">
          <UserCheck className="w-6 h-6 text-emerald-500 mx-auto" />
          <div className="text-sm font-semibold text-slate-900 dark:text-white">
            Aucune demande en attente
          </div>
          <p className="text-xs text-slate-500">
            Toutes les demandes d’inscription ont été traitées.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {adminInscriptions.map(applicant => (
            <div
              key={applicant.id}
              className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="flex items-start gap-3.5 min-w-0">
                <Avatar name={applicant.name} size="md" />
                <div className="min-w-0 space-y-1">
                  <div className="text-sm font-bold text-slate-900 dark:text-white truncate">
                    {applicant.name}
                  </div>
                  <div className="text-xs font-mono text-slate-500 truncate">
                    {applicant.matricule} · {applicant.level} · {applicant.pole}
                  </div>
                  <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-500 pt-0.5">
                    <span className="inline-flex items-center gap-1 truncate">
                      <Mail className="w-3 h-3 shrink-0" />
                      <span>{applicant.email}</span>
                    </span>
                    {applicant.telephone && (
                      <span className="inline-flex items-center gap-1 font-mono">
                        <Phone className="w-3 h-3 shrink-0" />
                        <span>{applicant.telephone}</span>
                      </span>
                    )}
                    <span className="font-mono">Demande le {applicant.joinedDate}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => rejectInscription(applicant.id)}
                  className="min-h-[42px] flex-1 sm:flex-none px-4 py-2 rounded-xl border border-rose-200 dark:border-rose-900/60 text-rose-700 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 text-xs font-semibold inline-flex items-center justify-center gap-1.5 transition-colors"
                >
                  <X className="w-4 h-4" />
                  <span>Rejeter</span>
                </button>
                <button
                  onClick={() => validateInscription(applicant.id)}
                  className="min-h-[42px] flex-1 sm:flex-none px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold inline-flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Check className="w-4 h-4" />
                  <span>Valider</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
