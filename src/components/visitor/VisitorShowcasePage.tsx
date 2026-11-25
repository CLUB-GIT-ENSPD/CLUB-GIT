import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Avatar } from '../ui/Avatar';
import { ArrowRight, Github, Medal } from 'lucide-react';

export const VisitorShowcasePage: React.FC = () => {
  const { publicProjects, publicTopMembers, setSelectedProject, navigate, isAuthenticated } = useApp();
  const [selectedPole, setSelectedPole] = useState<string>('Tous');

  const poles = [
    'Tous',
    'Systèmes Embarqués',
    'Réseaux & Télécoms',
    'Dev & Cloud',
    'IA & Data Science',
    'Cybersécurité',
  ];

  const filtered = selectedPole === 'Tous'
    ? publicProjects
    : publicProjects.filter(p => p.pole === selectedPole);

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
            Vitrine publique des projets
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Consultation libre des projets du club et du classement général des membres actifs.
          </p>
        </div>

        {!isAuthenticated && (
          <button
            onClick={() => navigate('/login')}
            className="min-h-[40px] px-4 py-2 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-950 text-xs font-semibold hover:opacity-90 transition-opacity shrink-0"
          >
            Se connecter pour candidater
          </button>
        )}
      </div>

      {/* Pole Filter */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {poles.map(pole => (
          <button
            key={pole}
            onClick={() => setSelectedPole(pole)}
            className={`min-h-[36px] px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 ${
              selectedPole === pole
                ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-950'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            {pole}
          </button>
        ))}
      </div>

      {/* Read-only Projects Catalog */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(project => (
          <article
            key={project.id}
            className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col justify-between"
          >
            <div>
              <div
                onClick={() => setSelectedProject(project)}
                className="aspect-[16/10] w-full overflow-hidden bg-slate-100 dark:bg-slate-800 cursor-pointer"
              >
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="p-4 sm:p-5">
                <div className="text-[11px] text-slate-500 font-mono mb-1">
                  {project.pole} · {project.status}
                </div>
                <button
                  onClick={() => setSelectedProject(project)}
                  className="text-left w-full"
                >
                  <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors line-clamp-1">
                    {project.title}
                  </h2>
                </button>
                <p className="mt-1.5 text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
                  {project.shortDesc}
                </p>
                <div className="mt-3 text-[11px] text-slate-500 font-mono">
                  Lead : {project.leadName} · {project.membersCount} membres
                </div>
              </div>
            </div>

            <div className="px-4 sm:px-5 pb-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <button
                onClick={() => setSelectedProject(project)}
                className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
              >
                <span>Détails</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <div className="flex items-center gap-3">
                <span className="text-xs font-mono font-semibold text-slate-700 dark:text-slate-300 tabular-nums">
                  {project.progress}%
                </span>
                {project.githubUrl && (
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-slate-400 hover:text-slate-800 dark:hover:text-white"
                    title="Dépôt GitHub"
                  >
                    <Github className="w-4 h-4" />
                  </a>
                )}
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* Public Top Members Leaderboard */}
      <section className="space-y-3 pt-2">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
            Classement public des contributeurs
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Top membres actifs selon les points XP validés au cours du semestre.
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 uppercase font-mono border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="py-3 px-4 w-12 text-center">#</th>
                  <th className="py-3 px-4">Membre</th>
                  <th className="py-3 px-4 hidden sm:table-cell">Pôle</th>
                  <th className="py-3 px-4 hidden md:table-cell">Palier</th>
                  <th className="py-3 px-4 text-right">Points</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {publicTopMembers.map((m, idx) => (
                  <tr key={m.id}>
                    <td className="py-3 px-4 text-center font-mono text-slate-500">
                      {idx < 3 ? (
                        <Medal className={`w-4 h-4 mx-auto ${idx === 0 ? 'text-amber-500' : idx === 1 ? 'text-slate-400' : 'text-amber-700'}`} />
                      ) : (
                        idx + 1
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2.5">
                        <Avatar name={m.name} size="sm" />
                        <div>
                          <div className="font-semibold text-slate-900 dark:text-white">{m.name}</div>
                          <div className="text-[11px] font-mono text-slate-400">{m.level}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 hidden sm:table-cell text-slate-600 dark:text-slate-300">{m.pole}</td>
                    <td className="py-3 px-4 hidden md:table-cell font-mono text-slate-500">{m.rankTitle}</td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-indigo-600 dark:text-indigo-400 tabular-nums">
                      {m.points} pts
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
};
