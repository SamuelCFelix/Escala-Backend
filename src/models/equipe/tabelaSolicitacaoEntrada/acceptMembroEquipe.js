const { PrismaClient } = require("@prisma/client");
const logger = require("../../../custom/logger");
const client = new PrismaClient();

module.exports = {
  async execute(usuarioId, equipeId) {
    try {
      const response = await client.$transaction(async (client) => {
        const aceitarMembroEquipe = await client.usuarios.update({
          where: {
            id: usuarioId,
          },
          data: {
            equipeId,
            updateAt: new Date(),
          },
        });

        const solicitaçãoUsuario = await client.rlSolicitacoes.findMany({
          where: {
            usuarioId,
            equipeId,
          },
        });

        if (solicitaçãoUsuario) {
          await client.rlSolicitacoes.delete({
            where: {
              id: solicitaçãoUsuario[0].id,
            },
          });
        }

        return aceitarMembroEquipe;
      });
      return response;
    } catch (error) {
      error.path = "/models/equipe/tabelaSolicitacaoEntrada/acceptMembroEquipe";
      logger.error("Erro ao aceitar membro na equipe model", error);
      throw error;
    } finally {
      await client.$disconnect();
    }
  },
};
