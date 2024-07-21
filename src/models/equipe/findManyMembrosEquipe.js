const { PrismaClient } = require("@prisma/client");
const logger = require("../../custom/logger");
const client = new PrismaClient();

module.exports = {
  async execute(equipeId) {
    try {
      const usuarioHostEquipe = await client.equipe.findFirst({
        where: {
          id: equipeId,
        },
        select: {
          usuarioHost: {
            select: {
              id: true,
              nome: true,
              autorizacao: true,
              perfil: {
                select: {
                  email: true,
                  dataNascimento: true,
                },
              },
            },
          },
        },
      });

      const membrosEquipe = await client.equipe.findFirst({
        where: {
          id: equipeId,
        },
        select: {
          UsuarioDefault: {
            select: {
              id: true,
              nome: true,
              autorizacao: true,
              perfil: {
                select: {
                  email: true,
                  dataNascimento: true,
                },
              },
            },
          },
        },
      });

      const membrosEquipeFormatted = membrosEquipe?.UsuarioDefault?.map(
        (membro, index) => {
          return {
            UsuarioDefaultId: membro?.id,
            nome: membro?.nome,
            autorizacao: membro?.autorizacao,
            email: membro?.perfil?.email,
            dataNascimento: membro?.perfil?.dataNascimento,
          };
        }
      );

      const hostFormatted = {
        UsuarioHostId: usuarioHostEquipe?.usuarioHost?.id,
        nome: usuarioHostEquipe?.usuarioHost?.nome,
        autorizacao: usuarioHostEquipe?.usuarioHost?.autorizacao,
        email: usuarioHostEquipe?.usuarioHost?.perfil?.email,
        dataNascimento: usuarioHostEquipe?.usuarioHost?.perfil?.dataNascimento,
      };

      membrosEquipeFormatted.push(hostFormatted);

      return membrosEquipeFormatted;
    } catch (error) {
      error.path = "/models/equipe/findManyMembrosEquipe";
      logger.error("Erro ao buscar membro da equipe model", error);
      throw error;
    } finally {
      await client.$disconnect();
    }
  },
};
