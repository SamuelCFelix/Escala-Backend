const { PrismaClient } = require("@prisma/client");
const logger = require("../../../custom/logger");
const client = new PrismaClient();

module.exports = {
  async execute(usuarioId, acao) {
    try {
      const response = await client.$transaction(async (client) => {
        if (acao === "remover") {
          const buscarMembro = await client.usuarios.update({
            where: {
              id: usuarioId,
            },
            data: {
              autorizacao: null,
              updateAt: new Date(),
            },
          });
          return buscarMembro;
        } else if (acao === "adicionar") {
          const buscarMembro = await client.usuarios.update({
            where: {
              id: usuarioId,
            },
            data: {
              autorizacao: "adm002",
              updateAt: new Date(),
            },
          });
          return buscarMembro;
        }
      });

      return response;
    } catch (error) {
      error.path = "/models/equipe/perfilEquipe/updateMembroAdmEquipe";
      logger.error(
        "Erro ao tornar administrador o membro da equipe model",
        error
      );
      throw error;
    } finally {
      await client.$disconnect();
    }
  },
};
