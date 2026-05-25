# ⚡ SkillBridge — Frontend

Interface React de la plateforme d'échange de compétences.
Construit avec **Vite + React 18 + Tailwind CSS + Zustand**.

---

## 🚀 Récupérer le projet et le lancer (première fois)

### Prérequis
- **Node.js v18+** — télécharger sur [nodejs.org](https://nodejs.org)
- **Git** — télécharger sur [git-scm.com](https://git-scm.com)

### Étapes

```bash
# 1. Cloner le repo
git clone https://github.com/TON_PSEUDO/skillbridge-frontend.git
cd skillbridge-frontend

# 2. Installer les dépendances
npm install

# 3. Créer le fichier d'environnement
cp .env.example .env
# Puis ouvrir .env et remplir VITE_API_URL

# 4. Lancer en développement
npm run dev
```

L'app tourne sur → **http://localhost:5173**

---

## 🌿 Branches Git — RÈGLES IMPORTANTES

```
main     → production uniquement — JAMAIS pousser directement ici
dev      → branche de travail commune — toujours partir de là
feat/xxx → ta branche personnelle pour chaque feature
fix/xxx  → correction de bug
```

### Avant de toucher AU MOINDRE FICHIER, fais toujours :

```bash
# 1. Se mettre à jour
git checkout dev
git pull origin dev

# 2. Créer ta branche depuis dev (JAMAIS depuis main)
git checkout -b feat/ma-feature

# 3. Coder...

# 4. Sauvegarder et pousser
git add .
git commit -m "feat: description claire de ce que tu as fait"
git push origin feat/ma-feature

# 5. Ouvrir une Pull Request sur GitHub : ta branche → dev
```

### Convention commits
- `feat:` nouvelle fonctionnalité
- `fix:` correction de bug
- `style:` changement visuel uniquement
- `refactor:` restructuration sans changer le comportement
- `chore:` mise à jour dépendances, config

---

## 📁 Structure du projet

```
skillbridge-frontend/
├── public/
│   ├── hero-1.png ... hero-4.png    ← Images carousel homepage
│   └── how-1.png ... how-4.png      ← Images How it works
├── src/
│   ├── components/
│   │   ├── AuthModal.jsx    ← Modal login/register (à connecter à l'API)
│   │   ├── CookieBanner.jsx ← Bandeau RGPD
│   │   ├── Navbar.jsx       ← Navigation principale + mini-pill au scroll
│   │   └── Sessiontimer.jsx ← Gestion sessions (crédits + appels)
│   ├── pages/
│   │   ├── HomePage.jsx     ← Page d'accueil
│   │   ├── Register.jsx     ← Inscription multi-étapes
│   │   ├── Connection.jsx   ← Liste des profils à connecter
│   │   ├── UserProfile.jsx  ← Profil public d'un autre utilisateur
│   │   ├── Profile.jsx      ← Mon profil (protégé)
│   │   ├── Feed.jsx         ← Feed de posts communauté
│   │   ├── Chat.jsx         ← Messagerie + appels Zoom/Meet
│   │   ├── CallScreen.jsx   ← Écran d'appel (remplacé par lien externe)
│   │   └── Login.jsx        ← Page login simple
│   ├── services/
│   │   └── api.js           ← Config Axios — pointe vers le backend
│   ├── store/
│   │   └── authStore.js     ← État global Zustand (user, token, credits)
│   ├── App.jsx              ← Routes React Router
│   ├── main.jsx             ← Point d'entrée React
│   └── index.css            ← Tailwind directives
├── .env.example             ← Variables d'environnement à copier
├── package.json
├── tailwind.config.js
└── vite.config.js
```

---

## 🔗 Variables d'environnement

Copie `.env.example` en `.env` :

```bash
cp .env.example .env
```

```env
VITE_API_URL=http://localhost:3001
```

En production, remplace par l'URL de ton API déployée.

---

## 📦 Stack technique

| Outil | Version | Rôle |
|---|---|---|
| React | 18 | Framework UI |
| Vite | 8 | Build tool + dev server |
| Tailwind CSS | 3 | Styling utilitaire |
| React Router | 6 | Navigation SPA |
| Zustand | 4 | État global (auth, user) |
| Axios | 1 | Appels HTTP vers l'API |

---

## 🔌 Connexion avec le backend

Toutes les requêtes HTTP passent par `src/services/api.js`.
L'URL de base est configurée via `VITE_API_URL` dans `.env`.

Chaque page contient des commentaires `// TODO Dev X` indiquant exactement
où les vrais appels API doivent remplacer les données statiques.


## 👥 Équipe

| Membre | Rôle | Contact |
|---|---|---|
| Lead Frontend | React, UI/UX | — |
| Dev 1 Backend | Auth, Users, Connections | — |
| Dev 2 Backend | Chat, Sessions, Crédits | — |
| Dev 3 Backend | Posts, Feed, Upload, Zoom | — |