import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

type Role = 'membre' | 'chef_projet' | 'censeur' | 'admin';
type UserStatus = 'actif' | 'en_attente' | 'suspendu' | 'renvoye';

interface DbUser {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  telephone?: string;
  role: Role;
  status: UserStatus;
  pole: string;
  matricule: string;
  level: string;
  points: number;
  rankTitle: string;
  attendanceRate: number;
  completedTasksCount: number;
  joinedDate: string;
}

interface DbState {
  users: DbUser[];
  tokens: Record<string, string>; // token -> userId
  projects: any[];
  tasks: any[];
  sessions: any[];
  attendances: any[];
  infractions: any[];
  forumPosts: any[];
  events: any[];
  eventRegistrations: Record<string, string[]>; // eventId -> userId[]
  candidatures: { id: string; projectId: string; userId: string; userName: string; motivation: string; status: string; createdAt: string }[];
}

function hashPassword(pwd: string): string {
  return crypto.createHash('sha256').update(pwd + '_clubgit_enspd').digest('hex');
}

function getRankTitle(points: number): string {
  if (points >= 1000) return 'Élite GIT';
  if (points >= 600) return 'Or Innovateur';
  if (points >= 300) return 'Argent Poly';
  if (points >= 150) return 'Bronze Tech';
  return 'Initié GIT';
}

const DATA_DIR = path.join(__dirname, '.data');
const DB_FILE = path.join(DATA_DIR, 'club_git_db.json');

const SEED_DATA: DbState = {
  users: [
    {
      id: 'usr-1',
      name: 'Kevin Ndongo',
      email: 'admin@enspd-udo.cm',
      passwordHash: hashPassword('password123'),
      telephone: '+237 690 11 22 33',
      role: 'admin',
      status: 'actif',
      pole: 'Dev & Cloud',
      matricule: '21P249',
      level: 'GIT 5',
      points: 840,
      rankTitle: 'Or Innovateur',
      attendanceRate: 98,
      completedTasksCount: 38,
      joinedDate: '2022-10-15',
    },
    {
      id: 'usr-2',
      name: 'Marcelle Fotso',
      email: 'chef@enspd-udo.cm',
      passwordHash: hashPassword('password123'),
      telephone: '+237 677 44 55 66',
      role: 'chef_projet',
      status: 'actif',
      pole: 'IA & Data Science',
      matricule: '22P118',
      level: 'GIT 4',
      points: 620,
      rankTitle: 'Or Innovateur',
      attendanceRate: 94,
      completedTasksCount: 29,
      joinedDate: '2023-01-10',
    },
    {
      id: 'usr-3',
      name: 'Samuel Eboa',
      email: 'censeur@enspd-udo.cm',
      passwordHash: hashPassword('password123'),
      telephone: '+237 699 88 77 66',
      role: 'censeur',
      status: 'actif',
      pole: 'Réseaux & Télécoms',
      matricule: '21P082',
      level: 'GIT 5',
      points: 510,
      rankTitle: 'Argent Poly',
      attendanceRate: 100,
      completedTasksCount: 22,
      joinedDate: '2022-10-15',
    },
    {
      id: 'usr-4',
      name: 'Christian Kamdem',
      email: 'membre@enspd-udo.cm',
      passwordHash: hashPassword('password123'),
      telephone: '+237 655 12 34 56',
      role: 'membre',
      status: 'actif',
      pole: 'Systèmes Embarqués',
      matricule: '23P314',
      level: 'GIT 3',
      points: 285,
      rankTitle: 'Bronze Tech',
      attendanceRate: 88,
      completedTasksCount: 14,
      joinedDate: '2023-10-05',
    },
    {
      id: 'usr-5',
      name: 'Amina Bello',
      email: 'a.bello@enspd-udo.cm',
      passwordHash: hashPassword('password123'),
      telephone: '+237 680 99 11 22',
      role: 'membre',
      status: 'actif',
      pole: 'Dev & Cloud',
      matricule: '24P095',
      level: 'GIT 2',
      points: 175,
      rankTitle: 'Bronze Tech',
      attendanceRate: 92,
      completedTasksCount: 9,
      joinedDate: '2024-10-12',
    },
    {
      id: 'usr-6',
      name: 'Yannick Mbouma',
      email: 'y.mbouma@enspd-udo.cm',
      passwordHash: hashPassword('password123'),
      telephone: '+237 691 33 44 55',
      role: 'chef_projet',
      status: 'actif',
      pole: 'Cybersécurité',
      matricule: '22P441',
      level: 'GIT 4',
      points: 590,
      rankTitle: 'Argent Poly',
      attendanceRate: 91,
      completedTasksCount: 26,
      joinedDate: '2023-01-20',
    },
    {
      id: 'usr-7',
      name: 'Brice Tchoupo',
      email: 'b.tchoupo@enspd-udo.cm',
      passwordHash: hashPassword('password123'),
      telephone: '+237 670 22 19 88',
      role: 'membre',
      status: 'en_attente',
      pole: 'IA & Data Science',
      matricule: '25P104',
      level: 'GIT 1',
      points: 0,
      rankTitle: 'Initié GIT',
      attendanceRate: 100,
      completedTasksCount: 0,
      joinedDate: '2026-11-12',
    },
  ],
  tokens: {},
  projects: [
    {
      id: 'proj-1',
      title: 'Smart Campus IoT & Énergie ENSPD',
      shortDesc: 'Réseau de capteurs LoRaWAN pour la surveillance énergétique et environnementale des amphis.',
      fullDesc: 'Architecture IoT combinant microcontrôleurs ESP32, capteurs de consommation électrique et qualité de l’air, passerelle LoRaWAN et tableau de supervision pour les services techniques du campus.',
      pole: 'Systèmes Embarqués',
      status: 'En production',
      leadId: 'usr-4',
      leadName: 'Christian Kamdem',
      image: '/src/assets/images/project_iot_smart_campus_1794513911695.jpg',
      tags: ['ESP32', 'LoRaWAN', 'MQTT', 'React', 'TimescaleDB'],
      githubUrl: 'https://github.com/CLUB-GIT-ENSPD/smart-campus-iot',
      membersCount: 6,
      progress: 88,
      featured: true,
      tasksCount: 18,
      completedTasks: 16
    },
    {
      id: 'proj-2',
      title: 'PolyRoute Réseau Télécoms',
      shortDesc: 'Modélisation et planification des liaisons fibre optique et faisceaux hertziens.',
      fullDesc: 'Outil de simulation de couverture radio et de calcul de bilan de liaison développé par le pôle Réseaux & Télécoms pour estimer les pertes en espace libre et optimiser le placement des relais.',
      pole: 'Réseaux & Télécoms',
      status: 'En R&D',
      leadId: 'usr-3',
      leadName: 'Samuel Eboa',
      image: '/src/assets/images/project_ai_telecom_1794513912713.jpg',
      tags: ['Python', 'GIS', 'NetworkX', 'FastAPI'],
      githubUrl: 'https://github.com/CLUB-GIT-ENSPD/poly-route-telecom',
      membersCount: 5,
      progress: 65,
      featured: true,
      tasksCount: 14,
      completedTasks: 9
    },
    {
      id: 'proj-3',
      title: 'Portail Club GIT (PWA)',
      shortDesc: 'Application web et mobile de gestion des projets, tâches, présences QR et forum interne.',
      fullDesc: 'Application officielle du Club GIT ENSPD intégrant gestion agile des tâches, génération de QR codes de présence pour les séances de labo, suivi des primes et forum technique.',
      pole: 'Dev & Cloud',
      status: 'En production',
      leadId: 'usr-1',
      leadName: 'Kevin Ndongo',
      image: '/src/assets/images/hero_enspd_tech_hub_1794513911161.jpg',
      tags: ['React 19', 'TypeScript', 'Tailwind CSS', 'PWA', 'Express'],
      githubUrl: 'https://github.com/CLUB-GIT-ENSPD/CLUB-GIT',
      membersCount: 8,
      progress: 95,
      featured: true,
      tasksCount: 24,
      completedTasks: 23
    },
    {
      id: 'proj-4',
      title: 'CamHealth — Aide au Triage Médical',
      shortDesc: 'Modèle d’inférence locale pour l’assistance diagnostique sur matériel léger.',
      fullDesc: 'Pipeline de traitement d’images médicales conçu pour fonctionner hors ligne sur des serveurs légers en environnement contraint.',
      pole: 'IA & Data Science',
      status: 'Prototype',
      leadId: 'usr-2',
      leadName: 'Marcelle Fotso',
      image: '/src/assets/images/hackathon_git_challenge_1794513912534.jpg',
      tags: ['PyTorch', 'ONNX Runtime', 'OpenCV', 'Docker'],
      githubUrl: 'https://github.com/CLUB-GIT-ENSPD/camhealth-ai',
      membersCount: 7,
      progress: 72,
      featured: false,
      tasksCount: 16,
      completedTasks: 11
    },
    {
      id: 'proj-5',
      title: 'CyberShield — Sondes & Analyse Lab',
      shortDesc: 'Détection d’intrusions et analyse de trafic sur le réseau expérimental du labo.',
      fullDesc: 'Déploiement de sondes Suricata et de nœuds d’analyse isolés pour observer les flux suspects sur le sous-réseau du laboratoire informatique.',
      pole: 'Cybersécurité',
      status: 'En R&D',
      leadId: 'usr-6',
      leadName: 'Yannick Mbouma',
      image: '/src/assets/images/hero_enspd_tech_hub_1794513911161.jpg',
      tags: ['Suricata', 'ELK', 'Bash', 'Wireshark'],
      githubUrl: 'https://github.com/CLUB-GIT-ENSPD/cybershield-ids',
      membersCount: 4,
      progress: 54,
      featured: false,
      tasksCount: 12,
      completedTasks: 6
    }
  ],
  tasks: [
    {
      id: 'tsk-1',
      projectId: 'proj-1',
      projectTitle: 'Smart Campus IoT',
      title: 'Calibrer les sondes de courant CT non invasives',
      description: 'Tester l’échantillonnage ADC sur l’ESP32 en salle machine pour éviter la saturation du convertisseur.',
      assignedToId: 'usr-4',
      assignedToName: 'Christian Kamdem',
      status: 'done',
      priority: 'Haute',
      points: 40,
      dueDate: '2026-11-14',
      createdAt: '2026-11-05'
    },
    {
      id: 'tsk-2',
      projectId: 'proj-1',
      projectTitle: 'Smart Campus IoT',
      title: 'Configurer le broker MQTTS avec TLS mutuel',
      description: 'Sécuriser les échanges entre le broker Mosquitto et les capteurs ESP32 du campus.',
      assignedToId: 'usr-4',
      assignedToName: 'Christian Kamdem',
      status: 'in_progress',
      priority: 'Urgente',
      points: 50,
      dueDate: '2026-11-20',
      createdAt: '2026-11-08'
    },
    {
      id: 'tsk-3',
      projectId: 'proj-3',
      projectTitle: 'Portail Club GIT',
      title: 'Intégrer le mode hors-ligne et le manifest PWA',
      description: 'Permettre l’installation sur Android/iOS et le cache des données de séance.',
      assignedToId: 'usr-5',
      assignedToName: 'Amina Bello',
      status: 'review',
      priority: 'Haute',
      points: 35,
      dueDate: '2026-11-15',
      createdAt: '2026-11-07'
    },
    {
      id: 'tsk-4',
      projectId: 'proj-2',
      projectTitle: 'PolyRoute Réseau Télécoms',
      title: 'Calculer l’ellipsoïde de Fresnel sur Douala-Bassa',
      description: 'Implémenter le calcul d’obstacles topographiques à partir des données SRTM.',
      assignedToId: 'usr-3',
      assignedToName: 'Samuel Eboa',
      status: 'in_progress',
      priority: 'Moyenne',
      points: 45,
      dueDate: '2026-11-25',
      createdAt: '2026-11-10'
    },
    {
      id: 'tsk-5',
      projectId: 'proj-4',
      projectTitle: 'CamHealth',
      title: 'Quantifier le modèle PyTorch en INT8',
      description: 'Réduire la taille mémoire du modèle sous 85 Mo pour exécution CPU.',
      assignedToId: 'usr-2',
      assignedToName: 'Marcelle Fotso',
      status: 'todo',
      priority: 'Haute',
      points: 60,
      dueDate: '2026-11-30',
      createdAt: '2026-11-11'
    },
    {
      id: 'tsk-6',
      projectId: 'proj-5',
      projectTitle: 'CyberShield',
      title: 'Écrire les règles de détection ARP spoofing',
      description: 'Configurer les alertes sur le switch expérimental du laboratoire.',
      assignedToId: 'usr-6',
      assignedToName: 'Yannick Mbouma',
      status: 'todo',
      priority: 'Moyenne',
      points: 30,
      dueDate: '2026-12-02',
      createdAt: '2026-11-12'
    }
  ],
  sessions: [
    {
      id: 'ses-101',
      title: 'Séance hebdomadaire & revue de sprint',
      date: '2026-11-14',
      startTime: '10:00',
      endTime: '13:00',
      location: 'Labo Info 304 · ENSPD',
      qrCodeValue: 'CLUBGIT_ENSPD_SES101_ACTIVE_TOKEN',
      active: true,
      pointsAwarded: 20
    },
    {
      id: 'ses-100',
      title: 'Atelier Réseaux & Protocoles de routage',
      date: '2026-11-07',
      startTime: '14:00',
      endTime: '17:00',
      location: 'Amphi 250 · ENSPD',
      qrCodeValue: 'CLUBGIT_ENSPD_SES100_ARCHIVED',
      active: false,
      pointsAwarded: 25
    }
  ],
  attendances: [
    {
      id: 'att-1',
      sessionId: 'ses-101',
      sessionTitle: 'Séance hebdomadaire & revue de sprint',
      userId: 'usr-1',
      userName: 'Kevin Ndongo',
      userMatricule: '21P249',
      timestamp: '2026-11-14T09:55:00Z',
      status: 'Présent',
      pointsEarned: 20
    },
    {
      id: 'att-2',
      sessionId: 'ses-101',
      sessionTitle: 'Séance hebdomadaire & revue de sprint',
      userId: 'usr-2',
      userName: 'Marcelle Fotso',
      userMatricule: '22P118',
      timestamp: '2026-11-14T09:58:00Z',
      status: 'Présent',
      pointsEarned: 20
    },
    {
      id: 'att-3',
      sessionId: 'ses-101',
      sessionTitle: 'Séance hebdomadaire & revue de sprint',
      userId: 'usr-4',
      userName: 'Christian Kamdem',
      userMatricule: '23P314',
      timestamp: '2026-11-14T10:14:00Z',
      status: 'En retard',
      pointsEarned: 10
    }
  ],
  infractions: [
    {
      id: 'inf-1',
      userId: 'usr-4',
      userName: 'Christian Kamdem',
      userMatricule: '23P314',
      reason: 'Retard de 15 min à la séance plénière sans justification préalable.',
      penaltyPoints: -10,
      date: '2026-11-14',
      censeurName: 'Samuel Eboa',
      resolved: false
    },
    {
      id: 'inf-2',
      userId: 'usr-5',
      userName: 'Amina Bello',
      userMatricule: '24P095',
      reason: 'Remise tardive d’un livrable de sprint.',
      penaltyPoints: -15,
      date: '2026-10-28',
      censeurName: 'Samuel Eboa',
      resolved: true
    }
  ],
  forumPosts: [
    {
      id: 'post-1',
      authorId: 'usr-2',
      authorName: 'Marcelle Fotso',
      authorAvatar: '',
      authorRole: 'chef_projet',
      title: 'Optimisation de l’inférence ONNX sur Raspberry Pi 4',
      content: 'Dans le cadre de CamHealth, nous avons un goulot d’étranglement sur la convolution 2D sur Cortex-A72. Des retours sur la quantification INT8 ou la configuration des threads ?',
      codeSnippet: `import onnxruntime as ort\n\nso = ort.SessionOptions()\nso.graph_optimization_level = ort.GraphOptimizationLevel.ORT_ENABLE_ALL\nso.intra_op_num_threads = 4\n\nsession = ort.InferenceSession("model_camhealth.onnx", so, providers=['CPUExecutionProvider'])`,
      tags: ['IA & Data', 'ONNX', 'Embedded'],
      upvotes: 18,
      repliesCount: 1,
      createdAt: '2026-11-10T14:20:00Z',
      replies: [
        {
          id: 'rep-1',
          authorId: 'usr-1',
          authorName: 'Kevin Ndongo',
          authorAvatar: '',
          authorRole: 'admin',
          content: 'Sur Pi 4, la quantification dynamique INT8 via onnxruntime.quantization a réduit la latence d’environ 2.8x lors des tests au labo.',
          upvotes: 9,
          createdAt: '2026-11-10T16:05:00Z',
          isAcceptedSolution: true
        }
      ]
    },
    {
      id: 'post-2',
      authorId: 'usr-4',
      authorName: 'Christian Kamdem',
      authorAvatar: '',
      authorRole: 'membre',
      title: 'Bandes LoRa autorisées au Cameroun : 868 MHz vs 433 MHz',
      content: 'Pour le projet Smart Campus, devons-nous rester sur la bande EU868 ou basculer sur 433 MHz selon les directives de l’ART ?',
      tags: ['Télécoms', 'IoT', 'LoRa'],
      upvotes: 12,
      repliesCount: 1,
      createdAt: '2026-11-11T09:15:00Z',
      replies: [
        {
          id: 'rep-2',
          authorId: 'usr-3',
          authorName: 'Samuel Eboa',
          authorAvatar: '',
          authorRole: 'censeur',
          content: 'La bande 868.1–868.5 MHz avec ERP <= 25 mW et duty cycle 1% est utilisée sans interférence sur le campus.',
          upvotes: 7,
          createdAt: '2026-11-11T11:40:00Z',
          isAcceptedSolution: true
        }
      ]
    }
  ],
  events: [
    {
      id: 'evt-1',
      title: 'Hackathon GIT 48H — Solutions pour la Cité',
      type: 'Hackathon',
      date: '27 – 29 Novembre 2026',
      time: '48h',
      location: 'Lab Info & Amphi 500 · ENSPD',
      description: 'Édition annuelle réunissant les équipes de l’ENSPD pour concevoir et prototyper des solutions logicielles ou matérielles en 48 heures.',
      speaker: 'Comité Technique Club GIT',
      registeredCount: 68,
      capacity: 100,
      bannerImage: '/src/assets/images/hackathon_git_challenge_1794513912534.jpg',
      isUpcoming: true
    },
    {
      id: 'evt-2',
      title: 'Atelier Pratique : Conteneurs & Déploiement k3s',
      type: 'Atelier',
      date: 'Samedi 21 Novembre 2026',
      time: '09h00 – 13h00',
      location: 'Salle Machine 2 · Campus Bassa',
      description: 'Mise en place d’un cluster léger k3s, configuration de reverse proxy et supervision des services.',
      speaker: 'Kevin Ndongo (GIT 5)',
      registeredCount: 38,
      capacity: 45,
      bannerImage: '/src/assets/images/hero_enspd_tech_hub_1794513911161.jpg',
      isUpcoming: true
    }
  ],
  eventRegistrations: {},
  candidatures: [],
};

function loadDb(): DbState {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (fs.existsSync(DB_FILE)) {
      const raw = fs.readFileSync(DB_FILE, 'utf-8');
      return JSON.parse(raw) as DbState;
    }
    fs.writeFileSync(DB_FILE, JSON.stringify(SEED_DATA, null, 2));
    return structuredClone(SEED_DATA);
  } catch {
    return structuredClone(SEED_DATA);
  }
}

let db: DbState = loadDb();

function saveDb() {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2));
  } catch {
    // ignore fs write failures in read-only environments
  }
}

function sanitizeUser(u: DbUser) {
  const { passwordHash, ...rest } = u;
  return { ...rest, avatar: '' };
}

interface AuthRequest extends Request {
  user?: DbUser;
  token?: string;
}

function requireAuth(req: AuthRequest, res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  const token = header?.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token || !db.tokens[token]) {
    res.status(401).json({ message: 'Authentification requise.' });
    return;
  }
  const userId = db.tokens[token];
  const user = db.users.find(u => u.id === userId);
  if (!user) {
    res.status(401).json({ message: 'Session expirée.' });
    return;
  }
  if (user.status !== 'actif') {
    res.status(403).json({ message: 'Compte non actif ou en attente de validation.' });
    return;
  }
  req.user = user;
  req.token = token;
  next();
}

function requireRoles(...roles: Role[]) {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      res.status(403).json({ message: 'Accès refusé pour votre rôle.' });
      return;
    }
    next();
  };
}

async function startServer() {
  const app = express();
  app.use(express.json());

  // =========================================================================
  // 1. ROUTES PUBLIQUES (Consultant / Visiteur - Sans Authentification)
  // =========================================================================
  app.get('/api/public/projects', (_req, res) => {
    res.json({ data: db.projects });
  });

  app.get('/api/public/top-members', (_req, res) => {
    const activeMembers = db.users
      .filter(u => u.status === 'actif')
      .sort((a, b) => b.points - a.points)
      .slice(0, 10)
      .map(u => ({
        id: u.id,
        name: u.name,
        pole: u.pole,
        level: u.level,
        points: u.points,
        rankTitle: u.rankTitle,
        attendanceRate: u.attendanceRate,
        completedTasksCount: u.completedTasksCount,
      }));
    res.json({ data: activeMembers });
  });

  app.get('/api/public/events', (_req, res) => {
    res.json({ data: db.events });
  });

  // =========================================================================
  // 2. ROUTES D'AUTHENTIFICATION (Login, Register, Logout, Me)
  // =========================================================================
  app.post('/api/login', (req, res) => {
    const { email, password } = req.body || {};
    if (!email || !password) {
      res.status(400).json({ message: 'Email et mot de passe requis.' });
      return;
    }
    const user = db.users.find(u => u.email.toLowerCase() === String(email).toLowerCase());
    if (!user || user.passwordHash !== hashPassword(password)) {
      res.status(401).json({ message: 'Identifiants incorrects.' });
      return;
    }
    if (user.status === 'en_attente') {
      res.status(403).json({ message: 'Votre compte est en attente de validation par un administrateur.' });
      return;
    }
    if (user.status === 'suspendu' || user.status === 'renvoye') {
      res.status(403).json({ message: 'Votre compte a été suspendu ou désactivé.' });
      return;
    }
    const token = crypto.randomBytes(24).toString('hex');
    db.tokens[token] = user.id;
    saveDb();
    res.json({ user: sanitizeUser(user), token });
  });

  app.post('/api/register', (req, res) => {
    const { name, nom, prenom, email, password, password_confirmation, telephone, matricule, level, pole } = req.body || {};
    const fullName = name || [prenom, nom].filter(Boolean).join(' ').trim();

    if (!fullName || !email || !password) {
      res.status(400).json({ message: 'Nom, email et mot de passe sont obligatoires.' });
      return;
    }
    if (password_confirmation !== undefined && password !== password_confirmation) {
      res.status(400).json({ message: 'Les mots de passe ne correspondent pas.' });
      return;
    }
    if (db.users.some(u => u.email.toLowerCase() === String(email).toLowerCase())) {
      res.status(409).json({ message: 'Un compte existe déjà avec cet email.' });
      return;
    }

    const newUser: DbUser = {
      id: `usr-${Date.now()}`,
      name: fullName,
      email: String(email).trim(),
      passwordHash: hashPassword(password),
      telephone: telephone || '',
      role: 'membre',
      status: 'en_attente', // En attente de validation par l'Admin !
      pole: pole || 'Dev & Cloud',
      matricule: (matricule || `26P${Math.floor(100 + Math.random() * 899)}`).toUpperCase(),
      level: level || 'GIT 1',
      points: 0,
      rankTitle: 'Initié GIT',
      attendanceRate: 100,
      completedTasksCount: 0,
      joinedDate: new Date().toISOString().split('T')[0],
    };

    db.users.push(newUser);
    saveDb();
    res.status(201).json({
      message: 'Inscription envoyée. Un administrateur validera votre compte prochainement.',
      user: sanitizeUser(newUser),
    });
  });

  app.post('/api/logout', (req: AuthRequest, res) => {
    const header = req.headers.authorization;
    const token = header?.startsWith('Bearer ') ? header.slice(7) : null;
    if (token && db.tokens[token]) {
      delete db.tokens[token];
      saveDb();
    }
    res.json({ message: 'Déconnecté.' });
  });

  app.get('/api/me', requireAuth, (req: AuthRequest, res) => {
    res.json({ user: sanitizeUser(req.user!) });
  });

  // =========================================================================
  // 3. ROUTES UTILISATEURS CONNECTÉS (Membre, Chef, Censeur, Admin)
  // =========================================================================
  app.get('/api/projects', requireAuth, (_req, res) => {
    res.json({ data: db.projects });
  });

  app.post('/api/projects', requireAuth, requireRoles('chef_projet', 'admin'), (req: AuthRequest, res) => {
    const { title, shortDesc, fullDesc, pole, status, tags } = req.body || {};
    if (!title || !shortDesc) {
      res.status(400).json({ message: 'Titre et résumé requis.' });
      return;
    }
    const proj = {
      id: `proj-${Date.now()}`,
      title,
      shortDesc,
      fullDesc: fullDesc || shortDesc,
      pole: pole || 'Dev & Cloud',
      status: status || 'En R&D',
      leadId: req.user!.id,
      leadName: req.user!.name,
      image: '/src/assets/images/hero_enspd_tech_hub_1794513911161.jpg',
      tags: Array.isArray(tags) ? tags : [],
      membersCount: 1,
      progress: 5,
      featured: false,
      tasksCount: 0,
      completedTasks: 0,
    };
    db.projects.unshift(proj);
    saveDb();
    res.status(201).json({ data: proj });
  });

  app.post('/api/projects/:id/candidater', requireAuth, (req: AuthRequest, res) => {
    const projectId = req.params.id;
    const { motivation } = req.body || {};
    const existing = db.candidatures.find(c => c.projectId === projectId && c.userId === req.user!.id);
    if (existing) {
      res.status(409).json({ message: 'Vous avez déjà postulé à ce projet.' });
      return;
    }
    const cand = {
      id: `cand-${Date.now()}`,
      projectId,
      userId: req.user!.id,
      userName: req.user!.name,
      motivation: motivation || 'Je souhaite contribuer à ce projet.',
      status: 'en_attente',
      createdAt: new Date().toISOString().split('T')[0],
    };
    db.candidatures.unshift(cand);
    saveDb();
    res.status(201).json({ data: cand });
  });

  app.get('/api/mes-candidatures', requireAuth, (req: AuthRequest, res) => {
    res.json({ data: db.candidatures.filter(c => c.userId === req.user!.id) });
  });

  app.get('/api/tasks', requireAuth, (_req, res) => {
    res.json({ data: db.tasks });
  });

  app.post('/api/tasks', requireAuth, (req: AuthRequest, res) => {
    const { projectId, title, description, assignedToId, priority, points, dueDate } = req.body || {};
    if (!title) {
      res.status(400).json({ message: 'Titre de tâche requis.' });
      return;
    }
    const proj = db.projects.find(p => p.id === projectId);
    const assignee = db.users.find(u => u.id === assignedToId) || req.user!;
    const newTask = {
      id: `tsk-${Date.now()}`,
      projectId: projectId || db.projects[0]?.id,
      projectTitle: proj ? proj.title : 'Projet GIT',
      title,
      description: description || '',
      assignedToId: assignee.id,
      assignedToName: assignee.name,
      status: 'todo',
      priority: priority || 'Moyenne',
      points: Number(points) || 30,
      dueDate: dueDate || new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
      createdAt: new Date().toISOString().split('T')[0],
    };
    db.tasks.unshift(newTask);
    if (proj) proj.tasksCount += 1;
    saveDb();
    res.status(201).json({ data: newTask });
  });

  app.put('/api/tasks/:id', requireAuth, (req, res) => {
    const { status } = req.body || {};
    const task = db.tasks.find(t => t.id === req.params.id);
    if (!task) {
      res.status(404).json({ message: 'Tâche introuvable.' });
      return;
    }
    const wasNotDone = task.status !== 'done';
    task.status = status;
    if (wasNotDone && status === 'done') {
      const assignee = db.users.find(u => u.id === task.assignedToId);
      if (assignee) {
        assignee.points += task.points;
        assignee.completedTasksCount += 1;
        assignee.rankTitle = getRankTitle(assignee.points);
      }
    }
    saveDb();
    res.json({ data: task });
  });

  // Sessions & Présences
  app.get('/api/sessions', requireAuth, (_req, res) => {
    res.json({ data: db.sessions });
  });

  app.post('/api/sessions', requireAuth, requireRoles('censeur', 'admin'), (req, res) => {
    const { title, location, pointsAwarded } = req.body || {};
    const newSession = {
      id: `ses-${Date.now()}`,
      title: title || 'Séance Technique',
      date: new Date().toISOString().split('T')[0],
      startTime: '10:00',
      endTime: '13:00',
      location: location || 'Labo Info 304 · ENSPD',
      qrCodeValue: `CLUBGIT_ENSPD_${Date.now()}`,
      active: true,
      pointsAwarded: Number(pointsAwarded) || 20,
    };
    db.sessions.forEach(s => { s.active = false; });
    db.sessions.unshift(newSession);
    saveDb();
    res.status(201).json({ data: newSession });
  });

  app.put('/api/sessions/:id/toggle', requireAuth, requireRoles('censeur', 'admin'), (req, res) => {
    const s = db.sessions.find(ses => ses.id === req.params.id);
    if (!s) {
      res.status(404).json({ message: 'Séance introuvable.' });
      return;
    }
    s.active = !s.active;
    saveDb();
    res.json({ data: s });
  });

  app.get('/api/presences', requireAuth, (req: AuthRequest, res) => {
    if (req.user!.role === 'censeur' || req.user!.role === 'admin') {
      res.json({ data: db.attendances });
    } else {
      res.json({ data: db.attendances.filter(a => a.userId === req.user!.id) });
    }
  });

  app.post('/api/presences/scan', requireAuth, (req: AuthRequest, res) => {
    const { code } = req.body || {};
    const activeSession = db.sessions.find(s => s.active);
    if (!activeSession) {
      res.status(400).json({ message: 'Aucune séance active n’est ouverte actuellement.' });
      return;
    }
    const trimmed = String(code || '').trim();
    if (trimmed && trimmed !== activeSession.qrCodeValue && !trimmed.startsWith('CLUBGIT_')) {
      res.status(400).json({ message: 'Code de séance invalide.' });
      return;
    }
    const existing = db.attendances.find(
      a => a.sessionId === activeSession.id && a.userId === req.user!.id
    );
    if (existing) {
      res.status(409).json({ message: `Présence déjà validée pour cette séance.` });
      return;
    }
    const earned = activeSession.pointsAwarded;
    const record = {
      id: `att-${Date.now()}`,
      sessionId: activeSession.id,
      sessionTitle: activeSession.title,
      userId: req.user!.id,
      userName: req.user!.name,
      userMatricule: req.user!.matricule,
      timestamp: new Date().toISOString(),
      status: 'Présent',
      pointsEarned: earned,
    };
    db.attendances.unshift(record);
    req.user!.points += earned;
    req.user!.rankTitle = getRankTitle(req.user!.points);
    saveDb();
    res.status(201).json({ data: record, pointsEarned: earned, user: sanitizeUser(req.user!) });
  });

  // Infractions (Censeur & Admin voient tout, Membre voit son dossier)
  app.get('/api/infractions', requireAuth, (req: AuthRequest, res) => {
    if (req.user!.role === 'censeur' || req.user!.role === 'admin') {
      res.json({ data: db.infractions });
    } else {
      res.json({ data: db.infractions.filter(i => i.userId === req.user!.id) });
    }
  });

  app.post('/api/infractions', requireAuth, requireRoles('censeur', 'admin'), (req: AuthRequest, res) => {
    const { userId, reason, penaltyPoints } = req.body || {};
    const target = db.users.find(u => u.id === userId);
    if (!target || !reason) {
      res.status(400).json({ message: 'Membre et motif requis.' });
      return;
    }
    const penalty = -Math.abs(Number(penaltyPoints) || 10);
    const inf = {
      id: `inf-${Date.now()}`,
      userId: target.id,
      userName: target.name,
      userMatricule: target.matricule,
      reason,
      penaltyPoints: penalty,
      date: new Date().toISOString().split('T')[0],
      censeurName: req.user!.name,
      resolved: false,
    };
    db.infractions.unshift(inf);
    target.points = Math.max(0, target.points + penalty);
    target.rankTitle = getRankTitle(target.points);
    saveDb();
    res.status(201).json({ data: inf });
  });

  app.put('/api/infractions/:id/resolve', requireAuth, requireRoles('censeur', 'admin'), (req, res) => {
    const inf = db.infractions.find(i => i.id === req.params.id);
    if (!inf) {
      res.status(404).json({ message: 'Infraction introuvable.' });
      return;
    }
    inf.resolved = true;
    saveDb();
    res.json({ data: inf });
  });

  // Forum
  app.get('/api/forum', requireAuth, (_req, res) => {
    res.json({ data: db.forumPosts });
  });

  app.post('/api/forum', requireAuth, (req: AuthRequest, res) => {
    const { title, content, tags, codeSnippet } = req.body || {};
    if (!title || !content) {
      res.status(400).json({ message: 'Titre et contenu requis.' });
      return;
    }
    const post = {
      id: `post-${Date.now()}`,
      authorId: req.user!.id,
      authorName: req.user!.name,
      authorAvatar: '',
      authorRole: req.user!.role,
      title,
      content,
      codeSnippet,
      tags: Array.isArray(tags) ? tags : [],
      upvotes: 1,
      repliesCount: 0,
      createdAt: new Date().toISOString(),
      replies: [],
    };
    db.forumPosts.unshift(post);
    req.user!.points += 15;
    req.user!.rankTitle = getRankTitle(req.user!.points);
    saveDb();
    res.status(201).json({ data: post });
  });

  app.post('/api/forum/:id/reply', requireAuth, (req: AuthRequest, res) => {
    const { content } = req.body || {};
    const post = db.forumPosts.find(p => p.id === req.params.id);
    if (!post || !content) {
      res.status(400).json({ message: 'Sujet ou contenu invalide.' });
      return;
    }
    const reply = {
      id: `rep-${Date.now()}`,
      authorId: req.user!.id,
      authorName: req.user!.name,
      authorAvatar: '',
      authorRole: req.user!.role,
      content,
      upvotes: 0,
      createdAt: new Date().toISOString(),
    };
    post.replies.push(reply);
    post.repliesCount += 1;
    req.user!.points += 10;
    req.user!.rankTitle = getRankTitle(req.user!.points);
    saveDb();
    res.status(201).json({ data: reply });
  });

  app.post('/api/forum/:id/upvote', requireAuth, (req, res) => {
    const post = db.forumPosts.find(p => p.id === req.params.id);
    if (!post) {
      res.status(404).json({ message: 'Sujet introuvable.' });
      return;
    }
    post.userUpvoted = !post.userUpvoted;
    post.upvotes += post.userUpvoted ? 1 : -1;
    saveDb();
    res.json({ data: post });
  });

  // Événements (inscription membre connecté)
  app.post('/api/events/:id/register', requireAuth, (req: AuthRequest, res) => {
    const event = db.events.find(e => e.id === req.params.id);
    if (!event) {
      res.status(404).json({ message: 'Événement introuvable.' });
      return;
    }
    const list = db.eventRegistrations[event.id] || [];
    if (list.includes(req.user!.id)) {
      res.status(409).json({ message: 'Déjà inscrit à cet événement.' });
      return;
    }
    if (event.registeredCount >= event.capacity) {
      res.status(400).json({ message: 'Événement complet.' });
      return;
    }
    list.push(req.user!.id);
    db.eventRegistrations[event.id] = list;
    event.registeredCount += 1;
    saveDb();
    res.json({ data: event });
  });

  // Annuaire lecture seule pour Censeur & Membres actifs
  app.get('/api/users/directory', requireAuth, (_req, res) => {
    const active = db.users
      .filter(u => u.status === 'actif')
      .map(sanitizeUser);
    res.json({ data: active });
  });

  // =========================================================================
  // 4. ROUTES ADMIN STRICTES (/api/admin/*)
  // =========================================================================
  app.get('/api/admin/inscriptions', requireAuth, requireRoles('admin'), (_req, res) => {
    const pending = db.users.filter(u => u.status === 'en_attente').map(sanitizeUser);
    res.json(pending);
  });

  app.put('/api/admin/inscriptions/:id/valider', requireAuth, requireRoles('admin'), (req, res) => {
    const user = db.users.find(u => u.id === req.params.id);
    if (!user) {
      res.status(404).json({ message: 'Inscription introuvable.' });
      return;
    }
    user.status = 'actif';
    user.points = Math.max(user.points, 50); // Bonus de bienvenue à la validation
    user.rankTitle = getRankTitle(user.points);
    saveDb();
    res.json({ message: 'Inscription validée.', user: sanitizeUser(user) });
  });

  app.put('/api/admin/inscriptions/:id/rejeter', requireAuth, requireRoles('admin'), (req, res) => {
    const idx = db.users.findIndex(u => u.id === req.params.id);
    if (idx === -1) {
      res.status(404).json({ message: 'Inscription introuvable.' });
      return;
    }
    db.users.splice(idx, 1);
    saveDb();
    res.json({ message: 'Inscription rejetée.' });
  });

  app.get('/api/admin/users', requireAuth, requireRoles('admin'), (req, res) => {
    const roleFilter = req.query.role ? String(req.query.role) : '';
    const statusFilter = req.query.statut ? String(req.query.statut) : '';
    let result = db.users;
    if (roleFilter) result = result.filter(u => u.role === roleFilter);
    if (statusFilter) result = result.filter(u => u.status === statusFilter);
    res.json(result.map(sanitizeUser));
  });

  app.put('/api/admin/users/:id/role', requireAuth, requireRoles('admin'), (req, res) => {
    const { role } = req.body || {};
    const user = db.users.find(u => u.id === req.params.id);
    if (!user || !['membre', 'chef_projet', 'censeur', 'admin'].includes(role)) {
      res.status(400).json({ message: 'Utilisateur ou rôle invalide.' });
      return;
    }
    user.role = role;
    saveDb();
    res.json({ user: sanitizeUser(user) });
  });

  app.put('/api/admin/users/:id/status', requireAuth, requireRoles('admin'), (req, res) => {
    const { status } = req.body || {};
    const user = db.users.find(u => u.id === req.params.id);
    if (!user || !['actif', 'en_attente', 'suspendu', 'renvoye'].includes(status)) {
      res.status(400).json({ message: 'Utilisateur ou statut invalide.' });
      return;
    }
    user.status = status;
    saveDb();
    res.json({ user: sanitizeUser(user) });
  });

  app.put('/api/admin/users/:id/points', requireAuth, requireRoles('admin'), (req, res) => {
    const { delta } = req.body || {};
    const user = db.users.find(u => u.id === req.params.id);
    if (!user) {
      res.status(404).json({ message: 'Utilisateur introuvable.' });
      return;
    }
    user.points = Math.max(0, user.points + Number(delta || 0));
    user.rankTitle = getRankTitle(user.points);
    saveDb();
    res.json({ user: sanitizeUser(user) });
  });

  app.delete('/api/admin/users/:id', requireAuth, requireRoles('admin'), (req: AuthRequest, res) => {
    if (req.params.id === req.user!.id) {
      res.status(400).json({ message: 'Impossible de supprimer votre propre compte admin.' });
      return;
    }
    const idx = db.users.findIndex(u => u.id === req.params.id);
    if (idx === -1) {
      res.status(404).json({ message: 'Utilisateur introuvable.' });
      return;
    }
    db.users.splice(idx, 1);
    saveDb();
    res.json({ message: 'Utilisateur supprimé.' });
  });

  app.get('/api/admin/stats', requireAuth, requireRoles('admin'), (_req, res) => {
    const activeUsers = db.users.filter(u => u.status === 'actif');
    const pendingCount = db.users.filter(u => u.status === 'en_attente').length;
    const avgAttendance = activeUsers.length
      ? Math.round(activeUsers.reduce((acc, u) => acc + u.attendanceRate, 0) / activeUsers.length)
      : 0;
    const totalPoints = activeUsers.reduce((acc, u) => acc + u.points, 0);
    const completedTasks = db.tasks.filter(t => t.status === 'done').length;

    const poleDistribution = activeUsers.reduce((acc: Record<string, number>, u) => {
      acc[u.pole] = (acc[u.pole] || 0) + 1;
      return acc;
    }, {});

    res.json({
      totalActiveUsers: activeUsers.length,
      pendingInscriptions: pendingCount,
      totalProjects: db.projects.length,
      totalTasks: db.tasks.length,
      completedTasks,
      avgAttendance,
      totalPoints,
      poleDistribution,
    });
  });

  // =========================================================================
  // 5. VITE DEV MIDDLEWARE / STATIC DIST
  // =========================================================================
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  const PORT = 3000;
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
