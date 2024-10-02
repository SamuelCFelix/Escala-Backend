const { PrismaClient } = require("@prisma/client");
const logger = require("../../../custom/logger");
const client = new PrismaClient();

module.exports = {
  async execute(usuarioId) {
    try {
      const response = await client.$transaction(async (client) => {
        const escalaUsuario = await client.escalaUsuarios.findFirst({
          where: {
            usuarioId,
          },
          select: {
            disponibilidadeProximoMes: true,
          },
        });

        return escalaUsuario;
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
