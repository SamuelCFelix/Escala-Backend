const { PrismaClient } = require("@prisma/client");
const logger = require("../../../custom/logger");
const client = new PrismaClient();

module.exports = {
  async execute(equipeId) {
    try {
      const tagsEquipe = await client.equipe.findFirst({
        where: {
          id: equipeId,
        },
        select: {
          Tags: {
            select: {
              id: true,
              nome: true,
            },
          },
        },
      });

      return tagsEquipe?.Tags;
    } catch (error) {
      error.path = "/models/equipe/tabelaMinhaEquipe/findManyMembrosEquipe";
      logger.error("Erro ao buscar membro da equipe model", error);
      throw error;
    } finally {
      await client.$disconnect();
    }
  },
};
