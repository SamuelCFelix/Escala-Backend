const { PrismaClient } = require("@prisma/client");
const logger = require("../../../custom/logger");
const client = new PrismaClient();

module.exports = {
  async execute(equipeId, escalaDataId, escalados) {
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

      const indexEscalaData = escalaFormatted?.findIndex(
        (escala) => escala.escalaDataId === escalaDataId
      );

      let newEscalaData = escalaFormatted?.find(
        (escala) => escala.escalaDataId === escalaDataId
      );

      newEscalaData.escalados = escalados;

      escalaFormatted[indexEscalaData] = newEscalaData;

      await client.equipe.update({
        where: {
          id: equipeId,
        },
        data: {
          escalaMensal: JSON.stringify(escalaFormatted),
        },
      });

      return escalaFormatted[indexEscalaData];
    } catch (error) {
      error.path = "/models/geral/tabelaProximaEscala/findUsuariosDisponiveis";
      logger.error("Erro ao atualizar escala data da equipe model", error);
      throw error;
    } finally {
      await client.$disconnect();
    }
  },
};
