-- CreateTable
CREATE TABLE "usuarioHost" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "cpf" TEXT NOT NULL,
    "dataNascimento" TEXT NOT NULL,
    "numeroTelefone" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "senha" TEXT NOT NULL,
    "termos" BOOLEAN NOT NULL,
    "autorizacao" TEXT NOT NULL,
    "createAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateAt" TIMESTAMP(3),

    CONSTRAINT "usuarioHost_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "usuarioHost_cpf_key" ON "usuarioHost"("cpf");

-- CreateIndex
CREATE UNIQUE INDEX "usuarioHost_email_key" ON "usuarioHost"("email");
