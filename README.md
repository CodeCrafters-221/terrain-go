HEAD

# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

# ⚽ FOOTBOOKING — Plateforme de Réservation de Terrains de Foot

FOOTBOOKING est une application web de réservation de terrains de football.
Projet collaboratif mené par **4 développeurs**, avec une organisation professionnelle inspirée des méthodes startup.

Objectif :
👉 Livrer une application fonctionnelle, propre, maintenable **et terminée**.

---

## 👥 ÉQUIPE & RÉPARTITION DÉTAILLÉE DES TÂCHES

---

## 👑 AzizDev — Lead Frontend & Coordinateur

👉 Tu es le chef d’orchestre (vision + qualité + rythme)

### 🎯 Responsabilités principales

- Créer et maintenir la structure du projet

- Garantir la cohérence UI/UX

- Valider les PR (Pull Requests)

- Trancher en cas de blocage

### 🛠️ Tâches concrètes

- Initialisation du projet (React + Tailwind)

- Arborescence des dossiers

- AppLayout, Header, Footer

- Landing Page (Hero, CTA, Features)

- Routing global

- Profil utilisateur

- Revue de code de l’équipe

- README GitHub

## 🧠 Règle pour toi :

## Tu ne codes pas tout, tu fais coder intelligemment.

## 🎨 Bicom — Frontend Pages & UI

👉 Le spécialiste des pages visibles

### 🎯 Responsabilités principales

- Pages côté joueur

- Composants visuels

- Responsive design

### 🛠️ Tâches concrètes

- Page Recherche terrains

- FieldCard

- Filtres (quartier, prix, type)

- Page Détails terrain

- Galerie photos

- Section avis utilisateurs

- Responsive mobile / desktop

## 🧠 Objectif :

Si quelqu’un voit le site → il voit le travail de Bicom

---

## 🧩 JoyBoy — Réservation & UX Flow

👉 Le cerveau fonctionnel du projet

### 🎯 Responsabilités principales

- Parcours de réservation

- Logique UX

- États (loading, erreur, succès)

### 🛠️ Tâches concrètes

- BookingWidget

- Sélecteur date / heure / durée

- Page Réservation (steps)

- Récapitulatif réservation

- Confirmation

- Gestion des états UX

- Préparation intégration paiement

## 🧠 Objectif :

## La réservation doit être fluide, simple, rassurante

## 🧑‍💼 JuniorPacho — Dashboard Propriétaire

👉 Le boss côté pro

### 🎯 Responsabilités principales

- Dashboard

- Gestion terrains & réservations

- Vision “business”

### 🛠️ Tâches concrètes

- DashboardLayout

- Sidebar navigation

- Overview (stats)

- Gestion terrains (CRUD visuel)

- Gestion réservations

- Tables & graphiques (mock data)

## 🧠 Objectif :

Un propriétaire doit se dire : “ce site est sérieux”

---

## 🧱 STRUCTURE DU PROJET (FRONTEND)

```
src/
├── components/        # Composants réutilisables
├── layouts/           # Layouts globaux
├── pages/             # Pages principales
├── sections/          # Sections de pages
├── hooks/             # Hooks personnalisés
├── services/          # Appels API
├── utils/             # Fonctions utilitaires
├── assets/            # Images / icônes
└── styles/            # Styles globaux
```

---

## 🗂️ ORGANISATION GITHUB (IMPORTANT)

### 🔀 Branches

- `main` → version stable
- `develop` → branche de développement
- `feature/nom-feature`
- `fix/nom-bug`

### ✅ Règles obligatoires

- ❌ Aucun push direct sur `main`
- ✅ Toujours passer par une branche feature
- ✅ Pull Request obligatoire
- ✅ Review par AzizDev
- ✅ Tests validés avant merge

### ✍️ Convention de commit

- `feat: ajout recherche terrain`
- `fix: bug réservation`
- `refactor: nettoyage code`

---

## 🔄 MÉTHODE DE COLLABORATION

- Communication : WhatsApp / Discord
- Réunions courtes et efficaces :
  - Ce que j’ai fait
  - Ce que je fais ensuite
  - Blocages éventuels
- GitHub = source de vérité
- Entraide obligatoire 💪

---

## 🚀 PHASES DU PROJET

1. Setup & organisation
2. Landing Page
3. Recherche & filtres
4. Détails terrain
5. Réservation
6. Authentification
7. Dashboard propriétaire
8. Profil utilisateur
9. Tests & optimisation
10. Déploiement

---

## 🔥 ESPRIT D’ÉQUIPE

> “Un projet fini vaut mieux que dix projets commencés.”

- On avance ensemble
- On communique
- On termine le projet
- On apprend en équipe

⚽ **FOOTBOOKING, c’est un projet sérieux.**
🔥 **On le livre.**

---

origin/dev


- router/index.jsx
## : Merged all routes (/, /user-profile, /terrain-details, /search)