### 🛠️ OÙ MODIFIER QUOI ? (Détails Techniques)

Si vous voulez changer un bouton, une fonction ou un texte, voici la carte du code :

#### 1. Gestion des Terrains (Ajouter / Modifier / Supprimer)
*   **Les Boutons "Modifier" et "Supprimer"** : 
    *   Fichier : `src/pages/Dashboard/MyFields.jsx`
    *   Cherchez : `openEditModal` (pour modifier) et `deleteField` (pour supprimer).
*   **Le Bouton "Ajouter Terrain"** :
    *   Fichier : `src/pages/Dashboard/MyFields.jsx` (en haut à droite et en bas de liste).
    *   Cherchez : `openCreateModal`.
*   **Les Formulaires (Le contenu des modales)** :
    *   Ajout : `src/components/CreateFieldModal.jsx`
    *   Modification : `src/components/EditFieldModal.jsx`
*   **La Logique (Ce qui se passe après le clic)** :
    *   Fichier : `src/context/DashboardContext.jsx`
    *   Fonctions : `addField`, `updateField`, `deleteField`.

#### 2. Gestion des Réservations
*   **La Liste des réservations** :
    *   Fichier : `src/pages/Dashboard/MyReservations.jsx`
    *   C'est ici qu'on change l'affichage du nom du client ou du numéro de téléphone.
*   **Le Changement de Statut (Valider/Annuler)** :
    *   Logique : `src/context/DashboardContext.jsx` -> Fonction `updateReservationStatus`.
    *   Affichage : `src/pages/Dashboard/MyReservations.jsx`.

#### 3. Le Cadre Global (Layout)
*   **La Barre latérale (Sidebar) et l'Entête (Header)** :
    *   Side : `src/components/DashboardSidebar.jsx`
    *   Header : `src/components/DashboardHeader.jsx`
*   **Le Fichier qui assemble tout le Dashboard** :
    *   `src/layouts/DashboardLayout.jsx` (C'est lui qui affiche les modales et la structure).

---
*Note : Pour tout changement de design global (couleurs, polices), regardez `index.css` ou les classes Tailwind dans les fichiers susnommés.*