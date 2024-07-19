const { PrismaClient } = require("@prisma/client");
const logger = require("../../custom/logger");
const client = new PrismaClient();

module.exports = {
  async execute(usuarioId, isHost) {
    try {
      let infoUsuario;

      if (isHost) {
        infoUsuario = await client.usuarioHost.findFirst({
          where: {
            id: usuarioId,
          },
          select: {
            id: true,
            nome: true,
            Equipe: {
              select: {
                id: true,
              },
            },
            autorizacao: true,
          },
        });

        if (infoUsuario) {
          infoUsuario.usuarioHostId = infoUsuario.id;
          infoUsuario.equipeId = infoUsuario.Equipe[0]?.id;
          delete infoUsuario.id;
          delete infoUsuario.Equipe;
        }
      } else {
        infoUsuario = await client.usuarioDefault.findFirst({
          where: {
            id: usuarioId,
          },
          select: {
            id: true,
            nome: true,
            equipeId: true,
            autorizacao: true,
          },
        });

        if (infoUsuario) {
          infoUsuario.usuarioDefaultId = infoUsuario.id;
          delete infoUsuario.id;
        }
      }

      return infoUsuario;
    } catch (error) {
      error.path = "/models/home/findConfigHome";
      logger.error("Erro ao buscar informações iniciais da Home", error);
      throw error;
    } finally {
      await client.$disconnect();
    }
  },
};
