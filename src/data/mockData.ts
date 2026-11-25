import { User, Project, Task, AttendanceSession, AttendanceRecord, Infraction, ForumPost, EventItem, PrimeTier } from '../types';

export const INITIAL_USERS: User[] = [
  {
    id: 'usr-1',
    name: 'Kevin Ndongo',
    email: 'k.ndongo@enspd-udo.cm',
    role: 'admin',
    pole: 'Dev & Cloud',
    matricule: '21P249',
    level: 'GIT 5',
    points: 840,
    rankTitle: 'Or Innovateur',
    avatar: '',
    attendanceRate: 98,
    github: 'https://github.com/CLUB-GIT-ENSPD',
    completedTasksCount: 38,
    joinedDate: '2022-10-15',
  },
  {
    id: 'usr-2',
    name: 'Marcelle Fotso',
    email: 'm.fotso@enspd-udo.cm',
    role: 'chef_projet',
    pole: 'IA & Data Science',
    matricule: '22P118',
    level: 'GIT 4',
    points: 620,
    rankTitle: 'Or Innovateur',
    avatar: '',
    attendanceRate: 94,
    github: 'https://github.com/CLUB-GIT-ENSPD',
    completedTasksCount: 29,
    joinedDate: '2023-01-10',
  },
  {
    id: 'usr-3',
    name: 'Samuel Eboa',
    email: 's.eboa@enspd-udo.cm',
    role: 'censeur',
    pole: 'Réseaux & Télécoms',
    matricule: '21P082',
    level: 'GIT 5',
    points: 510,
    rankTitle: 'Argent Poly',
    avatar: '',
    attendanceRate: 100,
    github: 'https://github.com/CLUB-GIT-ENSPD',
    completedTasksCount: 22,
    joinedDate: '2022-10-15',
  },
  {
    id: 'usr-4',
    name: 'Christian Kamdem',
    email: 'c.kamdem@enspd-udo.cm',
    role: 'membre',
    pole: 'Systèmes Embarqués',
    matricule: '23P314',
    level: 'GIT 3',
    points: 285,
    rankTitle: 'Bronze Tech',
    avatar: '',
    attendanceRate: 88,
    github: 'https://github.com/CLUB-GIT-ENSPD',
    completedTasksCount: 14,
    joinedDate: '2023-10-05',
  },
  {
    id: 'usr-5',
    name: 'Amina Bello',
    email: 'a.bello@enspd-udo.cm',
    role: 'membre',
    pole: 'Dev & Cloud',
    matricule: '24P095',
    level: 'GIT 2',
    points: 175,
    rankTitle: 'Bronze Tech',
    avatar: '',
    attendanceRate: 92,
    github: 'https://github.com/CLUB-GIT-ENSPD',
    completedTasksCount: 9,
    joinedDate: '2024-10-12',
  },
  {
    id: 'usr-6',
    name: 'Yannick Mbouma',
    email: 'y.mbouma@enspd-udo.cm',
    role: 'chef_projet',
    pole: 'Cybersécurité',
    matricule: '22P441',
    level: 'GIT 4',
    points: 590,
    rankTitle: 'Argent Poly',
    avatar: '',
    attendanceRate: 91,
    github: 'https://github.com/CLUB-GIT-ENSPD',
    completedTasksCount: 26,
    joinedDate: '2023-01-20',
  }
];

export const INITIAL_PROJECTS: Project[] = [
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
    tags: ['React 19', 'TypeScript', 'Tailwind CSS', 'PWA', 'Vite'],
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
];

export const INITIAL_TASKS: Task[] = [
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
];

export const INITIAL_SESSIONS: AttendanceSession[] = [
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
];

export const INITIAL_ATTENDANCES: AttendanceRecord[] = [
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
];

export const INITIAL_INFRACTIONS: Infraction[] = [
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
];

export const PRIME_TIERS: PrimeTier[] = [
  {
    id: 'tier-1',
    name: 'Initié GIT',
    requiredPoints: 50,
    cashRewardFCFA: 'Attestation membre',
    perks: ['Accès aux dépôts GitHub du club', 'Participation aux ateliers hebdomadaires'],
    badgeColor: '',
    minAttendance: 75
  },
  {
    id: 'tier-2',
    name: 'Bronze Tech',
    requiredPoints: 150,
    cashRewardFCFA: '15 000 FCFA',
    perks: ['Accès prioritaire aux ateliers pratiques', 'Crédits d’hébergement pour projets'],
    badgeColor: '',
    minAttendance: 80
  },
  {
    id: 'tier-3',
    name: 'Argent Poly',
    requiredPoints: 300,
    cashRewardFCFA: '35 000 FCFA',
    perks: ['Prise en charge matériel (capteurs, cartes)', 'Recommandation pour stage académique'],
    badgeColor: '',
    minAttendance: 85
  },
  {
    id: 'tier-4',
    name: 'Or Innovateur',
    requiredPoints: 600,
    cashRewardFCFA: '75 000 FCFA',
    perks: ['Aide au passage de certification technique', 'Participation aux concours nationaux'],
    badgeColor: '',
    minAttendance: 90
  },
  {
    id: 'tier-5',
    name: 'Élite GIT',
    requiredPoints: 1000,
    cashRewardFCFA: '150 000 FCFA',
    perks: ['Bourse semestrielle du club', 'Soutien au prototypage de fin d’études'],
    badgeColor: '',
    minAttendance: 95
  }
];

export const INITIAL_FORUM_POSTS: ForumPost[] = [
  {
    id: 'post-1',
    authorId: 'usr-2',
    authorName: 'Marcelle Fotso',
    authorAvatar: '',
    authorRole: 'chef_projet',
    title: 'Optimisation de l’inférence ONNX sur Raspberry Pi 4',
    content: 'Dans le cadre de CamHealth, nous avons un goulot d’étranglement sur la convolution 2D sur Cortex-A72. Des retours sur la quantification INT8 ou la configuration des threads ?',
    codeSnippet: `import onnxruntime as ort

so = ort.SessionOptions()
so.graph_optimization_level = ort.GraphOptimizationLevel.ORT_ENABLE_ALL
so.intra_op_num_threads = 4

session = ort.InferenceSession("model_camhealth.onnx", so, providers=['CPUExecutionProvider'])`,
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
];

export const CLUB_EVENTS: EventItem[] = [
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
];
