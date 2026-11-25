import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { TaskStatus, TaskPriority } from '../../types';
import { Plus, CheckCircle2, ArrowRight, ArrowLeft, X } from 'lucide-react';

export const KanbanBoard: React.FC = () => {
  const { tasks, projects, directoryUsers, currentUser, updateTaskStatus, createTask } = useApp();

  const [selectedProjectId, setSelectedProjectId] = useState<string>('all');
  const [mobileColumn, setMobileColumn] = useState<TaskStatus>('todo');
  const [isNewTaskModalOpen, setIsNewTaskModalOpen] = useState(false);

  const [taskForm, setTaskForm] = useState({
    title: '',
    description: '',
    projectId: projects[0]?.id || '',
    assignedToId: currentUser?.id || directoryUsers[0]?.id || '',
    priority: 'Moyenne' as TaskPriority,
    points: 40,
    dueDate: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
  });

  if (!currentUser) return null;

  const canCreateTask = currentUser.role === 'chef_projet' || currentUser.role === 'admin';

  const columns: { id: TaskStatus; title: string; short: string }[] = [
    { id: 'todo', title: 'À faire', short: 'À faire' },
    { id: 'in_progress', title: 'En cours', short: 'En cours' },
    { id: 'review', title: 'En revue', short: 'Revue' },
    { id: 'done', title: 'Terminé', short: 'Fait' },
  ];

  const filteredTasks = selectedProjectId === 'all'
    ? tasks
    : tasks.filter(t => t.projectId === selectedProjectId);

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskForm.title) return;

    const projId = taskForm.projectId || projects[0]?.id || '';
    const assigneeId = taskForm.assignedToId || currentUser.id;
    const proj = projects.find(p => p.id === projId);
    const assignee = directoryUsers.find(u => u.id === assigneeId) || currentUser;

    await createTask({
      projectId: projId,
      projectTitle: proj ? proj.title : 'Projet GIT',
      title: taskForm.title,
      description: taskForm.description,
      assignedToId: assignee.id,
      assignedToName: assignee.name,
      status: 'todo',
      priority: taskForm.priority,
      points: Number(taskForm.points),
      dueDate: taskForm.dueDate,
    });

    setIsNewTaskModalOpen(false);
    setTaskForm({
      title: '',
      description: '',
      projectId: projects[0]?.id || '',
      assignedToId: currentUser.id,
      priority: 'Moyenne',
      points: 40,
      dueDate: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
    });
  };

  const getPriorityStyle = (priority: TaskPriority) => {
    switch (priority) {
      case 'Urgente': return 'text-rose-600 dark:text-rose-400 font-semibold';
      case 'Haute': return 'text-amber-600 dark:text-amber-400 font-semibold';
      case 'Moyenne': return 'text-indigo-600 dark:text-indigo-400';
      default: return 'text-slate-500';
    }
  };

  const getNextStatus = (current: TaskStatus): TaskStatus | null => {
    if (current === 'todo') return 'in_progress';
    if (current === 'in_progress') return 'review';
    if (current === 'review') return 'done';
    return null;
  };

  const getPrevStatus = (current: TaskStatus): TaskStatus | null => {
    if (current === 'done') return 'review';
    if (current === 'review') return 'in_progress';
    if (current === 'in_progress') return 'todo';
    return null;
  };

  const renderColumn = (colId: TaskStatus, title: string) => {
    const colTasks = filteredTasks.filter(t => t.status === colId);
    return (
      <div
        key={colId}
        className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-3.5 sm:p-4 flex flex-col min-h-[380px]"
      >
        <div className="hidden lg:flex items-center justify-between pb-3 mb-3 border-b border-slate-100 dark:border-slate-800">
          <span className="text-xs font-semibold text-slate-900 dark:text-white">
            {title}
          </span>
          <span className="font-mono text-xs text-slate-500 tabular-nums">
            {colTasks.length}
          </span>
        </div>

        <div className="space-y-3 flex-1">
          {colTasks.length === 0 ? (
            <div className="h-28 flex items-center justify-center text-xs text-slate-400 border border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
              Aucune tâche
            </div>
          ) : (
            colTasks.map(task => {
              const nextSt = getNextStatus(task.status);
              const prevSt = getPrevStatus(task.status);

              return (
                <div
                  key={task.id}
                  className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between text-[11px] mb-1.5 font-mono">
                      <span className="text-slate-500 truncate max-w-[150px]">
                        {task.projectTitle}
                      </span>
                      <span className={getPriorityStyle(task.priority)}>
                        {task.priority}
                      </span>
                    </div>

                    <h4 className="text-xs font-semibold text-slate-900 dark:text-white leading-snug mb-1">
                      {task.title}
                    </h4>

                    {task.description && (
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed mb-2.5">
                        {task.description}
                      </p>
                    )}

                    <div className="flex items-center justify-between text-[11px] text-slate-500 font-mono pt-2 border-t border-slate-100 dark:border-slate-800">
                      <span className="truncate">{task.assignedToName}</span>
                      <span className="font-semibold text-indigo-600 dark:text-indigo-400 tabular-nums shrink-0">
                        +{task.points} pts
                      </span>
                    </div>
                  </div>

                  <div className="mt-2.5 pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-1">
                    {prevSt ? (
                      <button
                        onClick={() => updateTaskStatus(task.id, prevSt)}
                        className="min-h-[36px] min-w-[36px] flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                        title="Étape précédente"
                      >
                        <ArrowLeft className="w-3.5 h-3.5" />
                      </button>
                    ) : <div className="w-9" />}

                    {task.status !== 'done' && (
                      <button
                        onClick={() => updateTaskStatus(task.id, 'done')}
                        className="min-h-[36px] px-2.5 rounded-lg text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 flex items-center gap-1"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Valider</span>
                      </button>
                    )}

                    {nextSt ? (
                      <button
                        onClick={() => updateTaskStatus(task.id, nextSt)}
                        className="min-h-[36px] min-w-[36px] flex items-center justify-center rounded-lg text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/40"
                        title="Étape suivante"
                      >
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    ) : <div className="w-9" />}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-5">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
            Tâches du sprint
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            {filteredTasks.length} tâche{filteredTasks.length > 1 ? 's' : ''} · La validation crédite automatiquement les points XP.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <select
            aria-label="Filtrer par projet"
            value={selectedProjectId}
            onChange={(e) => setSelectedProjectId(e.target.value)}
            className="min-h-[40px] flex-1 sm:flex-none text-xs px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200"
          >
            <option value="all">Tous les projets ({tasks.length})</option>
            {projects.map(p => (
              <option key={p.id} value={p.id}>{p.title}</option>
            ))}
          </select>

          {canCreateTask && (
            <button
              onClick={() => setIsNewTaskModalOpen(true)}
              className="min-h-[40px] inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white dark:text-slate-950 bg-slate-900 dark:bg-white rounded-xl hover:opacity-90 transition-opacity whitespace-nowrap shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>Ajouter</span>
            </button>
          )}
        </div>
      </div>

      {/* Mobile Segmented Column Switcher */}
      <div className="lg:hidden grid grid-cols-4 gap-1 p-1 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
        {columns.map(col => {
          const count = filteredTasks.filter(t => t.status === col.id).length;
          const active = mobileColumn === col.id;
          return (
            <button
              key={col.id}
              onClick={() => setMobileColumn(col.id)}
              className={`min-h-[38px] px-2 py-1.5 rounded-lg text-[11px] font-medium transition-colors whitespace-nowrap truncate ${
                active
                  ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-semibold shadow-xs'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              {col.short} ({count})
            </button>
          );
        })}
      </div>

      <div className="lg:hidden">
        {renderColumn(mobileColumn, columns.find(c => c.id === mobileColumn)?.title || '')}
      </div>

      <div className="hidden lg:grid lg:grid-cols-4 gap-4">
        {columns.map(col => renderColumn(col.id, col.title))}
      </div>

      {/* New Task Modal */}
      {isNewTaskModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-950/60 backdrop-blur-xs p-0 sm:p-4"
          onClick={() => setIsNewTaskModalOpen(false)}
        >
          <div
            className="w-full sm:max-w-lg rounded-t-2xl sm:rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-10 h-1 bg-slate-200 dark:bg-slate-700 rounded-full mx-auto mb-4 sm:hidden" />
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Nouvelle tâche
              </h3>
              <button onClick={() => setIsNewTaskModalOpen(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateTask} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                  Titre *
                </label>
                <input
                  type="text"
                  required
                  placeholder="ex: Implémenter le routage Dijkstra"
                  value={taskForm.title}
                  onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })}
                  className="w-full min-h-[40px] px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  placeholder="Détails techniques attendus..."
                  value={taskForm.description}
                  onChange={(e) => setTaskForm({ ...taskForm, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Projet</label>
                  <select
                    value={taskForm.projectId}
                    onChange={(e) => setTaskForm({ ...taskForm, projectId: e.target.value })}
                    className="w-full min-h-[40px] px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white"
                  >
                    {projects.map(p => (
                      <option key={p.id} value={p.id}>{p.title}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Assigné à</label>
                  <select
                    value={taskForm.assignedToId}
                    onChange={(e) => setTaskForm({ ...taskForm, assignedToId: e.target.value })}
                    className="w-full min-h-[40px] px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white"
                  >
                    {directoryUsers.map(u => (
                      <option key={u.id} value={u.id}>{u.name} ({u.level})</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Priorité</label>
                  <select
                    value={taskForm.priority}
                    onChange={(e) => setTaskForm({ ...taskForm, priority: e.target.value as TaskPriority })}
                    className="w-full min-h-[40px] px-2 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white"
                  >
                    <option value="Basse">Basse</option>
                    <option value="Moyenne">Moyenne</option>
                    <option value="Haute">Haute</option>
                    <option value="Urgente">Urgente</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Points</label>
                  <input
                    type="number"
                    min="10"
                    max="150"
                    value={taskForm.points}
                    onChange={(e) => setTaskForm({ ...taskForm, points: Number(e.target.value) })}
                    className="w-full min-h-[40px] px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Échéance</label>
                  <input
                    type="date"
                    value={taskForm.dueDate}
                    onChange={(e) => setTaskForm({ ...taskForm, dueDate: e.target.value })}
                    className="w-full min-h-[40px] px-2 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white font-mono"
                  />
                </div>
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsNewTaskModalOpen(false)}
                  className="min-h-[40px] px-4 py-2 text-slate-600 dark:text-slate-400"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="min-h-[40px] px-4 py-2 text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg font-semibold"
                >
                  Ajouter au sprint
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
