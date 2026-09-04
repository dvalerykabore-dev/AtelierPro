-- Paliers d'abonnement.
--
-- Deux colonnes seulement : la clé du palier et l'échéance du prépayé. Ce que
-- chaque palier débloque vit dans `lib/plans.ts`, pas en base — ajouter une
-- capacité ne doit pas demander de migration.
--
-- `plan` est NOT NULL avec défaut : les comptes existants deviennent gratuits,
-- ce qui est exactement leur état réel. `planExpiresAt` reste nullable — NULL
-- veut dire « aucun encaissement », donc gratuit.
--
-- Aucune reprise de données n'est nécessaire : le défaut couvre tout le
-- monde, et l'ancienne grille à trois paliers n'a jamais rien encaissé.
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "plan" TEXT NOT NULL DEFAULT 'freemium',
ADD COLUMN     "planExpiresAt" TIMESTAMP(3),
ADD COLUMN     "planIntent" TEXT;
