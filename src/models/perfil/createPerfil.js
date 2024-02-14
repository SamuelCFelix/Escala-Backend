const { PrismaClient } = require("@prisma/client");
const logger = require("../../custom/logger");
const {
  PrismaClientValidationError,
} = require("@prisma/client/runtime/library");

const bcrypt = require("bcrypt");

async function hashInfo(info) {
  const saltRounds = 10;
  try {
    const hashedInfo = await bcrypt.hash(info, saltRounds);
    return hashedInfo;
  } catch (error) {
    // Tratamento de erro
    console.error("Erro ao hashear informação:", error);
    throw error;
  }
}

const client = new PrismaClient();

module.exports = {
  async execute(nome, cpf, dataNascimento, numeroTelefone, email, senha) {
    try {
      const response = await client.$transaction(async (client) => {
        const createPerfil = await client.perfil.create({
          data: {
            nome,
            cpf: await hashInfo(cpf),
            dataNascimento,
            numeroTelefone,
            email,
            senha: await hashInfo(senha),
            termos: true,
          },
        });
        return createPerfil;
      });
      return response;
    } catch (error) {
      if (error instanceof PrismaClientValidationError) {
        error.path = "/models/perfil/createPerfil";
      }
      logger.error("Erro ao criar perfil:", error);
      throw error;
    } finally {
      await client.$disconnect();
    }
  },
};
