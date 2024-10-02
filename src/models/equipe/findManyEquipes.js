const { PrismaClient } = require("@prisma/client");
const logger = require("../../custom/logger");
const client = new PrismaClient();

module.exports = {
  async execute() {
    try {
      const response = await client.$transaction(async (client) => {
        const equipes = await client.equipe.findMany({
          select: {
            id: true,
            nome: true,
            descricao: true,
            usuarioHostId: true,
            Programacoes: {
              select: {
                createAt: true,
              },
            },
            Usuarios: {
              select: {
                createAt: true,
              },
            },
          },
        });

        const userHostEquipe = await client.usuario.findMany({
          where: {
            id: {
              in: equipes?.map((equipe) => equipe.usuarioHostId),
            },
          },
          select: {
            id: true,
            nome: true,
            foto: true,
          },
        });

        const equipesComUsuarioHost = equipes?.map((equipe) => {
          const usuarioHost = userHostEquipe.find(
            (host) => host.id === equipe.usuarioHostId
          );

          return {
            ...equipe,
            usuarioHost: usuarioHost
              ? {
                  id: usuarioHost.id,
                  nome: usuarioHost.nome,
                  foto: usuarioHost.foto,
                }
              : null,
          };
        });

        return equipesComUsuarioHost;
      });
      return response;
    } catch (error) {
      error.path = "/models/equipe/findManyEquipes";
      logger.error("Erro ao criar equipe", error);
      throw error;
    } finally {
      await client.$disconnect();
    }
  },
};
