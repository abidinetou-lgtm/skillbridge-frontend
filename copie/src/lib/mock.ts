// Shared mock data for the SkillBridge UI mockup.

export type SkillCategory = "Langues" | "Tech" | "Arts" | "Sport" | "Business";

export interface Member {
  id: string;
  name: string;
  initials: string;
  bio: string;
  teaches: { name: string; category: SkillCategory }[];
  availability: string[];
  matches: boolean;
  rating?: number;
  color: string;
}

export const categoryColors: Record<SkillCategory, string> = {
  Langues: "bg-navy text-cream",
  Tech: "bg-navy text-cream",
  Arts: "bg-navy text-cream",
  Sport: "bg-navy text-cream",
  Business: "bg-navy text-cream",
};

export const members: Member[] = [
  {
    id: "1",
    name: "Camille Laurent",
    initials: "CL",
    bio: "Designer produit le jour, prof de piano le soir.",
    teaches: [
      { name: "Piano", category: "Arts" },
      { name: "UI Design", category: "Tech" },
    ],
    availability: ["Mon Morning", "Fri Evening"],
    matches: true,
    rating: 4.8,
    color: "#c8864b",
  },
  {
    id: "2",
    name: "Yanis Berkane",
    initials: "YB",
    bio: "Développeur full-stack, passionné d'escalade.",
    teaches: [
      { name: "React", category: "Tech" },
      { name: "TypeScript", category: "Tech" },
    ],
    availability: ["Tue Noon", "Thu Evening"],
    matches: true,
    rating: 4.6,
    color: "#3d5c28",
  },
  {
    id: "3",
    name: "Sofia Marchetti",
    initials: "SM",
    bio: "Bilingue IT/EN, j'adore transmettre les langues.",
    teaches: [
      { name: "Italien", category: "Langues" },
      { name: "Anglais", category: "Langues" },
    ],
    availability: ["Mon Evening", "Wed Morning"],
    matches: false,
    rating: 4.9,
    color: "#252840",
  },
  {
    id: "4",
    name: "Mahamane Touré",
    initials: "MT",
    bio: "Coach business & fondateur de 2 startups.",
    teaches: [
      { name: "Pitch", category: "Business" },
      { name: "Stratégie", category: "Business" },
    ],
    availability: ["Wed Noon", "Fri Morning"],
    matches: true,
    rating: 4.2,
    color: "#c8864b",
  },
  {
    id: "5",
    name: "Yahia Benali",
    initials: "YB",
    bio: "Photographe et monteur vidéo freelance.",
    teaches: [
      { name: "Photo", category: "Arts" },
      { name: "Montage", category: "Arts" },
    ],
    availability: ["Thu Morning", "Sat Noon"],
    matches: false,
    rating: 4.5,
    color: "#3d5c28",
  },
  {
    id: "6",
    name: "Jimel Ouattara",
    initials: "JO",
    bio: "Entraîneur de tennis, joueur depuis 15 ans.",
    teaches: [
      { name: "Tennis", category: "Sport" },
      { name: "Fitness", category: "Sport" },
    ],
    availability: ["Mon Morning", "Wed Evening"],
    matches: true,
    rating: 4.7,
    color: "#252840",
  },
];

export const feedPosts = [
  {
    id: "1",
    name: "Camille Laurent",
    handle: "@camille",
    initials: "CL",
    text: "Première session de piano donnée aujourd'hui sur SkillBridge — incroyable de transmettre 🎹 Mon élève a appris ses premiers accords !",
    tags: ["Piano", "Arts"],
    likes: 42,
    color: "#c8864b",
  },
  {
    id: "2",
    name: "Yanis Berkane",
    handle: "@yanis",
    initials: "YB",
    text: "J'ai échangé 2h de React contre 2h d'italien. Le concept de crédits change tout, zéro argent, juste du partage.",
    tags: ["React", "Tech"],
    likes: 67,
    color: "#3d5c28",
  },
  {
    id: "3",
    name: "Sofia Marchetti",
    handle: "@sofia",
    initials: "SM",
    text: "Cherche quelqu'un pour m'apprendre la guitare le week-end. J'offre des cours d'anglais en échange ! 🎸",
    tags: ["Anglais", "Langues"],
    likes: 31,
    color: "#252840",
  },
];

export const sessions = [
  {
    id: "1",
    partner: "Yanis Berkane",
    initials: "YB",
    title: "Initiation à React Hooks",
    date: "12 juin 2026 · 18:00",
    status: "upcoming" as const,
    credits: 60,
    role: "receive" as const,
    color: "#3d5c28",
  },
  {
    id: "2",
    partner: "Sofia Marchetti",
    initials: "SM",
    title: "Conversation anglais avancé",
    date: "9 juin 2026 · 12:30",
    status: "live" as const,
    credits: 60,
    role: "teach" as const,
    color: "#252840",
  },
  {
    id: "3",
    partner: "Camille Laurent",
    initials: "CL",
    title: "Cours de piano débutant",
    date: "2 juin 2026 · 19:00",
    status: "completed" as const,
    credits: 60,
    role: "teach" as const,
    color: "#c8864b",
  },
  {
    id: "4",
    partner: "Mahamane Touré",
    initials: "MT",
    title: "Préparer son pitch investisseurs",
    date: "28 mai 2026 · 14:00",
    status: "cancelled" as const,
    credits: 90,
    role: "receive" as const,
    color: "#c8864b",
  },
];

export const transactions = [
  { id: "1", label: "Session piano avec Camille", date: "2 juin 2026", amount: -60 },
  { id: "2", label: "Cours d'anglais donné à Léo", date: "30 mai 2026", amount: +60 },
  { id: "3", label: "Pack PLUS acheté", date: "27 mai 2026", amount: +180 },
  { id: "4", label: "Session React reçue", date: "21 mai 2026", amount: -60 },
  { id: "5", label: "Crédits de bienvenue", date: "15 mai 2026", amount: +120 },
];

export const conversations = [
  {
    id: "1",
    name: "Yanis Berkane",
    initials: "YB",
    last: "Parfait, on se cale jeudi alors !",
    time: "10:42",
    unread: 2,
    color: "#3d5c28",
  },
  {
    id: "2",
    name: "Sofia Marchetti",
    initials: "SM",
    last: "Je t'envoie les supports du cours 📎",
    time: "09:15",
    unread: 0,
    color: "#252840",
  },
  {
    id: "3",
    name: "Camille Laurent",
    initials: "CL",
    last: "Merci pour la session, c'était top !",
    time: "Hier",
    unread: 0,
    color: "#c8864b",
  },
];

export const days = ["Mon", "Tue", "Wed", "Thu", "Fri"];
export const slots = [
  { key: "Morning", label: "Morning", hint: "8–12" },
  { key: "Noon", label: "Noon", hint: "12–14" },
  { key: "Evening", label: "Evening", hint: "18–22" },
];

export const skillCatalog: Record<SkillCategory, string[]> = {
  Langues: ["Anglais", "Italien", "Espagnol", "Japonais", "Arabe"],
  Tech: ["React", "Python", "UI Design", "TypeScript", "Data"],
  Arts: ["Piano", "Guitare", "Photo", "Dessin", "Montage"],
  Sport: ["Tennis", "Yoga", "Fitness", "Escalade", "Course"],
  Business: ["Pitch", "Stratégie", "Marketing", "Finance", "Vente"],
};

export const creditPacks = [
  { name: "STARTER", credits: 60, price: "4,99 €", hours: "1h", popular: false },
  { name: "PLUS", credits: 180, price: "9,99 €", hours: "3h", popular: true },
  { name: "PRO", credits: 360, price: "17,99 €", hours: "6h", popular: false },
  { name: "MAX", credits: 720, price: "29,99 €", hours: "12h", popular: false },
];
