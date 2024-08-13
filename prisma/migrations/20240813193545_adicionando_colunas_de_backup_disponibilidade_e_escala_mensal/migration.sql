-- AlterTable
ALTER TABLE "equipe" ADD COLUMN     "escalaMensal" JSONB;

-- AlterTable
ALTER TABLE "escalaUsuarioDefault" ADD COLUMN     "backupDisponibilidade" JSONB;

-- AlterTable
ALTER TABLE "escalaUsuarioHost" ADD COLUMN     "backupDisponibilidade" JSONB;
