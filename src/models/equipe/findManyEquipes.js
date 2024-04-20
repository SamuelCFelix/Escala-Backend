const { PrismaClient } = require("@prisma/client");
const logger = require("../../custom/logger");
const client = new PrismaClient();

module.exports = {
  async execute() {
    try {
      const response = await client.$transaction(async (client) => {
        const equipes = await client.equipe.findMany({
          select: {
            id: true,
            nome: true,
            descricao: true,
            usuarioHost: {
              select: {
                nome: true,
              },
            },
            Programacao: {
              select: {
                createAt: true,
              },
            },
            UsuarioDefault: {
              select: {
                createAt: true,
              },
            },
          },
        });

        return equipes;
      });
      return response;
    } catch (error) {
      error.path = "/models/equipe/findManyEquipes";
      logger.error("Erro ao criar equipe", error);
      throw error;
    } finally {
      await client.$disconnect();
    }
  },
};
