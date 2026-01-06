
# ⚽ FOOTBOOKING — Plateforme de Réservation de Terrains de Foot

FOOTBOOKING est une application web de réservation de terrains de football.
Projet collaboratif mené par **4 développeurs**, avec une organisation professionnelle inspirée des méthodes startup.

Objectif :
👉 Livrer une application fonctionnelle, propre, maintenable **et terminée**.

---

## 👥 ÉQUIPE & RÉPARTITION DÉTAILLÉE DES TÂCHES

---

## 👑 AzizDev — Lead Developer / Product Owner

### 🎯 Rôle global
- Vision produit et direction technique
- Garant de la cohérence globale du projet
- Décisions techniques finales
- Responsable GitHub & organisation du travail

### 🧠 Conception & Organisation
- Définition des fonctionnalités principales
- Découpage du projet en pages, sections et composants
- Validation des choix UI / UX
- Rédaction et maintenance du README

### 💻 Frontend (React + Tailwind)
- Mise en place de l’architecture frontend
- Création des layouts globaux :
  - AppLayout
  - DashboardLayout
- Pages clés :
  - Landing Page
  - Page Recherche
- Gestion du routing (React Router)
- Connexion frontend ↔ backend

### 🧑‍💼 GitHub & Coordination
- Création du repository GitHub
- Mise en place des branches (`main`, `develop`)
- Validation des Pull Requests
- Gestion des conflits Git
- Organisation des réunions rapides

---

## 🎨 Bicom — Frontend UI / UX Developer

### 🎯 Rôle global
- Responsable du rendu visuel et de l’expérience utilisateur
- Garant de la cohérence graphique

### 🎨 UI / UX
- Déclinaison du design sur toutes les pages
- Responsive design (mobile, tablette, desktop)
- Choix des animations et micro-interactions
- Accessibilité (lisibilité, contrastes, UX)

### 🧩 Composants React
- Boutons (Button)
- Inputs / Selects
- Cards (terrain, réservation)
- Modals
- Pagination
- Stepper (réservation)

### 📄 Pages UI principales
- HeroSection
- FeaturesSection
- Fiches terrain (cards)
- Profil utilisateur
- Dashboard (partie visuelle)

---

## 🔧 JoyBoy — Backend Developer / API

### 🎯 Rôle global
- Responsable de toute la logique backend
- Sécurité, authentification et API

### 🛠 Backend
- Setup backend (Node.js ou Laravel)
- Architecture MVC / API REST
- Gestion des erreurs

### 🔐 Authentification
- Inscription / Connexion
- Gestion des rôles :
  - Joueur
  - Propriétaire
- Sécurisation des routes

### 🔄 Logique métier
- Réservations (création, modification, annulation)
- Disponibilités des terrains
- Calcul des prix
- Paiement (simulation ou réel)

### 🌐 API
- Création des endpoints REST
- Documentation des routes API
- Tests via Postman

---

## 📊 JuniorPacho — Database / QA / Support

### 🎯 Rôle global
- Garant de la fiabilité du projet
- Responsable base de données et tests

### 🗄 Base de Données
- Modélisation de la BDD :
  - users
  - fields
  - bookings
  - reviews
  - payments
- Relations entre tables
- Optimisation des requêtes

### 🧪 Tests & Qualité
- Tests fonctionnels
- Vérification des flows utilisateurs
- Détection des bugs
- Validation avant merge

### 📚 Documentation
- Aide à la documentation technique
- Schémas BDD
- Notes de fonctionnement

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
