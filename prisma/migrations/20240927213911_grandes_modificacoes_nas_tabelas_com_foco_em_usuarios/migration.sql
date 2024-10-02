/*
  Warnings:

  - You are about to drop the `escalaUsuarioDefault` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `escalaUsuarioHost` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `programacao` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `rlSolicitacao` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `rlTagsProgramacao` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `rlTagsUsuarioDefault` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `rlTagsUsuarioHost` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `usuarioDefault` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `usuarioHost` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "equipe" DROP CONSTRAINT "equipe_usuarioHostId_fkey";

-- DropForeignKey
ALTER TABLE "escalaUsuarioDefault" DROP CONSTRAINT "escalaUsuarioDefault_usuarioDefaultId_fkey";

-- DropForeignKey
ALTER TABLE "escalaUsuarioHost" DROP CONSTRAINT "escalaUsuarioHost_usuarioHostId_fkey";

-- DropForeignKey
ALTER TABLE "programacao" DROP CONSTRAINT "programacao_equipeId_fkey";

-- DropForeignKey
ALTER TABLE "rlSolicitacao" DROP CONSTRAINT "rlSolicitacao_equipeId_fkey";

-- DropForeignKey
ALTER TABLE "rlSolicitacao" DROP CONSTRAINT "rlSolicitacao_usuarioDefaultId_fkey";

-- DropForeignKey
ALTER TABLE "rlTagsProgramacao" DROP CONSTRAINT "rlTagsProgramacao_programacaoId_fkey";

-- DropForeignKey
ALTER TABLE "rlTagsProgramacao" DROP CONSTRAINT "rlTagsProgramacao_tagId_fkey";

-- DropForeignKey
ALTER TABLE "rlTagsUsuarioDefault" DROP CONSTRAINT "rlTagsUsuarioDefault_tagId_fkey";

-- DropForeignKey
ALTER TABLE "rlTagsUsuarioDefault" DROP CONSTRAINT "rlTagsUsuarioDefault_usuarioDefaultId_fkey";

-- DropForeignKey
ALTER TABLE "rlTagsUsuarioHost" DROP CONSTRAINT "rlTagsUsuarioHost_tagId_fkey";

-- DropForeignKey
ALTER TABLE "rlTagsUsuarioHost" DROP CONSTRAINT "rlTagsUsuarioHost_usuarioHostId_fkey";

-- DropForeignKey
ALTER TABLE "usuarioDefault" DROP CONSTRAINT "usuarioDefault_equipeId_fkey";

-- DropForeignKey
ALTER TABLE "usuarioDefault" DROP CONSTRAINT "usuarioDefault_perfilId_fkey";

-- DropForeignKey
ALTER TABLE "usuarioHost" DROP CONSTRAINT "usuarioHost_perfilId_fkey";

-- DropTable
DROP TABLE "escalaUsuarioDefault";

-- DropTable
DROP TABLE "escalaUsuarioHost";

-- DropTable
DROP TABLE "programacao";

-- DropTable
DROP TABLE "rlSolicitacao";

-- DropTable
DROP TABLE "rlTagsProgramacao";

-- DropTable
DROP TABLE "rlTagsUsuarioDefault";

-- DropTable
DROP TABLE "rlTagsUsuarioHost";

-- DropTable
DROP TABLE "usuarioDefault";

-- DropTable
DROP TABLE "usuarioHost";

-- CreateTable
CREATE TABLE "usuarios" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "foto" TEXT,
    "autorizacao" TEXT,
    "incluirUsuarioGerarEscala" BOOLEAN DEFAULT true,
    "statusUsuario" BOOLEAN DEFAULT true,
    "perfilId" TEXT NOT NULL,
    "equipeId" TEXT,
    "createAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateAt" TIMESTAMP(3),

    CONSTRAINT "usuarios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "escalaUsuarios" (
    "id" TEXT NOT NULL,
    "disponibilidadeProximoMes" JSONB,
    "disponibilidadeMensal" JSONB,
    "usuarioId" TEXT NOT NULL,
    "createAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateAt" TIMESTAMP(3),

    CONSTRAINT "escalaUsuarios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "programacoes" (
    "id" TEXT NOT NULL,
    "culto" TEXT NOT NULL,
    "dia" TEXT NOT NULL,
    "horario" TEXT NOT NULL,
    "servindo" INTEGER NOT NULL,
    "equipeId" TEXT NOT NULL,
    "createAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateAt" TIMESTAMP(3),

    CONSTRAINT "programacoes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "rlTagsProgramacoes" (
    "id" TEXT NOT NULL,
    "programacaoId" TEXT NOT NULL,
    "tagId" TEXT NOT NULL,
    "createAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateAt" TIMESTAMP(3),

    CONSTRAINT "rlTagsProgramacoes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "rlTagsUsuarios" (
    "id" TEXT NOT NULL,
    "usuarioId" TEXT NOT NULL,
    "tagId" TEXT NOT NULL,
    "createAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateAt" TIMESTAMP(3),

    CONSTRAINT "rlTagsUsuarios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "rlSolicitacoes" (
    "id" TEXT NOT NULL,
    "usuarioId" TEXT NOT NULL,
    "equipeId" TEXT NOT NULL,
    "createAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateAt" TIMESTAMP(3),

    CONSTRAINT "rlSolicitacoes_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "usuarios" ADD CONSTRAINT "usuarios_perfilId_fkey" FOREIGN KEY ("perfilId") REFERENCES "perfil"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "usuarios" ADD CONSTRAINT "usuarios_equipeId_fkey" FOREIGN KEY ("equipeId") REFERENCES "equipe"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "escalaUsuarios" ADD CONSTRAINT "escalaUsuarios_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "programacoes" ADD CONSTRAINT "programacoes_equipeId_fkey" FOREIGN KEY ("equipeId") REFERENCES "equipe"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rlTagsProgramacoes" ADD CONSTRAINT "rlTagsProgramacoes_programacaoId_fkey" FOREIGN KEY ("programacaoId") REFERENCES "programacoes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rlTagsProgramacoes" ADD CONSTRAINT "rlTagsProgramacoes_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "tags"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rlTagsUsuarios" ADD CONSTRAINT "rlTagsUsuarios_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rlTagsUsuarios" ADD CONSTRAINT "rlTagsUsuarios_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "tags"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rlSolicitacoes" ADD CONSTRAINT "rlSolicitacoes_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rlSolicitacoes" ADD CONSTRAINT "rlSolicitacoes_equipeId_fkey" FOREIGN KEY ("equipeId") REFERENCES "equipe"("id") ON DELETE CASCADE ON UPDATE CASCADE;
