# CLAUDE.md — Page Connexions : afficher TOUS les skills + étoile sur les skills qui matchent

## Règles absolues
- Ne JAMAIS exécuter `git add`, `git commit` ou `git push`.
- Aucun emoji dans le code. Icônes SVG inline uniquement.
- Aucune donnée mockée dans les composants de production.
- IGNORER complètement le dossier `copie` dans `skillbridge-frontend` : référence
  temporaire obsolète. Ne pas le lire, ne pas s'en inspirer, ne pas le modifier.

## Contexte
Sur la page Connexions (`skillbridge-frontend/src/pages/Connection.jsx`), les cards
des membres n'affichent qu'UNE compétence enseignée au lieu de toutes (ex : Jim
enseigne Python, Mathematics et JavaScript, mais seul JavaScript apparaît).

Cause racine déjà identifiée : dans
`skillbridge-backend/src/services/matchService.ts`, fonction `getMatchSuggestions`,
le `select` du `prisma.user.findMany` écrase `teachingSkills` avec un
`where: { skillId: { in: learningSkillIds } }` qui limite les skills retournés à
ceux qui matchent les objectifs de l'utilisateur courant.

## Comportement cible
1. Les cards et la modale de profil affichent TOUTES les compétences enseignées
   de chaque membre.
2. Les compétences qui correspondent aux objectifs d'apprentissage de
   l'utilisateur connecté sont marquées d'une petite étoile SVG (icône inline,
   pas d'emoji) à côté du nom du skill, et triées en premier dans la liste.
3. La logique de matching (quels utilisateurs apparaissent dans les suggestions)
   ne change PAS.

## Tâche 1 — Backend (modification minimale)
Fichier : `skillbridge-backend/src/services/matchService.ts`
- Dans `getMatchSuggestions`, supprimer le filtre
  `skillId: { in: learningSkillIds }` du `where` interne de `teachingSkills`
  dans le `select`. Garder uniquement `skill: { isActive: true }`.
- Ne PAS toucher au `where` principal du `findMany` (le matching reste le même).
- Garder `matchingTeachingSkillSelect` et `orderBy: { createdAt: "desc" }`.
- Vérifier que les autres selects du fichier (`matchedUserSelect`,
  `matchUserSelect`, selects de `getMyMatches`) retournent aussi les skills
  complets, sans re-filtrage.
- Compiler (`npm run build` ou `tsc`) : zéro erreur TypeScript, attention aux
  types Prisma `satisfies`.

## Tâche 2 — Frontend : étoile sur les skills qui matchent
Fichier : `skillbridge-frontend/src/pages/Connection.jsx`
- Le composant charge déjà `/users/me` (`myProfile`) qui contient
  `learningGoals`. Construire un Set des identifiants de skills que je veux
  apprendre : `mySkillGoalIds = new Set(myProfile.learningGoals.map(g => g.skill?.id))`.
  Si l'id n'est pas disponible côté goals, fallback sur une comparaison par nom
  en minuscules.
- Lors du mapping des membres, transformer `teaches` pour conserver l'objet
  skill complet (id + name) au lieu de seulement le nom, et calculer pour
  chaque skill un booléen `isMatch` (présent dans `mySkillGoalIds`).
- Trier les skills de chaque membre : ceux avec `isMatch === true` en premier.
- Affichage sur les cards : chaque pill de skill qui matche affiche une petite
  étoile SVG inline (environ 12px, remplie, couleur dorée cohérente avec la
  charte existante de la page) à gauche du nom du skill. Les pills gardent
  exactement le style actuel sinon.
- Garder le comportement existant : 4 skills max visibles sur la card + badge
  "+N" pour le reste. Comme les skills qui matchent sont triés en premier, ils
  sont toujours visibles.
- Modale de profil (`selected.teaches`) : afficher la liste COMPLÈTE des skills,
  avec la même étoile sur ceux qui matchent. Le badge "Correspond à vos
  objectifs" existant reste inchangé.
- Vérifier si `matchScore` utilise `teaches` : adapter les accès si la structure
  passe de tableau de strings à tableau d'objets, sans changer le calcul du
  score.
- Chercher les autres endroits du frontend qui consomment `teachingSkills` issus
  de ces endpoints (ex : `MemberCard.jsx`, `ProfileModal.jsx` s'ils sont
  utilisés) et adapter pour ne rien casser.

## Validation attendue
- `GET /matches/suggestions` retourne l'intégralité des `teachingSkills` actives
  de chaque utilisateur suggéré.
- La card de Jim affiche Python, Mathematics et JavaScript ; si je veux
  apprendre JavaScript, ce skill a une étoile et apparaît en premier.
- La modale affiche la même chose avec la liste complète.
- Les suggestions affichées (quels membres) sont identiques à avant.
- Aucune régression sur `/matches/mine`, les demandes de connexion, ni le
  filtre par catégorie et la recherche de la page Connexions.

## Périmètre et méthode
- Modifier uniquement `matchService.ts` côté backend et les fichiers frontend
  strictement nécessaires. Pas de refactor global.
- Travailler étape par étape : Tâche 1, me montrer le diff, attendre ma
  validation, puis Tâche 2.
- M'expliquer chaque modification.