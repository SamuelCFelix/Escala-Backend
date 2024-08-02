const { PrismaClient } = require("@prisma/client");
const logger = require("../../../custom/logger");
const client = new PrismaClient();

module.exports = {
  async execute(usuarioId, host) {
    try {
      const response = await client.$transaction(async (client) => {
        if (host) {
          const escalaUsuario = await client.escalaUsuarioHost.findFirst({
            where: {
              usuarioHostId: usuarioId,
            },
            select: {
              disponibilidade: true,
            },
          });

          return escalaUsuario;
        } else {
          const escalaUsuario = await client.escalaUsuarioDefault.findFirst({
            where: {
              usuarioDefaultId: usuarioId,
            },
            select: {
              disponibilidade: true,
            },
          });

          return escalaUsuario;
        }
      });
      return response;
    } catch (error) {
      error.path = "/models/geral/tabelaInformacoes/findDisponibilidadeMembro";
      logger.error(
        "Erro ao buscar disponibilidade de membro da equipe model",
        error
      );
      throw error;
    } finally {
      await client.$disconnect();
    }
  },
};
