const { PrismaClient } = require("@prisma/client");
const logger = require("../../../custom/logger");
const client = new PrismaClient();

module.exports = {
  async execute(usuarioId, equipeId) {
    try {
      const response = await client.$transaction(async (client) => {
        const solicitacaoUsuario = await client.rlSolicitacoes.findMany({
          where: {
            usuarioId,
            equipeId,
          },
        });

        if (solicitacaoUsuario) {
          await client.rlSolicitacoes.delete({
            where: {
              id: solicitacaoUsuario[0].id,
            },
          });
        }

        return solicitacaoUsuario;
      });
      return response;
    } catch (error) {
      error.path = "/models/equipe/tabelaSolicitacaoEntrada/recuseMembroEquipe";
      logger.error("Erro ao recusar membro na equipe model", error);
      throw error;
    } finally {
      await client.$disconnect();
    }
  },
};
