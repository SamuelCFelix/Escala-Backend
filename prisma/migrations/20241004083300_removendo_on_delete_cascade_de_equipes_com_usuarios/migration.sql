-- DropForeignKey
ALTER TABLE "usuarios" DROP CONSTRAINT "usuarios_equipeId_fkey";

-- AddForeignKey
ALTER TABLE "usuarios" ADD CONSTRAINT "usuarios_equipeId_fkey" FOREIGN KEY ("equipeId") REFERENCES "equipe"("id") ON DELETE SET NULL ON UPDATE CASCADE;
