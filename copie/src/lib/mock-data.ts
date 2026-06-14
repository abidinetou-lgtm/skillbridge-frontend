export interface Member {
  id: string;
  name: string;
  avatarColor: string;
  initials: string;
  bio: string;
  rating: number;
  teaches: string[];
  wants: string[];
  category: string;
}

export const CATEGORIES = [
  "Tous",
  "Développement",
  "Maths & Sciences",
  "Langues",
  "Design",
  "Musique",
  "Vie quotidienne",
];

export const MEMBERS: Member[] = [
  {
    id: "m1",
    name: "Léa Dubois",
    initials: "LD",
    avatarColor: "var(--peach)",
    bio: "L3 Info — passionnée de front-end et de typo.",
    rating: 4.9,
    teaches: ["React", "TypeScript", "CSS"],
    wants: ["Python", "Algorithmes"],
    category: "Développement",
  },
  {
    id: "m2",
    name: "Sami Benali",
    initials: "SB",
    avatarColor: "var(--mint)",
    bio: "M1 Maths appli. J'adore expliquer les démos.",
    rating: 4.8,
    teaches: ["Maths", "Algorithmes", "Python"],
    wants: ["Anglais", "Design UI"],
    category: "Maths & Sciences",
  },
  {
    id: "m3",
    name: "Inès Faure",
    initials: "IF",
    avatarColor: "var(--lavender)",
    bio: "Étudiante en design, je dessine tout le temps.",
    rating: 5.0,
    teaches: ["Design UI", "Figma", "Illustration"],
    wants: ["React", "HTML"],
    category: "Design",
  },
  {
    id: "m4",
    name: "Tom Marchand",
    initials: "TM",
    avatarColor: "var(--sky)",
    bio: "Cybersécu — CTF le weekend, cours en semaine.",
    rating: 4.7,
    teaches: ["Réseau", "Cybersécurité", "Linux"],
    wants: ["Docker", "Cloud"],
    category: "Développement",
  },
  {
    id: "m5",
    name: "Anaïs Rey",
    initials: "AR",
    avatarColor: "var(--sun)",
    bio: "Langues vivantes : EN/ES. On parle, on rit.",
    rating: 4.9,
    teaches: ["Anglais", "Espagnol"],
    wants: ["Guitare", "Cuisine"],
    category: "Langues",
  },
  {
    id: "m6",
    name: "Hugo Lefèvre",
    initials: "HL",
    avatarColor: "var(--rose)",
    bio: "Guitariste depuis 8 ans. Je transmets avec joie.",
    rating: 4.6,
    teaches: ["Guitare", "Théorie musicale"],
    wants: ["Anglais", "Photo"],
    category: "Musique",
  },
  {
    id: "m7",
    name: "Maya Costa",
    initials: "MC",
    avatarColor: "var(--peach)",
    bio: "Data sci. Pandas, plots et plein de café.",
    rating: 4.8,
    teaches: ["Data Science", "Python", "SQL"],
    wants: ["React", "Design"],
    category: "Développement",
  },
  {
    id: "m8",
    name: "Noah Petit",
    initials: "NP",
    avatarColor: "var(--mint)",
    bio: "Physique — j'aime les schémas clairs.",
    rating: 4.7,
    teaches: ["Physique", "Maths"],
    wants: ["Python"],
    category: "Maths & Sciences",
  },
  {
    id: "m9",
    name: "Jade Morel",
    initials: "JM",
    avatarColor: "var(--lavender)",
    bio: "Cuisine étudiante : bon, vite, pas cher.",
    rating: 5.0,
    teaches: ["Cuisine", "Pâtisserie"],
    wants: ["Anglais"],
    category: "Vie quotidienne",
  },
];

export const SUBJECTS = [
  { name: "React", kind: "tech" },
  { name: "Python", kind: "tech" },
  { name: "Git", kind: "tech" },
  { name: "Docker", kind: "tech" },
  { name: "TypeScript", kind: "tech" },
  { name: "Node.js", kind: "tech" },
  { name: "Maths", kind: "subj" },
  { name: "Physique", kind: "subj" },
  { name: "Réseau", kind: "subj" },
  { name: "Cybersécurité", kind: "subj" },
  { name: "Anglais", kind: "subj" },
  { name: "Base de données", kind: "subj" },
  { name: "Design UI", kind: "subj" },
  { name: "Data Science", kind: "subj" },
] as const;

export const PILLS = ["Maths", "React", "Anglais", "Python", "Design", "Algorithmes", "Réseau", "Git"];

export interface Session {
  id: string;
  title: string;
  with: string;
  initials: string;
  color: string;
  date: string;
  duration: number;
  credits: number;
  status: "À venir" | "En cours" | "Terminée" | "En attente";
  role: "teach" | "learn";
  details: string;
}

export const SESSIONS: Session[] = [
  { id: "s1", title: "Hooks React avancés", with: "Inès Faure", initials: "IF", color: "var(--lavender)", date: "Mer. 18 juin — 18:00", duration: 60, credits: 60, status: "À venir", role: "teach", details: "Survol useReducer, useCallback, useMemo. Tu prépares 2 questions concrètes." },
  { id: "s2", title: "Maths — Limites & dérivées", with: "Sami Benali", initials: "SB", color: "var(--mint)", date: "Jeu. 19 juin — 14:30", duration: 45, credits: 45, status: "À venir", role: "learn", details: "Reprise des limites classiques + exos type partiel." },
  { id: "s3", title: "Initiation Python", with: "Maya Costa", initials: "MC", color: "var(--peach)", date: "Lun. 16 juin — 11:00", duration: 30, credits: 30, status: "En cours", role: "learn", details: "Premiers pas, variables, listes." },
  { id: "s4", title: "Guitare — Accords ouverts", with: "Hugo Lefèvre", initials: "HL", color: "var(--rose)", date: "Sam. 14 juin — 16:00", duration: 60, credits: 60, status: "Terminée", role: "learn", details: "Tu as travaillé Am, Em, C, G. Belle progression." },
  { id: "s5", title: "Préparation oral anglais", with: "Anaïs Rey", initials: "AR", color: "var(--sun)", date: "Ven. 13 juin — 19:00", duration: 45, credits: 45, status: "Terminée", role: "teach", details: "Simulation entretien + retours de prononciation." },
  { id: "s6", title: "Algos — Tri & complexité", with: "Tom Marchand", initials: "TM", color: "var(--sky)", date: "Mar. 17 juin — 20:00", duration: 30, credits: 30, status: "En attente", role: "teach", details: "Tom attend ta confirmation." },
];

export interface Conversation {
  id: string;
  name: string;
  initials: string;
  color: string;
  preview: string;
  time: string;
  unread?: number;
  messages: { from: "me" | "them"; text: string; time: string; date: string }[];
}

export const CONVERSATIONS: Conversation[] = [
  {
    id: "c1", name: "Inès Faure", initials: "IF", color: "var(--lavender)",
    preview: "Parfait, à demain 18h !", time: "10:42", unread: 2,
    messages: [
      { from: "them", text: "Salut ! Toujours OK pour la session React ?", time: "10:30", date: "Aujourd'hui" },
      { from: "me", text: "Yes carrément. J'arrive avec 2 questions sur useReducer.", time: "10:34", date: "Aujourd'hui" },
      { from: "them", text: "Top, prévois aussi un petit composant à refactor ensemble.", time: "10:40", date: "Aujourd'hui" },
      { from: "them", text: "Parfait, à demain 18h !", time: "10:42", date: "Aujourd'hui" },
    ],
  },
  {
    id: "c2", name: "Sami Benali", initials: "SB", color: "var(--mint)",
    preview: "Je t'envoie le PDF des exos ce soir.", time: "Hier",
    messages: [
      { from: "me", text: "Hello ! Tu peux refaire la démo de la limite en 0 ?", time: "17:20", date: "Hier" },
      { from: "them", text: "Yes, je te montre proprement au tableau.", time: "17:28", date: "Hier" },
      { from: "them", text: "Je t'envoie le PDF des exos ce soir.", time: "21:12", date: "Hier" },
    ],
  },
  {
    id: "c3", name: "Hugo Lefèvre", initials: "HL", color: "var(--rose)",
    preview: "Merci pour la session, je m'éclate.", time: "Lun.",
    messages: [
      { from: "them", text: "Merci pour la session, je m'éclate.", time: "16:45", date: "Lundi" },
      { from: "me", text: "Avec plaisir ! On enchaîne sur les barrés ?", time: "17:10", date: "Lundi" },
    ],
  },
  {
    id: "c4", name: "Anaïs Rey", initials: "AR", color: "var(--sun)",
    preview: "Tu prépares l'intro et je corrige.", time: "Lun.",
    messages: [
      { from: "them", text: "Tu prépares l'intro et je corrige.", time: "09:00", date: "Lundi" },
    ],
  },
];

export interface CreditEntry {
  id: string;
  label: string;
  with: string;
  date: string;
  amount: number; // positive=gain
}

export const CREDIT_HISTORY: CreditEntry[] = [
  { id: "h1", label: "Cours React enseigné", with: "Inès Faure", date: "Aujourd'hui", amount: 60 },
  { id: "h2", label: "Cours Maths reçu", with: "Sami Benali", date: "Hier", amount: -45 },
  { id: "h3", label: "Cours Guitare reçu", with: "Hugo Lefèvre", date: "14 juin", amount: -60 },
  { id: "h4", label: "Cours Anglais enseigné", with: "Anaïs Rey", date: "13 juin", amount: 45 },
  { id: "h5", label: "Bienvenue sur SkillBridge", with: "—", date: "10 juin", amount: 60 },
];

export const CREDITS_BALANCE = 285;
export const CREDITS_CAP = 500;
export const CREDITS_EARNED = 420;
export const CREDITS_SPENT = 135;

export const SLOTS = ["Matin", "Midi", "Soir"] as const;
export const DAYS = ["Lun", "Mar", "Mer", "Jeu", "Ven"] as const;
