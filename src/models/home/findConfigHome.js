const { PrismaClient } = require("@prisma/client");
const logger = require("../../custom/logger");
const client = new PrismaClient();

module.exports = {
  async execute(usuarioId, isHost) {
    try {
      /* const equipes = await client.equipe.findMany({
        }); */
      if (isHost) {
        const infoUsuario = await client.usuarioHost.findFirst({
          where: {
            id: usuarioId,
          },
          select: {
            nome: true,
            autorizacao: true,
          },
        });

        return infoUsuario;
      } else {
        const infoUsuario = await client.usuarioDefault.findFirst({
          where: {
            id: usuarioId,
          },
          select: {
            nome: true,
            autorizacao: true,
          },
        });
        return infoUsuario;
      }
    } catch (error) {
      error.path = "/models/home/findConfigHome";
      logger.error("Erro ao buscar informações iniciais da Home", error);
      throw error;
    } finally {
      await client.$disconnect();
    }
  },
};
