const { PrismaClient } = require("@prisma/client");
const logger = require("../../../custom/logger");
const client = new PrismaClient();

module.exports = {
  async execute(usuarioId) {
    try {
      const response = await client.$transaction(async (client) => {
        const buscarMembro = await client.usuarioDefault.update({
          where: {
            id: usuarioId,
          },
          data: {
            equipeId: null,
            ativo: true,
            updateAt: new Date(),
          },
        });

        const tagsMembro = await client.rlTagsUsuarioDefault.findMany({
          where: {
            usuarioDefaultId: usuarioId,
          },
          select: {
            id: true,
          },
        });

        if (tagsMembro?.length > 0) {
          await client.rlTagsUsuarioDefault.deleteMany({
            where: {
              usuarioDefaultId: usuarioId,
            },
          });
        }

        const escalaUsuario = await client.escalaUsuarioDefault.findFirst({
          where: {
            usuarioDefaultId: usuarioId,
          },
        });

        if (escalaUsuario?.id) {
          await client.escalaUsuarioDefault.update({
            where: {
              id: escalaUsuario?.id,
            },
            data: {
              servicos: null,
              disponibilidade: null,
              updateAt: new Date(),
            },
          });
        }

        return buscarMembro;
      });

      return response;
    } catch (error) {
      error.path = "/models/equipe/perfilEquipe/expulsarMembroEquipe";
      logger.error("Erro ao expulsar membro da equipe model", error);
      throw error;
    } finally {
      await client.$disconnect();
    }
  },
};
