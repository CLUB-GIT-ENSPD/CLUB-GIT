export type Role = 'membre' | 'chef_projet' | 'censeur' | 'admin';
export type UserStatus = 'actif' | 'en_attente' | 'suspendu' | 'renvoye';

export type Pole = 'Dev & Cloud' | 'IA & Data Science' | 'Réseaux & Télécoms' | 'Cybersécurité' | 'Systèmes Embarqués';

export interface User {
  id: string;
  name: string;
  email: string;
  telephone?: string;
  role: Role;
  status?: UserStatus;
  pole: Pole;
  matricule: string;
  level: string;
  points: number;
  rankTitle: string;
  avatar: string;
  attendanceRate: number;
  github?: string;
  linkedin?: string;
  completedTasksCount: number;
  joinedDate: string;
}

export type ProjectStatus = 'En R&D' | 'En production' | 'Prototype' | 'Terminé' | 'Hackathon';

export interface Project {
  id: string;
  title: string;
  shortDesc: string;
  fullDesc: string;
  pole: Pole;
  status: ProjectStatus;
  leadId: string;
  leadName: string;
  image: string;
  tags: string[];
  githubUrl?: string;
  demoUrl?: string;
  membersCount: number;
  progress: number;
  featured: boolean;
  tasksCount: number;
  completedTasks: number;
}

export type TaskStatus = 'todo' | 'in_progress' | 'review' | 'done';
export type TaskPriority = 'Basse' | 'Moyenne' | 'Haute' | 'Urgente';

export interface Task {
  id: string;
  projectId: string;
  projectTitle: string;
  title: string;
  description: string;
  assignedToId: string;
  assignedToName: string;
  status: TaskStatus;
  priority: TaskPriority;
  points: number;
  dueDate: string;
  createdAt: string;
}

export interface AttendanceSession {
  id: string;
  title: string;
  date: string;
  startTime: string;
  endTime: string;
  location: string;
  qrCodeValue: string;
  active: boolean;
  pointsAwarded: number;
}

export interface AttendanceRecord {
  id: string;
  sessionId: string;
  sessionTitle: string;
  userId: string;
  userName: string;
  userMatricule: string;
  timestamp: string;
  status: 'Présent' | 'En retard' | 'Excusé';
  pointsEarned: number;
}

export interface Infraction {
  id: string;
  userId: string;
  userName: string;
  userMatricule: string;
  reason: string;
  penaltyPoints: number;
  date: string;
  censeurName: string;
  resolved: boolean;
}

export interface ForumPost {
  id: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  authorRole: Role;
  title: string;
  content: string;
  codeSnippet?: string;
  tags: string[];
  upvotes: number;
  userUpvoted?: boolean;
  repliesCount: number;
  createdAt: string;
  replies: ForumReply[];
}

export interface ForumReply {
  id: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  authorRole: Role;
  content: string;
  upvotes: number;
  createdAt: string;
  isAcceptedSolution?: boolean;
}

export interface EventItem {
  id: string;
  title: string;
  type: 'Hackathon' | 'Atelier' | 'Conférence' | 'Assemblée';
  date: string;
  time: string;
  location: string;
  description: string;
  speaker?: string;
  registeredCount: number;
  capacity: number;
  bannerImage: string;
  isUpcoming: boolean;
}

export interface PrimeTier {
  id: string;
  name: string;
  requiredPoints: number;
  cashRewardFCFA: string;
  perks: string[];
  badgeColor: string;
  minAttendance: number;
}

export interface AdminStats {
  totalActiveUsers: number;
  pendingInscriptions: number;
  totalProjects: number;
  totalTasks: number;
  completedTasks: number;
  avgAttendance: number;
  totalPoints: number;
  poleDistribution: Record<string, number>;
}
