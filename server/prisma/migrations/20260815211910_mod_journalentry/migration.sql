/*
  Warnings:

  - You are about to drop the column `contenue` on the `JournalEntry` table. All the data in the column will be lost.
  - You are about to drop the column `sujet` on the `JournalEntry` table. All the data in the column will be lost.
  - You are about to drop the column `titre` on the `JournalEntry` table. All the data in the column will be lost.
  - You are about to drop the column `visible` on the `JournalEntry` table. All the data in the column will be lost.
  - Added the required column `anxiete` to the `JournalEntry` table without a default value. This is not possible if the table is not empty.
  - Added the required column `energie` to the `JournalEntry` table without a default value. This is not possible if the table is not empty.
  - Added the required column `humeur` to the `JournalEntry` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sommeil` to the `JournalEntry` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "JournalEntry" DROP COLUMN "contenue",
DROP COLUMN "sujet",
DROP COLUMN "titre",
DROP COLUMN "visible",
ADD COLUMN     "anxiete" INTEGER NOT NULL,
ADD COLUMN     "energie" INTEGER NOT NULL,
ADD COLUMN     "evenementMarquant" TEXT,
ADD COLUMN     "gratitude" TEXT,
ADD COLUMN     "humeur" INTEGER NOT NULL,
ADD COLUMN     "sommeil" INTEGER NOT NULL;
