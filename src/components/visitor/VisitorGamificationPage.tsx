import React from 'react';
import { useApp } from '../../context/AppContext';
import { PRIME_TIERS } from '../../data/mockData';
import { CheckCircle2, ArrowRight, AlertTriangle } from 'lucide-react';

export const VisitorGamificationPage: React.FC = () => {
  const { navigate, isAuthenticated } = useApp();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
            Barème des points & Primes semestrielles
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Règles transparentes d’attribution des points XP et avantages accordés par le Club GIT ENSPD.
          </p>
        </div>

        <button
          onClick={() => navigate(isAuthenticated ? '/scores' : '/register')}
          className="min-h-[40px] px-4 py-2 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-950 text-xs font-semibold inline-flex items-center gap-1.5 hover:opacity-90 shrink-0"
        >
          <span>{isAuthenticated ? 'Voir mon classement' : 'Rejoindre le club'}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Points rules */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          <div className="text-xs font-mono text-emerald-600 dark:text-emerald-400 font-bold">+20 à +25 pts</div>
          <div className="text-xs font-semibold text-slate-900 dark:text-white mt-1">Présence en séance</div>
          <p className="text-[11px] text-slate-500 mt-1">Émargement par scan QR lors des séances hebdomadaires.</p>
        </div>
        <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          <div className="text-xs font-mono text-indigo-600 dark:text-indigo-400 font-bold">+30 à +60 pts</div>
          <div className="text-xs font-semibold text-slate-900 dark:text-white mt-1">Livrable de sprint</div>
          <p className="text-[11px] text-slate-500 mt-1">Validation d’une tâche assignée sur un projet du club.</p>
        </div>
        <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          <div className="text-xs font-mono text-indigo-600 dark:text-indigo-400 font-bold">+10 à +15 pts</div>
          <div className="text-xs font-semibold text-slate-900 dark:text-white mt-1">Entraide technique</div>
          <p className="text-[11px] text-slate-500 mt-1">Publication de retours d’expérience et réponses sur le forum.</p>
        </div>
        <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          <div className="text-xs font-mono text-rose-600 dark:text-rose-400 font-bold">-10 à -30 pts</div>
          <div className="text-xs font-semibold text-slate-900 dark:text-white mt-1">Discipline & Retards</div>
          <p className="text-[11px] text-slate-500 mt-1">Pénalités appliquées par le Censeur en cas d’absence non justifiée.</p>
        </div>
      </section>

      {/* Prime Tiers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {PRIME_TIERS.map((tier, idx) => (
          <div
            key={tier.id}
            className="rounded-2xl p-5 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col justify-between"
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
                Assiduité minimale : {tier.minAttendance}%
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
          </div>
        ))}
      </div>

      <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs text-slate-600 dark:text-slate-400 flex items-start gap-3">
        <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
        <span>
          Les primes et dotations matérielles sont attribuées en fin de semestre académique aux membres actifs respectant le seuil de points et le taux d’assiduité requis.
        </span>
      </div>
    </div>
  );
};
