const { PrismaClient } = require("@prisma/client");
const logger = require("../../../custom/logger");
const client = new PrismaClient();

module.exports = {
  async execute(usuarioId, disponibilidadeProximoMes) {
    try {
      const response = await client.$transaction(async (client) => {
        const escalaUsuarioId = await client.escalaUsuarios.findFirst({
          where: {
            usuarioId,
          },
          select: {
            id: true,
          },
        });

        const escalaUsuario = await client.escalaUsuarios.update({
          where: {
            id: escalaUsuarioId?.id,
          },
          data: {
            disponibilidadeProximoMes,
            updateAt: new Date(),
          },
        });

        return escalaUsuario;
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
