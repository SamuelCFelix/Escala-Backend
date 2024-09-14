const { PrismaClient } = require("@prisma/client");
const logger = require("../../../custom/logger");
const client = new PrismaClient();

module.exports = {
  async execute(equipeId, escalaDataId) {
    try {
      const buscarInfoEquipe = await client.equipe.findFirst({
        where: {
          id: equipeId,
        },
        select: {
          escalaMensal: true,
        },
      });

      if (!buscarInfoEquipe) {
        return [];
      }

      let escalaFormatted = JSON.parse(buscarInfoEquipe?.escalaMensal);

      const newEscalaData = escalaFormatted?.filter(
        (escala) => escala.escalaDataId !== escalaDataId
      );

      await client.equipe.update({
        where: {
          id: equipeId,
        },
        data: {
          escalaMensal: JSON.stringify(newEscalaData),
        },
      });

      return newEscalaData;
    } catch (error) {
      error.path = "/models/geral/tabelaEscalaMensal/updateEscalaData";
      logger.error("Erro ao deletar escala data da equipe model", error);
      throw error;
    } finally {
      await client.$disconnect();
    }
  },
};
