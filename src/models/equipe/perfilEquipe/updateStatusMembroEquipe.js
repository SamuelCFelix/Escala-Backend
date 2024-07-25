const { PrismaClient } = require("@prisma/client");
const logger = require("../../../custom/logger");
const client = new PrismaClient();

module.exports = {
  async execute(usuarioId, acao, host) {
    try {
      const response = await client.$transaction(async (client) => {
        if (host) {
          if (acao === "ativar") {
            const buscarMembro = await client.usuarioHost.update({
              where: {
                id: usuarioId,
              },
              data: {
                ativo: true,
                updateAt: new Date(),
              },
            });
            return buscarMembro;
          } else if (acao === "desativar") {
            const buscarMembro = await client.usuarioHost.update({
              where: {
                id: usuarioId,
              },
              data: {
                ativo: false,
                updateAt: new Date(),
              },
            });
            return buscarMembro;
          }
        } else {
          if (acao === "ativar") {
            const buscarMembro = await client.usuarioDefault.update({
              where: {
                id: usuarioId,
              },
              data: {
                ativo: true,
                updateAt: new Date(),
              },
            });
            return buscarMembro;
          } else if (acao === "desativar") {
            const buscarMembro = await client.usuarioDefault.update({
              where: {
                id: usuarioId,
              },
              data: {
                ativo: false,
                updateAt: new Date(),
              },
            });
            return buscarMembro;
          }
        }
      });

      return response;
    } catch (error) {
      error.path = "/models/equipe/perfilEquipe/updateStatusMembroEquipe";
      logger.error("Erro ao mudar status do membro da equipe model", error);
      throw error;
    } finally {
      await client.$disconnect();
    }
  },
};
