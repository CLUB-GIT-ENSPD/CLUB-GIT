import React from 'react';
import { useApp } from '../../context/AppContext';
import { X, Github, ExternalLink, CheckCircle2, LogIn } from 'lucide-react';

export const ProjectDetailsModal: React.FC = () => {
  const {
    selectedProject,
    setSelectedProject,
    tasks,
    updateTaskStatus,
    isAuthenticated,
    navigate,
  } = useApp();

  if (!selectedProject) return null;

  const projectTasks = isAuthenticated
    ? tasks.filter(t => t.projectId === selectedProject.id)
    : [];

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-950/60 backdrop-blur-xs"
      onClick={() => setSelectedProject(null)}
    >
      <div
        className="relative w-full sm:max-w-2xl rounded-t-2xl sm:rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 sm:p-6 shadow-xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-10 h-1 bg-slate-200 dark:bg-slate-700 rounded-full mx-auto mb-4 sm:hidden" />

        <button
          onClick={() => setSelectedProject(null)}
          className="min-h-[36px] min-w-[36px] flex items-center justify-center absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="mb-4 pr-8">
          <div className="text-[11px] text-indigo-600 dark:text-indigo-400 font-mono mb-1">
            {selectedProject.pole} · {selectedProject.status}
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
            {selectedProject.title}
          </h2>
          <div className="mt-1 text-xs text-slate-500 font-mono">
            Responsable : {selectedProject.leadName} · {selectedProject.membersCount} membres
          </div>
        </div>

        <div className="aspect-[16/9] w-full rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 mb-5 border border-slate-200 dark:border-slate-800">
          <img
            src={selectedProject.image}
            alt={selectedProject.title}
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>

        <div className="space-y-2 mb-5 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
          <h4 className="text-xs font-semibold text-slate-900 dark:text-white">
            Description technique
          </h4>
          <p>{selectedProject.fullDesc}</p>
        </div>

        <div className="mb-5">
          <h4 className="text-xs font-semibold text-slate-900 dark:text-white mb-1.5">
            Technologies
          </h4>
          <div className="text-xs font-mono text-slate-600 dark:text-slate-400">
            {selectedProject.tags.join(' · ')}
          </div>
        </div>

        {isAuthenticated ? (
          <div className="mb-5">
            <div className="flex items-center justify-between mb-2.5 text-xs">
              <h4 className="font-semibold text-slate-900 dark:text-white">
                Tâches liées ({projectTasks.length})
              </h4>
              <span className="font-mono text-slate-500 tabular-nums">
                Avancement : {selectedProject.progress}%
              </span>
            </div>

            <div className="space-y-2">
              {projectTasks.length === 0 ? (
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 text-xs text-slate-500 text-center border border-slate-200 dark:border-slate-800">
                  Aucune tâche ouverte pour ce projet.
                </div>
              ) : (
                projectTasks.map(task => (
                  <div
                    key={task.id}
                    className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 flex items-center justify-between gap-3 text-xs"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <button
                        onClick={() => updateTaskStatus(task.id, task.status === 'done' ? 'todo' : 'done')}
                        className={`w-6 h-6 rounded-md flex items-center justify-center border shrink-0 transition-colors ${
                          task.status === 'done'
                            ? 'bg-emerald-600 border-emerald-600 text-white'
                            : 'border-slate-300 dark:border-slate-700 hover:border-indigo-500'
                        }`}
                      >
                        {task.status === 'done' && <CheckCircle2 className="w-3.5 h-3.5" />}
                      </button>
                      <div className="min-w-0">
                        <div className={`font-medium truncate ${task.status === 'done' ? 'line-through text-slate-400' : 'text-slate-900 dark:text-white'}`}>
                          {task.title}
                        </div>
                        <div className="text-[11px] text-slate-500 font-mono">
                          {task.assignedToName} · {task.dueDate}
                        </div>
                      </div>
                    </div>

                    <span className="text-xs font-mono font-semibold text-indigo-600 dark:text-indigo-400 whitespace-nowrap tabular-nums">
                      +{task.points} pts
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        ) : (
          <div className="mb-5 p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <span className="text-slate-600 dark:text-slate-400">
              Connectez-vous pour consulter les tâches du sprint ou postuler à ce projet.
            </span>
            <button
              onClick={() => {
                setSelectedProject(null);
                navigate('/login');
              }}
              className="min-h-[36px] px-3 py-1.5 rounded-lg bg-slate-900 dark:bg-white text-white dark:text-slate-950 font-semibold inline-flex items-center gap-1.5 shrink-0"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Connexion</span>
            </button>
          </div>
        )}

        <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-4">
            {selectedProject.githubUrl && (
              <a
                href={selectedProject.githubUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-indigo-600"
              >
                <Github className="w-4 h-4" />
                <span>GitHub</span>
              </a>
            )}
            {selectedProject.demoUrl && (
              <a
                href={selectedProject.demoUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                <ExternalLink className="w-4 h-4" />
                <span>Démo</span>
              </a>
            )}
          </div>

          <button
            onClick={() => setSelectedProject(null)}
            className="min-h-[40px] px-4 py-2 text-xs font-semibold text-slate-800 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
};
