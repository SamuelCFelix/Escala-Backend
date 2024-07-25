const { PrismaClient } = require("@prisma/client");
const logger = require("../../../custom/logger");
const client = new PrismaClient();

module.exports = {
  async execute(usuarioId, equipeId) {
    try {
      const response = await client.$transaction(async (client) => {
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

        return solicitaçãoUsuario;
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
