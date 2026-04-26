# ⚡ SkillBridge — Frontend

Interface React de la plateforme d'échange de compétences.

## 🚀 Lancer le projet

```bash
npm install
npm run dev
```

L'app tourne sur → http://localhost:5173

## 📁 Structure des dossiers

```
src/
├── pages/
│   ├── Login.jsx         ← Page de connexion
│   ├── Register.jsx      ← Inscription
│   ├── Feed.jsx          ← Feed principal (matches + posts)
│   ├── Profile.jsx       ← Profil d'un utilisateur
│   ├── Chat.jsx          ← Interface de messagerie
│   └── Match.jsx         ← Mes matches en cours
│
├── components/
│   ├── Navbar.jsx        ← Barre de navigation
│   ├── SkillTag.jsx      ← Badge coloré pour un skill
│   ├── MatchCard.jsx     ← Carte d'un profil dans le feed
│   └── CreditBadge.jsx   ← Affichage des crédits
│
├── store/
│   └── authStore.js      ← État global : user connecté + token JWT
│
├── services/
│   ├── api.js            ← Configuration axios (URL de base + headers)
│   ├── auth.service.js   ← Appels API : login, register
│   ├── user.service.js   ← Appels API : profil, skills
│   └── match.service.js  ← Appels API : suggestions, demandes
│
└── App.jsx               ← Routes React Router
```

## 🌿 Branches Git

- `main` → production uniquement
- `dev` → branche de travail
- `feat/xxx` → nouvelle fonctionnalité
- `fix/xxx` → correction de bug

## 🔗 Variables d'environnement

Crée un fichier `.env` à la racine :

```
VITE_API_URL=http://localhost:3001
VITE_SOCKET_URL=http://localhost:3001
VITE_CLOUDINARY_CLOUD_NAME=ton_cloud_name
```

## 📦 Stack

- React 18 + Vite
- Tailwind CSS
- Zustand (état global)
- Axios (requêtes HTTP)
- React Router v6
- Socket.io-client (chat temps réel)
- simple-peer (appels vocaux WebRTC)
