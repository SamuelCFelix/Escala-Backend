/*
  Warnings:

  - Changed the type of `servindo` on the `programacao` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "programacao" DROP COLUMN "servindo",
ADD COLUMN     "servindo" INTEGER NOT NULL;
