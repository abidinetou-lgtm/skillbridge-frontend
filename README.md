# SkillBridge — Frontend

Interface React de la plateforme de troc de savoirs peer-to-peer.

## Stack

| Outil | Version | Rôle |
|---|---|---|
| React | 18 | Framework UI |
| Vite | 8 | Build tool |
| Tailwind CSS | 3 | Styling |
| React Router | 6 | Navigation SPA |
| Zustand | 4 | État global (auth, user, credits) |
| Axios | 1 | Appels HTTP vers l'API |

## Lancer en local

```bash
# Cloner
git clone https://github.com/abidinetou-lgtm/skillbridge-frontend.git
cd skillbridge-frontend

# Installer
npm install

# Configurer l'environnement
cp .env.example .env
# Modifier VITE_API_URL=http://localhost:5000

# Lancer
npm run dev
# → http://localhost:5173
```

## Variables d'environnement

```env
VITE_API_URL=http://localhost:5000
```

En production :
```env
VITE_API_URL=https://jimel-api.octilabs.com
```

## Structure du projet

```
src/
├── components/
│   ├── AuthModal.jsx       # Login / Register modal
│   ├── Navbar.jsx          # Navigation principale
│   ├── MemberCard.jsx      # Card membre dans Connection
│   ├── ProfileModal.jsx    # Modal profil avec grille horaires
│   ├── AvailabilityGrid.jsx
│   └── CookieBanner.jsx
├── pages/
│   ├── HomePage.jsx        # Accueil
│   ├── Register.jsx        # Inscription multi-étapes (4 steps)
│   ├── Connection.jsx      # Découverte des membres par catégorie
│   ├── UserProfile.jsx     # Profil public d'un membre
│   ├── Profile.jsx         # Mon profil (protégé)
│   ├── BecomeSharer.jsx    # Créer son profil donneur
│   ├── Feed.jsx            # Feed communauté
│   ├── Chat.jsx            # Messagerie temps réel
│   ├── Sessions.jsx        # Mes sessions (donner / recevoir)
│   ├── NewSession.jsx      # Créer une session
│   ├── SessionRoom.jsx     # Salle de session Jitsi Meet
│   └── Credits.jsx         # Acheter des crédits
├── services/
│   └── api.js              # Config Axios centralisée
├── store/
│   └── authStore.js        # État global Zustand
└── data/
    ├── mockUsers.js        # 15 profils de démo
    └── categories.js       # Catégories de compétences
```

## Branches Git

```
main    → production
dev     → développement commun
feat/*  → features individuelles
fix/*   → corrections de bugs
```

**Avant tout travail :**
```bash
git checkout dev
git pull origin dev
git checkout -b feat/ma-feature
```

**Après :**
```bash
git add .
git commit -m "feat: description claire"
git push origin feat/ma-feature
# Pull Request → dev sur GitHub
```

## Pages et routes

| Route | Page | Accès |
|---|---|---|
| `/` | HomePage | Public |
| `/register` | Register | Public |
| `/connection` | Connection | Public |
| `/user/:id` | UserProfile | Public |
| `/feed` | Feed | Public |
| `/profile` | Profile | Connecté |
| `/become-sharer` | BecomeSharer | Connecté |
| `/sessions` | Sessions | Connecté |
| `/sessions/new` | NewSession | Connecté |
| `/sessions/:id` | SessionRoom | Connecté |
| `/chat` | Chat | Connecté |
| `/credits` | Credits | Connecté |

## Concept — Système de crédits

- **120 crédits offerts** à l'inscription (= 2 heures)
- **1 crédit = 1 minute** de cours reçu
- Donner un cours → **gagner** des crédits
- Recevoir un cours → **dépenser** des crédits
- Sessions de groupe → **gratuites**
- Crédits transférés automatiquement à la fin de la session

## Déploiement

Déployé sur **Vercel**.

```bash
npm install -g vercel
vercel
# Variable : VITE_API_URL=https://jimel-api.octilabs.com
```

## Équipe

| Membre | Rôle |
|---|---|
| Jimel Abidine Touré | Lead Frontend |
| Yanis Hocini | Frontend |