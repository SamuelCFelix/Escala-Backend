/*
  Warnings:

  - You are about to drop the column `indisponibilidade` on the `escalaUsuarioDefault` table. All the data in the column will be lost.
  - The `disponibilidade` column on the `escalaUsuarioDefault` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `indisponibilidade` on the `escalaUsuarioHost` table. All the data in the column will be lost.
  - The `disponibilidade` column on the `escalaUsuarioHost` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "escalaUsuarioDefault" DROP COLUMN "indisponibilidade",
DROP COLUMN "disponibilidade",
ADD COLUMN     "disponibilidade" JSONB;

-- AlterTable
ALTER TABLE "escalaUsuarioHost" DROP COLUMN "indisponibilidade",
DROP COLUMN "disponibilidade",
ADD COLUMN     "disponibilidade" JSONB;
