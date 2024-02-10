-- CreateTable
CREATE TABLE "perfil" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "cpf" TEXT NOT NULL,
    "dataNascimento" TEXT NOT NULL,
    "numeroTelefone" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "senha" TEXT NOT NULL,
    "termos" BOOLEAN NOT NULL,
    "createAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateAt" TIMESTAMP(3),

    CONSTRAINT "perfil_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "usuarioHost" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "autorizacao" TEXT NOT NULL,
    "perfilId" TEXT NOT NULL,
    "createAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateAt" TIMESTAMP(3),

    CONSTRAINT "usuarioHost_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "perfil_cpf_key" ON "perfil"("cpf");

-- CreateIndex
CREATE UNIQUE INDEX "perfil_email_key" ON "perfil"("email");

-- AddForeignKey
ALTER TABLE "usuarioHost" ADD CONSTRAINT "usuarioHost_perfilId_fkey" FOREIGN KEY ("perfilId") REFERENCES "perfil"("id") ON DELETE CASCADE ON UPDATE CASCADE;
