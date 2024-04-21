-- CreateTable
CREATE TABLE "rlSolicitacao" (
    "id" TEXT NOT NULL,
    "usuarioDefaultId" TEXT NOT NULL,
    "equipeId" TEXT NOT NULL,
    "createAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateAt" TIMESTAMP(3),

    CONSTRAINT "rlSolicitacao_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "rlSolicitacao" ADD CONSTRAINT "rlSolicitacao_usuarioDefaultId_fkey" FOREIGN KEY ("usuarioDefaultId") REFERENCES "usuarioDefault"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rlSolicitacao" ADD CONSTRAINT "rlSolicitacao_equipeId_fkey" FOREIGN KEY ("equipeId") REFERENCES "equipe"("id") ON DELETE CASCADE ON UPDATE CASCADE;
