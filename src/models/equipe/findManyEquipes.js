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

        const usersHostEquipes = await Promise.all(
          equipes?.map(async (equipe) => {
            let userHost = await client.usuarios.findFirst({
              where: {
                id: equipe.usuarioHostId,
              },
              select: {
                id: true,
                nome: true,
                foto: true,
              },
            });

            return userHost;
          })
        );

        const equipesComUsuarioHost = equipes?.map((equipe) => {
          const usuarioHost = usersHostEquipes.find(
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
