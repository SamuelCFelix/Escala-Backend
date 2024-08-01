const { PrismaClient } = require("@prisma/client");
const logger = require("../../../custom/logger");
const client = new PrismaClient();

module.exports = {
  async execute(usuarioId, disponibilidade, host) {
    try {
      const response = await client.$transaction(async (client) => {
        if (host) {
          const escalaUsuarioId = await client.escalaUsuarioHost.findFirst({
            where: {
              usuarioHostId: usuarioId,
            },
            select: {
              id: true,
            },
          });

          const escalaUsuario = await client.escalaUsuarioHost.update({
            where: {
              id: escalaUsuarioId?.id,
            },
            data: {
              disponibilidade,
              updateAt: new Date(),
            },
          });

          return escalaUsuario;
        } else {
          const escalaUsuarioId = await client.escalaUsuarioDefault.findFirst({
            where: {
              usuarioDefaultId: usuarioId,
            },
            select: {
              id: true,
            },
          });

          const escalaUsuario = await client.escalaUsuarioDefault.update({
            where: {
              id: escalaUsuarioId?.id,
            },
            data: {
              disponibilidade,
              updateAt: new Date(),
            },
          });

          return escalaUsuario;
        }
      });
      return response;
    } catch (error) {
      error.path = "/models/geral/tabelaInformacoes/saveDisponibilidade";
      logger.error(
        "Erro ao salvar disponibilidade de membro da equipe model",
        error
      );
      throw error;
    } finally {
      await client.$disconnect();
    }
  },
};
