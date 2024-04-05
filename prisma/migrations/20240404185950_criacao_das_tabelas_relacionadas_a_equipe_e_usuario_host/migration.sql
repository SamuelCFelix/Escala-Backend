/*
  Warnings:

  - You are about to drop the column `numeroTelefone` on the `perfil` table. All the data in the column will be lost.
  - Added the required column `primeiroAcesso` to the `perfil` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "perfil" DROP COLUMN "numeroTelefone",
ADD COLUMN     "primeiroAcesso" BOOLEAN NOT NULL;

-- CreateTable
CREATE TABLE "escalaUsuarioHost" (
    "id" TEXT NOT NULL,
    "servicos" JSONB,
    "disponibilidade" TEXT,
    "indisponibilidade" TEXT,
    "usuarioHostId" TEXT NOT NULL,
    "createAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateAt" TIMESTAMP(3),

    CONSTRAINT "escalaUsuarioHost_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "equipe" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "usuarioHostId" TEXT NOT NULL,
    "createAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateAt" TIMESTAMP(3),

    CONSTRAINT "equipe_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tags" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "equipeId" TEXT NOT NULL,
    "createAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateAt" TIMESTAMP(3),

    CONSTRAINT "tags_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "programacao" (
    "id" TEXT NOT NULL,
    "culto" TEXT NOT NULL,
    "dia" TEXT NOT NULL,
    "horario" TEXT NOT NULL,
    "servindo" TEXT NOT NULL,
    "equipeId" TEXT NOT NULL,
    "createAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateAt" TIMESTAMP(3),

    CONSTRAINT "programacao_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "rlTagsProgramacao" (
    "id" TEXT NOT NULL,
    "programacaoId" TEXT NOT NULL,
    "tagId" TEXT NOT NULL,
    "createAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateAt" TIMESTAMP(3),

    CONSTRAINT "rlTagsProgramacao_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "rlTagsUsuarioHost" (
    "id" TEXT NOT NULL,
    "usuarioHostId" TEXT NOT NULL,
    "tagId" TEXT NOT NULL,
    "createAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateAt" TIMESTAMP(3),

    CONSTRAINT "rlTagsUsuarioHost_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "escalaUsuarioHost" ADD CONSTRAINT "escalaUsuarioHost_usuarioHostId_fkey" FOREIGN KEY ("usuarioHostId") REFERENCES "usuarioHost"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "equipe" ADD CONSTRAINT "equipe_usuarioHostId_fkey" FOREIGN KEY ("usuarioHostId") REFERENCES "usuarioHost"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tags" ADD CONSTRAINT "tags_equipeId_fkey" FOREIGN KEY ("equipeId") REFERENCES "equipe"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "programacao" ADD CONSTRAINT "programacao_equipeId_fkey" FOREIGN KEY ("equipeId") REFERENCES "equipe"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rlTagsProgramacao" ADD CONSTRAINT "rlTagsProgramacao_programacaoId_fkey" FOREIGN KEY ("programacaoId") REFERENCES "programacao"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rlTagsProgramacao" ADD CONSTRAINT "rlTagsProgramacao_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "tags"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rlTagsUsuarioHost" ADD CONSTRAINT "rlTagsUsuarioHost_usuarioHostId_fkey" FOREIGN KEY ("usuarioHostId") REFERENCES "usuarioHost"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rlTagsUsuarioHost" ADD CONSTRAINT "rlTagsUsuarioHost_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "tags"("id") ON DELETE CASCADE ON UPDATE CASCADE;
