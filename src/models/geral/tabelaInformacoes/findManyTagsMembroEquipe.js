const { PrismaClient } = require("@prisma/client");
const logger = require("../../../custom/logger");
const client = new PrismaClient();

module.exports = {
  async execute(usuarioId) {
    try {
      const tagsUsuario = await client.rlTagsUsuarios.findMany({
        where: {
          usuarioId,
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

      const tagsUsuarioFormatted = tagsUsuario?.map((tagRelation) => ({
        id: tagRelation.tags.id,
        nome: tagRelation.tags.nome,
      }));

      return tagsUsuarioFormatted;
    } catch (error) {
      error.path = "/models/geral/tabelaInformacoes/findManyTagsMembrosEquipe";
      logger.error("Erro ao buscar tags de membro da equipe model", error);
      throw error;
    } finally {
      await client.$disconnect();
    }
  },
};
