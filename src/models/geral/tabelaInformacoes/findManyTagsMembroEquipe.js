const { PrismaClient } = require("@prisma/client");
const logger = require("../../../custom/logger");
const client = new PrismaClient();

module.exports = {
  async execute(usuarioId, host) {
    try {
      if (host) {
        const tagsUsuarioHost = await client.rlTagsUsuarioHost.findMany({
          where: {
            usuarioHostId: usuarioId,
          },
          select: {
            tags: {
              select: {
                id: true,
                nome: true,
              },
            },
          },
        });

        const tagsUsuarioHostFormatted = tagsUsuarioHost?.map(
          (tagRelation) => ({
            id: tagRelation.tags.id,
            nome: tagRelation.tags.nome,
          })
        );

        return tagsUsuarioHostFormatted;
      } else {
        const tagsUsuarioDefault = await client.rlTagsUsuarioDefault.findMany({
          where: {
            usuarioDefaultId: usuarioId,
          },
          select: {
            tags: {
              select: {
                id: true,
                nome: true,
              },
            },
          },
        });

        const tagsUsuarioDefaultFormatted = tagsUsuarioDefault?.map(
          (tagRelation) => ({
            id: tagRelation.tags.id,
            nome: tagRelation.tags.nome,
          })
        );

        return tagsUsuarioDefaultFormatted;
      }
    } catch (error) {
      error.path = "/models/geral/tabelaInformacoes/findManyTagsMembrosEquipe";
      logger.error("Erro ao buscar tags de membro da equipe model", error);
      throw error;
    } finally {
      await client.$disconnect();
    }
  },
};
