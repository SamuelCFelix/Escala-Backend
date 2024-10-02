const { PrismaClient } = require("@prisma/client");
const logger = require("../../../custom/logger");
const client = new PrismaClient();

module.exports = {
  async execute(equipeId) {
    try {
      const membrosEquipe = await client.equipe.findFirst({
        where: {
          id: equipeId,
        },
        select: {
          Usuarios: {
            select: {
              id: true,
              nome: true,
              foto: true,
              autorizacao: true,
              statusUsuario: true,
              perfil: {
                select: {
                  email: true,
                  dataNascimento: true,
                },
              },
              RlTagsUsuarios: {
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

      const membrosEquipeFormatted = membrosEquipe?.Usuarios?.map((membro) => {
        return {
          usuarioId: membro?.id,
          nome: membro?.nome,
          foto: membro?.foto,
          autorizacao: membro?.autorizacao,
          email: membro?.perfil?.email,
          dataNascimento: membro?.perfil?.dataNascimento,
          statusUsuario: membro?.statusUsuario,
          tags: membro?.RlTagsUsuarios?.map((tagRelation) => ({
            id: tagRelation.tags.id,
            nome: tagRelation.tags.nome,
          })),
        };
      });

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
