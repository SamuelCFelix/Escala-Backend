const { PrismaClient } = require("@prisma/client");
const logger = require("../../custom/logger");
const client = new PrismaClient();

module.exports = {
  async execute(usuarioId, equipeId) {
    try {
      const response = await client.$transaction(async (client) => {
        const aceitarMembroEquipe = await client.usuarioDefault.update({
          where: {
            id: usuarioId,
          },
          data: {
            equipeId: equipeId,
          },
        });

        const solicitaçãoUsuario = await client.rlSolicitacao.findMany({
          where: {
            usuarioDefaultId: usuarioId,
            equipeId: equipeId,
          },
        });

        if (solicitaçãoUsuario) {
          await client.rlSolicitacao.delete({
            where: {
              id: solicitaçãoUsuario[0].id,
            },
          });
        }

        return aceitarMembroEquipe;
      });
      return response;
    } catch (error) {
      error.path = "/models/equipe/acceptMembroEquipe";
      logger.error("Erro ao aceitar membro na equipe model", error);
      throw error;
    } finally {
      await client.$disconnect();
    }
  },
};
