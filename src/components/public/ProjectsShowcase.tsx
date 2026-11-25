import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Pole, ProjectStatus } from '../../types';
import { Github, ExternalLink, ArrowRight, Plus, X, Send, Check } from 'lucide-react';

export const ProjectsShowcase: React.FC = () => {
  const {
    projects,
    candidatures,
    setSelectedProject,
    createProject,
    applyToProject,
    currentUser,
  } = useApp();

  const [selectedPole, setSelectedPole] = useState<string>('Tous');
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const [newProj, setNewProj] = useState({
    title: '',
    shortDesc: '',
    fullDesc: '',
    pole: 'Dev & Cloud' as Pole,
    status: 'En R&D' as ProjectStatus,
    tags: 'TypeScript, React',
  });

  if (!currentUser) return null;

  const polesList: string[] = [
    'Tous',
    'Systèmes Embarqués',
    'Réseaux & Télécoms',
    'Dev & Cloud',
    'IA & Data Science',
    'Cybersécurité',
  ];

  const filteredProjects = selectedPole === 'Tous'
    ? projects
    : projects.filter(p => p.pole === selectedPole);

  const canCreateProject = currentUser.role === 'chef_projet' || currentUser.role === 'admin';
  const canApply = currentUser.role === 'membre' || currentUser.role === 'chef_projet';

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProj.title || !newProj.shortDesc) return;
    await createProject({
      title: newProj.title,
      shortDesc: newProj.shortDesc,
      fullDesc: newProj.fullDesc || newProj.shortDesc,
      pole: newProj.pole,
      status: newProj.status,
      leadId: currentUser.id,
      leadName: currentUser.name,
      image: '/src/assets/images/hero_enspd_tech_hub_1794513911161.jpg',
      tags: newProj.tags.split(',').map(t => t.trim()).filter(Boolean),
      featured: false,
    });
    setIsCreateOpen(false);
    setNewProj({
      title: '',
      shortDesc: '',
      fullDesc: '',
      pole: 'Dev & Cloud',
      status: 'En R&D',
      tags: 'TypeScript, React',
    });
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
            Projets du Club
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            {filteredProjects.length} projet{filteredProjects.length > 1 ? 's' : ''} · Consultez le cahier des charges ou postulez pour rejoindre une équipe.
          </p>
        </div>

        {canCreateProject && (
          <button
            onClick={() => setIsCreateOpen(true)}
            className="min-h-[40px] inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-950 text-xs font-semibold hover:opacity-90 transition-opacity shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Nouveau projet</span>
          </button>
        )}
      </div>

      {/* Filter Controls */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {polesList.map(pole => {
          const isSelected = selectedPole === pole;
          return (
            <button
              key={pole}
              onClick={() => setSelectedPole(pole)}
              className={`min-h-[36px] px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                isSelected
                  ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-950'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              {pole}
            </button>
          );
        })}
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
        {filteredProjects.map(project => {
          const hasApplied = candidatures.some(c => c.projectId === project.id);

          return (
            <article
              key={project.id}
              className="group bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col justify-between transition-colors hover:border-slate-300 dark:hover:border-slate-700"
            >
              <div
                onClick={() => setSelectedProject(project)}
                className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100 dark:bg-slate-800 cursor-pointer"
              >
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>

              <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400 font-mono mb-1.5">
                    <span>{project.pole}</span>
                    <span aria-hidden="true">·</span>
                    <span>{project.status}</span>
                  </div>

                  <button
                    onClick={() => setSelectedProject(project)}
                    className="text-left w-full"
                  >
                    <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-1">
                      {project.title}
                    </h3>
                  </button>

                  <p className="mt-1.5 text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
                    {project.shortDesc}
                  </p>

                  <div className="mt-3 text-[11px] text-slate-500 font-mono truncate">
                    Lead : {project.leadName} · {project.membersCount} membres
                  </div>
                </div>

                <div className="mt-4 pt-3.5 border-t border-slate-100 dark:border-slate-800">
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="text-slate-500">Avancement</span>
                    <span className="font-mono font-semibold text-slate-800 dark:text-slate-200 tabular-nums">
                      {project.progress}%
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-indigo-600 dark:bg-indigo-500 rounded-full"
                      style={{ width: `${project.progress}%` }}
                    />
                  </div>

                  <div className="mt-3.5 flex items-center justify-between gap-2">
                    <button
                      onClick={() => setSelectedProject(project)}
                      className="min-h-[36px] text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
                    >
                      <span>Ouvrir fiche</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>

                    <div className="flex items-center gap-1.5">
                      {canApply && project.leadId !== currentUser.id && (
                        <button
                          onClick={() => applyToProject(project.id)}
                          disabled={hasApplied}
                          className={`min-h-[34px] px-2.5 py-1 rounded-lg text-[11px] font-semibold inline-flex items-center gap-1 transition-colors ${
                            hasApplied
                              ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 cursor-default'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-indigo-600 hover:text-white'
                          }`}
                        >
                          {hasApplied ? <Check className="w-3 h-3" /> : <Send className="w-3 h-3" />}
                          <span>{hasApplied ? 'Candidature envoyée' : 'Candidater'}</span>
                        </button>
                      )}

                      {project.githubUrl && (
                        <a
                          href={project.githubUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="min-h-[34px] min-w-[34px] flex items-center justify-center text-slate-400 hover:text-slate-900 dark:hover:text-white"
                          title="GitHub"
                        >
                          <Github className="w-4 h-4" />
                        </a>
                      )}
                      {project.demoUrl && (
                        <a
                          href={project.demoUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="min-h-[34px] min-w-[34px] flex items-center justify-center text-slate-400 hover:text-slate-900 dark:hover:text-white"
                          title="Démo"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {/* Create Project Modal */}
      {isCreateOpen && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-950/60 backdrop-blur-xs p-0 sm:p-4"
          onClick={() => setIsCreateOpen(false)}
        >
          <div
            className="w-full sm:max-w-lg rounded-t-2xl sm:rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-10 h-1 bg-slate-200 dark:bg-slate-700 rounded-full mx-auto mb-4 sm:hidden" />
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Nouveau Projet Club GIT
              </h3>
              <button onClick={() => setIsCreateOpen(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Nom du projet *
                </label>
                <input
                  type="text"
                  required
                  value={newProj.title}
                  onChange={e => setNewProj({ ...newProj, title: e.target.value })}
                  placeholder="ex: Station Météo Campus ENSPD"
                  className="w-full min-h-[40px] px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Pôle</label>
                  <select
                    value={newProj.pole}
                    onChange={e => setNewProj({ ...newProj, pole: e.target.value as Pole })}
                    className="w-full min-h-[40px] px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white"
                  >
                    <option value="Dev & Cloud">Dev & Cloud</option>
                    <option value="IA & Data Science">IA & Data Science</option>
                    <option value="Réseaux & Télécoms">Réseaux & Télécoms</option>
                    <option value="Systèmes Embarqués">Systèmes Embarqués</option>
                    <option value="Cybersécurité">Cybersécurité</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Statut</label>
                  <select
                    value={newProj.status}
                    onChange={e => setNewProj({ ...newProj, status: e.target.value as ProjectStatus })}
                    className="w-full min-h-[40px] px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white"
                  >
                    <option value="En R&D">En R&D</option>
                    <option value="Prototype">Prototype</option>
                    <option value="En production">En production</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Résumé court *
                </label>
                <input
                  type="text"
                  required
                  value={newProj.shortDesc}
                  onChange={e => setNewProj({ ...newProj, shortDesc: e.target.value })}
                  placeholder="Objectif technique en une phrase"
                  className="w-full min-h-[40px] px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Technologies (séparées par des virgules)
                </label>
                <input
                  type="text"
                  value={newProj.tags}
                  onChange={e => setNewProj({ ...newProj, tags: e.target.value })}
                  className="w-full min-h-[40px] px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white font-mono"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCreateOpen(false)}
                  className="min-h-[40px] px-4 py-2 text-slate-600 dark:text-slate-400"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="min-h-[40px] px-4 py-2 rounded-lg bg-indigo-600 text-white font-semibold hover:bg-indigo-500"
                >
                  Créer le projet
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
