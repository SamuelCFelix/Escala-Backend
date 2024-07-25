const { PrismaClient } = require("@prisma/client");
const logger = require("../../../custom/logger");
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
              ativo: true,
              perfil: {
                select: {
                  email: true,
                  dataNascimento: true,
                },
              },
              RlTagsUsuarioHost: {
                select: {
                  tags: {
                    select: {
                      id: true,
                      nome: true,
                    },
                  },
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
              ativo: true,
              perfil: {
                select: {
                  email: true,
                  dataNascimento: true,
                },
              },
              RlTagsUsuarioDefault: {
                select: {
                  tags: {
                    select: {
                      id: true,
                      nome: true,
                    },
                  },
                },
              },
            },
          },
        },
      });

      const membrosEquipeFormatted = membrosEquipe?.UsuarioDefault?.map(
        (membro) => {
          return {
            usuarioDefaultId: membro?.id,
            nome: membro?.nome,
            autorizacao: membro?.autorizacao,
            email: membro?.perfil?.email,
            dataNascimento: membro?.perfil?.dataNascimento,
            ativo: membro?.ativo,
            tags: membro?.RlTagsUsuarioDefault?.map((tagRelation) => ({
              id: tagRelation.tags.id,
              nome: tagRelation.tags.nome,
            })),
          };
        }
      );

      const hostFormatted = {
        usuarioHostId: usuarioHostEquipe?.usuarioHost?.id,
        nome: usuarioHostEquipe?.usuarioHost?.nome,
        autorizacao: usuarioHostEquipe?.usuarioHost?.autorizacao,
        email: usuarioHostEquipe?.usuarioHost?.perfil?.email,
        dataNascimento: usuarioHostEquipe?.usuarioHost?.perfil?.dataNascimento,
        ativo: usuarioHostEquipe?.usuarioHost?.ativo,
        tags: usuarioHostEquipe?.usuarioHost?.RlTagsUsuarioHost?.map(
          (tagRelation) => ({
            id: tagRelation.tags.id,
            nome: tagRelation.tags.nome,
          })
        ),
      };

      membrosEquipeFormatted.push(hostFormatted);

      return membrosEquipeFormatted;
    } catch (error) {
      error.path = "/models/equipe/tabelaMinhaEquipe/findManyMembrosEquipe";
      logger.error("Erro ao buscar membro da equipe model", error);
      throw error;
    } finally {
      await client.$disconnect();
    }
  },
};
