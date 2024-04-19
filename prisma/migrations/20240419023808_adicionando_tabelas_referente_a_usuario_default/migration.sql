-- CreateTable
CREATE TABLE "usuarioDefault" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "autorizacao" TEXT,
    "equipeId" TEXT,
    "perfilId" TEXT NOT NULL,
    "createAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateAt" TIMESTAMP(3),

    CONSTRAINT "usuarioDefault_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "escalaUsuarioDefault" (
    "id" TEXT NOT NULL,
    "servicos" JSONB,
    "disponibilidade" TEXT,
    "indisponibilidade" TEXT,
    "usuarioDefaultId" TEXT NOT NULL,
    "createAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateAt" TIMESTAMP(3),

    CONSTRAINT "escalaUsuarioDefault_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "rlTagsUsuarioDefault" (
    "id" TEXT NOT NULL,
    "usuarioDefaultId" TEXT NOT NULL,
    "tagId" TEXT NOT NULL,
    "createAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateAt" TIMESTAMP(3),

    CONSTRAINT "rlTagsUsuarioDefault_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "usuarioDefault" ADD CONSTRAINT "usuarioDefault_equipeId_fkey" FOREIGN KEY ("equipeId") REFERENCES "equipe"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "usuarioDefault" ADD CONSTRAINT "usuarioDefault_perfilId_fkey" FOREIGN KEY ("perfilId") REFERENCES "perfil"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "escalaUsuarioDefault" ADD CONSTRAINT "escalaUsuarioDefault_usuarioDefaultId_fkey" FOREIGN KEY ("usuarioDefaultId") REFERENCES "usuarioDefault"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rlTagsUsuarioDefault" ADD CONSTRAINT "rlTagsUsuarioDefault_usuarioDefaultId_fkey" FOREIGN KEY ("usuarioDefaultId") REFERENCES "usuarioDefault"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rlTagsUsuarioDefault" ADD CONSTRAINT "rlTagsUsuarioDefault_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "tags"("id") ON DELETE CASCADE ON UPDATE CASCADE;
