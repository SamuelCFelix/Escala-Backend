const { PrismaClient } = require("@prisma/client");

const client = new PrismaClient();

module.exports = {
  async execute(nome, cpf, dataNascimento, numeroTelefone, email, senha) {
    try {
      const response = await client.$transaction(async (client) => {
        const createPerfil = await client.perfil.create({
          data: {
            nome,
            cpf,
            dataNascimento,
            numeroTelefone,
            email,
            senha,
            termos: true,
          },
        });
        return createPerfil;
      });
      return response;
    } catch (error) {
      error.path = "/models/perfil/createPerfil";
      throw error;
    } finally {
      await client.$disconnect();
    }
  },
};
