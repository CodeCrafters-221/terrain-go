-- ######################################################################
-- FIX : AFFICHAGE DES NOMS PROPRIÉTAIRES
-- ######################################################################

-- 1. Supprimer l'ancienne politique restrictive
DROP POLICY IF EXISTS "select_profiles_consolidated" ON profiles;

-- 2. Créer une nouvelle politique permettant à tout utilisateur connecté de voir les noms/téléphones
-- L'insertion et la modification restent sécurisées par l'ID de l'utilisateur
CREATE POLICY "select_profiles_consolidated" 
ON profiles FOR SELECT 
TO authenticated 
USING (true);

-- Note : Cette règle permet à tout utilisateur authentifié de lire la table profiles. 
-- C'est nécessaire pour afficher le nom du propriétaire lors d'une réservation.
