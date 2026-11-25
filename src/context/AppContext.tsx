import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  User,
  Role,
  UserStatus,
  Project,
  Task,
  TaskStatus,
  AttendanceSession,
  AttendanceRecord,
  Infraction,
  ForumPost,
  EventItem,
  AdminStats,
} from '../types';
import {
  INITIAL_PROJECTS,
  INITIAL_USERS,
  CLUB_EVENTS,
} from '../data/mockData';
import { apiRequest, getStoredToken, setStoredToken } from '../lib/api';

export interface Candidature {
  id: string;
  projectId: string;
  userId: string;
  userName: string;
  motivation: string;
  status: string;
  createdAt: string;
}

export interface RegisterPayload {
  prenom: string;
  nom: string;
  email: string;
  telephone: string;
  matricule: string;
  level: string;
  pole: string;
  password: string;
  password_confirmation: string;
}

interface ToastState {
  id: number;
  message: string;
  type: 'info' | 'success' | 'warning';
}

interface AppContextType {
  theme: 'dark' | 'light';
  toggleTheme: () => void;
  currentPath: string;
  navigate: (path: string) => void;
  // Auth
  currentUser: User | null;
  isAuthenticated: boolean;
  authLoading: boolean;
  login: (email: string, password: string) => Promise<User>;
  register: (payload: RegisterPayload) => Promise<string>;
  logout: () => Promise<void>;
  // Public data (Consultant / Visiteur)
  publicProjects: Project[];
  publicTopMembers: User[];
  publicEvents: EventItem[];
  // Authenticated data
  projects: Project[];
  tasks: Task[];
  sessions: AttendanceSession[];
  attendances: AttendanceRecord[];
  infractions: Infraction[];
  forumPosts: ForumPost[];
  events: EventItem[];
  directoryUsers: User[];
  candidatures: Candidature[];
  registeredEventIds: string[];
  // Admin data
  adminInscriptions: User[];
  adminUsers: User[];
  adminStats: AdminStats | null;
  // UI state
  selectedProject: Project | null;
  setSelectedProject: (proj: Project | null) => void;
  toast: ToastState | null;
  showToast: (message: string, type?: 'info' | 'success' | 'warning') => void;
  // Authenticated Actions
  refreshAuthenticatedData: () => Promise<void>;
  refreshAdminData: () => Promise<void>;
  updateTaskStatus: (taskId: string, newStatus: TaskStatus) => Promise<void>;
  createTask: (task: Omit<Task, 'id' | 'createdAt'>) => Promise<void>;
  createProject: (project: Omit<Project, 'id' | 'membersCount' | 'progress' | 'tasksCount' | 'completedTasks'>) => Promise<void>;
  applyToProject: (projectId: string, motivation?: string) => Promise<void>;
  recordAttendanceScan: (code: string) => Promise<{ success: boolean; message: string; points?: number }>;
  createSession: (session: { title: string; location: string; pointsAwarded: number }) => Promise<AttendanceSession | null>;
  toggleSessionState: (sessionId: string) => Promise<void>;
  addInfraction: (infraction: { userId: string; reason: string; penaltyPoints: number }) => Promise<void>;
  resolveInfraction: (id: string) => Promise<void>;
  addForumPost: (post: { title: string; content: string; tags: string[]; codeSnippet?: string }) => Promise<void>;
  addForumReply: (postId: string, content: string) => Promise<void>;
  upvoteForumPost: (postId: string) => Promise<void>;
  registerEvent: (eventId: string) => Promise<boolean>;
  // Admin Actions
  fetchAdminUsers: (role?: string, statut?: string) => Promise<void>;
  validateInscription: (userId: string) => Promise<void>;
  rejectInscription: (userId: string) => Promise<void>;
  updateUserRole: (userId: string, newRole: Role) => Promise<void>;
  updateUserStatus: (userId: string, newStatus: UserStatus) => Promise<void>;
  adjustUserPoints: (userId: string, delta: number) => Promise<void>;
  deleteUser: (userId: string) => Promise<void>;
}

const AppContext = createContext<AppContextType | null>(null);

export const PUBLIC_ROUTES = ['/', '/vitrine', '/gamification', '/login', '/register'];

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    const saved = localStorage.getItem('club_git_theme');
    return saved === 'dark' ? 'dark' : 'light';
  });

  const [currentPath, setCurrentPath] = useState<string>(() => {
    const p = window.location.pathname;
    return p || '/';
  });

  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState<boolean>(() => Boolean(getStoredToken()));
  const [toast, setToast] = useState<ToastState | null>(null);

  // Public datasets (with offline cache fallback)
  const [publicProjects, setPublicProjects] = useState<Project[]>(() => {
    const cached = localStorage.getItem('club_git_pub_projects');
    return cached ? JSON.parse(cached) : INITIAL_PROJECTS;
  });
  const [publicTopMembers, setPublicTopMembers] = useState<User[]>(() => {
    const cached = localStorage.getItem('club_git_pub_members');
    return cached ? JSON.parse(cached) : INITIAL_USERS;
  });
  const [publicEvents, setPublicEvents] = useState<EventItem[]>(() => {
    const cached = localStorage.getItem('club_git_pub_events');
    return cached ? JSON.parse(cached) : CLUB_EVENTS;
  });

  // Authenticated datasets
  const [projects, setProjects] = useState<Project[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [sessions, setSessions] = useState<AttendanceSession[]>([]);
  const [attendances, setAttendances] = useState<AttendanceRecord[]>([]);
  const [infractions, setInfractions] = useState<Infraction[]>([]);
  const [forumPosts, setForumPosts] = useState<ForumPost[]>([]);
  const [events, setEvents] = useState<EventItem[]>(CLUB_EVENTS);
  const [directoryUsers, setDirectoryUsers] = useState<User[]>([]);
  const [candidatures, setCandidatures] = useState<Candidature[]>([]);
  const [registeredEventIds, setRegisteredEventIds] = useState<string[]>(() => {
    const saved = localStorage.getItem('club_git_reg_events');
    return saved ? JSON.parse(saved) : [];
  });

  // Strict Admin datasets
  const [adminInscriptions, setAdminInscriptions] = useState<User[]>([]);
  const [adminUsers, setAdminUsers] = useState<User[]>([]);
  const [adminStats, setAdminStats] = useState<AdminStats | null>(null);

  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const showToast = useCallback((message: string, type: 'info' | 'success' | 'warning' = 'success') => {
    const id = Date.now();
    setToast({ id, message, type });
    setTimeout(() => {
      setToast(prev => (prev?.id === id ? null : prev));
    }, 3400);
  }, []);

  const navigate = useCallback((path: string) => {
    const normalized = path.startsWith('/') ? path : `/${path}`;
    if (window.location.pathname !== normalized) {
      window.history.pushState({}, '', normalized);
    }
    setCurrentPath(normalized);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  useEffect(() => {
    const onPopState = () => {
      setCurrentPath(window.location.pathname || '/');
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  useEffect(() => {
    localStorage.setItem('club_git_theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    const metaTheme = document.querySelector('meta[name="theme-color"]');
    if (metaTheme) {
      metaTheme.setAttribute('content', theme === 'dark' ? '#0f172a' : '#ffffff');
    }
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('club_git_reg_events', JSON.stringify(registeredEventIds));
  }, [registeredEventIds]);

  const toggleTheme = () => setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));

  // Fetch public consultant data on startup
  const loadPublicData = useCallback(async () => {
    try {
      const [projRes, memRes, evtRes] = await Promise.all([
        apiRequest<{ data: Project[] }>('/public/projects'),
        apiRequest<{ data: User[] }>('/public/top-members'),
        apiRequest<{ data: EventItem[] }>('/public/events'),
      ]);
      if (projRes.data) {
        setPublicProjects(projRes.data);
        localStorage.setItem('club_git_pub_projects', JSON.stringify(projRes.data));
      }
      if (memRes.data) {
        setPublicTopMembers(memRes.data);
        localStorage.setItem('club_git_pub_members', JSON.stringify(memRes.data));
      }
      if (evtRes.data) {
        setPublicEvents(evtRes.data);
        setEvents(evtRes.data);
        localStorage.setItem('club_git_pub_events', JSON.stringify(evtRes.data));
      }
    } catch {
      // Offline / cache fallback already loaded in state
    }
  }, []);

  const refreshAdminData = useCallback(async () => {
    try {
      const [inscr, usersRes, statsRes] = await Promise.all([
        apiRequest<User[]>('/admin/inscriptions'),
        apiRequest<User[]>('/admin/users'),
        apiRequest<AdminStats>('/admin/stats'),
      ]);
      setAdminInscriptions(Array.isArray(inscr) ? inscr : []);
      setAdminUsers(Array.isArray(usersRes) ? usersRes : []);
      setAdminStats(statsRes || null);
    } catch {
      // Non-admin or error
    }
  }, []);

  const refreshAuthenticatedData = useCallback(async () => {
    try {
      const [projRes, taskRes, sesRes, attRes, infRes, forumRes, dirRes, candRes, evtRes] = await Promise.all([
        apiRequest<{ data: Project[] }>('/projects'),
        apiRequest<{ data: Task[] }>('/tasks'),
        apiRequest<{ data: AttendanceSession[] }>('/sessions'),
        apiRequest<{ data: AttendanceRecord[] }>('/presences'),
        apiRequest<{ data: Infraction[] }>('/infractions'),
        apiRequest<{ data: ForumPost[] }>('/forum'),
        apiRequest<{ data: User[] }>('/users/directory'),
        apiRequest<{ data: Candidature[] }>('/mes-candidatures'),
        apiRequest<{ data: EventItem[] }>('/public/events'),
      ]);
      setProjects(projRes.data || []);
      setTasks(taskRes.data || []);
      setSessions(sesRes.data || []);
      setAttendances(attRes.data || []);
      setInfractions(infRes.data || []);
      setForumPosts(forumRes.data || []);
      setDirectoryUsers(dirRes.data || []);
      setCandidatures(candRes.data || []);
      if (evtRes.data) setEvents(evtRes.data);
    } catch {
      // Ignore if offline or unauthenticated
    }
  }, []);

  // Bootstrap session + public data
  useEffect(() => {
    loadPublicData();
    const token = getStoredToken();
    if (!token) {
      setAuthLoading(false);
      return;
    }
    (async () => {
      try {
        const res = await apiRequest<{ user: User }>('/me');
        setCurrentUser(res.user);
        await refreshAuthenticatedData();
        if (res.user.role === 'admin') {
          await refreshAdminData();
        }
      } catch {
        setStoredToken(null);
        setCurrentUser(null);
      } finally {
        setAuthLoading(false);
      }
    })();
  }, [loadPublicData, refreshAuthenticatedData, refreshAdminData]);

  // Auth methods
  const login = async (email: string, password: string): Promise<User> => {
    const res = await apiRequest<{ user: User; token: string }>('/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    setStoredToken(res.token);
    setCurrentUser(res.user);
    await refreshAuthenticatedData();
    if (res.user.role === 'admin') {
      await refreshAdminData();
    }
    showToast(`Connecté en tant que ${res.user.name}`, 'success');
    navigate('/dashboard');
    return res.user;
  };

  const register = async (payload: RegisterPayload): Promise<string> => {
    const res = await apiRequest<{ message: string }>('/register', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    showToast('Demande d’inscription envoyée', 'success');
    return res.message;
  };

  const logout = async () => {
    try {
      await apiRequest('/logout', { method: 'POST' });
    } catch {
      // Clear local session regardless
    }
    setStoredToken(null);
    setCurrentUser(null);
    setProjects([]);
    setTasks([]);
    setSessions([]);
    setAttendances([]);
    setInfractions([]);
    setForumPosts([]);
    setDirectoryUsers([]);
    setCandidatures([]);
    setAdminInscriptions([]);
    setAdminUsers([]);
    setAdminStats(null);
    showToast('Session fermée', 'info');
    navigate('/');
  };

  // Authenticated CRUD handlers
  const updateTaskStatus = async (taskId: string, newStatus: TaskStatus) => {
    try {
      const res = await apiRequest<{ data: Task }>(`/tasks/${taskId}`, {
        method: 'PUT',
        body: JSON.stringify({ status: newStatus }),
      });
      setTasks(prev => prev.map(t => (t.id === taskId ? res.data : t)));
      if (newStatus === 'done') {
        const meRes = await apiRequest<{ user: User }>('/me');
        setCurrentUser(meRes.user);
        const dirRes = await apiRequest<{ data: User[] }>('/users/directory');
        setDirectoryUsers(dirRes.data || []);
        showToast(`Tâche validée (+${res.data.points} pts)`, 'success');
      } else {
        showToast('Statut de la tâche mis à jour', 'info');
      }
    } catch (err: any) {
      showToast(err.message || 'Erreur lors de la mise à jour', 'warning');
    }
  };

  const createTask = async (taskData: Omit<Task, 'id' | 'createdAt'>) => {
    try {
      const res = await apiRequest<{ data: Task }>('/tasks', {
        method: 'POST',
        body: JSON.stringify(taskData),
      });
      setTasks(prev => [res.data, ...prev]);
      setProjects(prev =>
        prev.map(p => (p.id === taskData.projectId ? { ...p, tasksCount: p.tasksCount + 1 } : p))
      );
      showToast('Tâche ajoutée au sprint', 'success');
    } catch (err: any) {
      showToast(err.message || 'Erreur création tâche', 'warning');
    }
  };

  const createProject = async (projData: Omit<Project, 'id' | 'membersCount' | 'progress' | 'tasksCount' | 'completedTasks'>) => {
    try {
      const res = await apiRequest<{ data: Project }>('/projects', {
        method: 'POST',
        body: JSON.stringify(projData),
      });
      setProjects(prev => [res.data, ...prev]);
      setPublicProjects(prev => [res.data, ...prev]);
      showToast(`Projet "${projData.title}" créé`, 'success');
    } catch (err: any) {
      showToast(err.message || 'Action réservée aux chefs de projet et admins', 'warning');
    }
  };

  const applyToProject = async (projectId: string, motivation?: string) => {
    try {
      const res = await apiRequest<{ data: Candidature }>(`/projects/${projectId}/candidater`, {
        method: 'POST',
        body: JSON.stringify({ motivation }),
      });
      setCandidatures(prev => [res.data, ...prev]);
      showToast('Candidature au projet envoyée', 'success');
    } catch (err: any) {
      showToast(err.message || 'Impossible de postuler', 'warning');
    }
  };

  const recordAttendanceScan = async (code: string) => {
    try {
      const res = await apiRequest<{ data: AttendanceRecord; pointsEarned: number; user: User }>(
        '/presences/scan',
        {
          method: 'POST',
          body: JSON.stringify({ code }),
        }
      );
      setAttendances(prev => [res.data, ...prev]);
      if (res.user) setCurrentUser(res.user);
      showToast(`Présence enregistrée (+${res.pointsEarned} pts)`, 'success');
      return {
        success: true,
        message: `Présence validée (+${res.pointsEarned} pts).`,
        points: res.pointsEarned,
      };
    } catch (err: any) {
      return {
        success: false,
        message: err.message || 'Erreur lors du pointage.',
      };
    }
  };

  const createSession = async (sessionData: { title: string; location: string; pointsAwarded: number }) => {
    try {
      const res = await apiRequest<{ data: AttendanceSession }>('/sessions', {
        method: 'POST',
        body: JSON.stringify(sessionData),
      });
      setSessions(prev => [res.data, ...prev.map(s => ({ ...s, active: false }))]);
      showToast('Nouvelle séance ouverte', 'success');
      return res.data;
    } catch (err: any) {
      showToast(err.message || 'Accès refusé', 'warning');
      return null;
    }
  };

  const toggleSessionState = async (sessionId: string) => {
    try {
      const res = await apiRequest<{ data: AttendanceSession }>(`/sessions/${sessionId}/toggle`, {
        method: 'PUT',
      });
      setSessions(prev => prev.map(s => (s.id === sessionId ? res.data : s)));
      showToast('État de la séance mis à jour', 'info');
    } catch (err: any) {
      showToast(err.message || 'Erreur', 'warning');
    }
  };

  const addInfraction = async (infData: { userId: string; reason: string; penaltyPoints: number }) => {
    try {
      const res = await apiRequest<{ data: Infraction }>('/infractions', {
        method: 'POST',
        body: JSON.stringify(infData),
      });
      setInfractions(prev => [res.data, ...prev]);
      const dirRes = await apiRequest<{ data: User[] }>('/users/directory');
      setDirectoryUsers(dirRes.data || []);
      showToast(`Infraction enregistrée (${res.data.penaltyPoints} pts)`, 'warning');
    } catch (err: any) {
      showToast(err.message || 'Accès refusé', 'warning');
    }
  };

  const resolveInfraction = async (id: string) => {
    try {
      const res = await apiRequest<{ data: Infraction }>(`/infractions/${id}/resolve`, {
        method: 'PUT',
      });
      setInfractions(prev => prev.map(i => (i.id === id ? res.data : i)));
      showToast('Dossier régularisé', 'success');
    } catch (err: any) {
      showToast(err.message || 'Erreur', 'warning');
    }
  };

  const addForumPost = async (post: { title: string; content: string; tags: string[]; codeSnippet?: string }) => {
    try {
      const res = await apiRequest<{ data: ForumPost }>('/forum', {
        method: 'POST',
        body: JSON.stringify(post),
      });
      setForumPosts(prev => [res.data, ...prev]);
      const meRes = await apiRequest<{ user: User }>('/me');
      setCurrentUser(meRes.user);
      showToast('Sujet publié (+15 pts)', 'success');
    } catch (err: any) {
      showToast(err.message || 'Erreur publication', 'warning');
    }
  };

  const addForumReply = async (postId: string, content: string) => {
    try {
      const res = await apiRequest<{ data: any }>(`/forum/${postId}/reply`, {
        method: 'POST',
        body: JSON.stringify({ content }),
      });
      setForumPosts(prev =>
        prev.map(p =>
          p.id === postId
            ? { ...p, repliesCount: p.repliesCount + 1, replies: [...p.replies, res.data] }
            : p
        )
      );
      const meRes = await apiRequest<{ user: User }>('/me');
      setCurrentUser(meRes.user);
      showToast('Réponse ajoutée (+10 pts)', 'success');
    } catch (err: any) {
      showToast(err.message || 'Erreur', 'warning');
    }
  };

  const upvoteForumPost = async (postId: string) => {
    try {
      const res = await apiRequest<{ data: ForumPost }>(`/forum/${postId}/upvote`, {
        method: 'POST',
      });
      setForumPosts(prev => prev.map(p => (p.id === postId ? res.data : p)));
    } catch {
      // ignore
    }
  };

  const registerEvent = async (eventId: string): Promise<boolean> => {
    if (registeredEventIds.includes(eventId)) return false;
    try {
      const res = await apiRequest<{ data: EventItem }>(`/events/${eventId}/register`, {
        method: 'POST',
      });
      setEvents(prev => prev.map(e => (e.id === eventId ? res.data : e)));
      setPublicEvents(prev => prev.map(e => (e.id === eventId ? res.data : e)));
      setRegisteredEventIds(prev => [...prev, eventId]);
      showToast('Inscription à l’événement confirmée', 'success');
      return true;
    } catch (err: any) {
      showToast(err.message || 'Impossible de s’inscrire', 'warning');
      return false;
    }
  };

  // =========================================================================
  // STRICT ADMIN HANDLERS
  // =========================================================================
  const fetchAdminUsers = useCallback(async (role = '', statut = '') => {
    try {
      const params = new URLSearchParams();
      if (role) params.append('role', role);
      if (statut) params.append('statut', statut);
      const query = params.toString() ? `?${params.toString()}` : '';
      const usersRes = await apiRequest<User[]>(`/admin/users${query}`);
      setAdminUsers(Array.isArray(usersRes) ? usersRes : []);
    } catch (err: any) {
      showToast(err.message || 'Erreur chargement utilisateurs', 'warning');
    }
  }, [showToast]);

  const validateInscription = async (userId: string) => {
    try {
      await apiRequest(`/admin/inscriptions/${userId}/valider`, { method: 'PUT' });
      showToast('Membre validé et activé (+50 pts de bienvenue)', 'success');
      await refreshAdminData();
      await refreshAuthenticatedData();
    } catch (err: any) {
      showToast(err.message || 'Erreur validation', 'warning');
    }
  };

  const rejectInscription = async (userId: string) => {
    try {
      await apiRequest(`/admin/inscriptions/${userId}/rejeter`, { method: 'PUT' });
      showToast('Inscription rejetée', 'info');
      await refreshAdminData();
    } catch (err: any) {
      showToast(err.message || 'Erreur rejet', 'warning');
    }
  };

  const updateUserRole = async (userId: string, newRole: Role) => {
    try {
      const res = await apiRequest<{ user: User }>(`/admin/users/${userId}/role`, {
        method: 'PUT',
        body: JSON.stringify({ role: newRole }),
      });
      setAdminUsers(prev => prev.map(u => (u.id === userId ? res.user : u)));
      showToast('Rôle mis à jour', 'info');
    } catch (err: any) {
      showToast(err.message || 'Erreur modification rôle', 'warning');
    }
  };

  const updateUserStatus = async (userId: string, newStatus: UserStatus) => {
    try {
      const res = await apiRequest<{ user: User }>(`/admin/users/${userId}/status`, {
        method: 'PUT',
        body: JSON.stringify({ status: newStatus }),
      });
      setAdminUsers(prev => prev.map(u => (u.id === userId ? res.user : u)));
      showToast('Statut mis à jour', 'info');
      await refreshAdminData();
    } catch (err: any) {
      showToast(err.message || 'Erreur modification statut', 'warning');
    }
  };

  const adjustUserPoints = async (userId: string, delta: number) => {
    try {
      const res = await apiRequest<{ user: User }>(`/admin/users/${userId}/points`, {
        method: 'PUT',
        body: JSON.stringify({ delta }),
      });
      setAdminUsers(prev => prev.map(u => (u.id === userId ? res.user : u)));
      showToast(`Points ajustés (${delta > 0 ? '+' : ''}${delta} pts)`, 'info');
    } catch (err: any) {
      showToast(err.message || 'Erreur ajustement points', 'warning');
    }
  };

  const deleteUser = async (userId: string) => {
    try {
      await apiRequest(`/admin/users/${userId}`, { method: 'DELETE' });
      setAdminUsers(prev => prev.filter(u => u.id !== userId));
      showToast('Compte utilisateur supprimé', 'info');
      await refreshAdminData();
    } catch (err: any) {
      showToast(err.message || 'Impossible de supprimer cet utilisateur', 'warning');
    }
  };

  return (
    <AppContext.Provider
      value={{
        theme,
        toggleTheme,
        currentPath,
        navigate,
        currentUser,
        isAuthenticated: Boolean(currentUser),
        authLoading,
        login,
        register,
        logout,
        publicProjects,
        publicTopMembers,
        publicEvents,
        projects,
        tasks,
        sessions,
        attendances,
        infractions,
        forumPosts,
        events,
        directoryUsers,
        candidatures,
        registeredEventIds,
        adminInscriptions,
        adminUsers,
        adminStats,
        selectedProject,
        setSelectedProject,
        toast,
        showToast,
        refreshAuthenticatedData,
        refreshAdminData,
        updateTaskStatus,
        createTask,
        createProject,
        applyToProject,
        recordAttendanceScan,
        createSession,
        toggleSessionState,
        addInfraction,
        resolveInfraction,
        addForumPost,
        addForumReply,
        upvoteForumPost,
        registerEvent,
        fetchAdminUsers,
        validateInscription,
        rejectInscription,
        updateUserRole,
        updateUserStatus,
        adjustUserPoints,
        deleteUser,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
