const { PrismaClient } = require("@prisma/client");
const logger = require("../../../custom/logger");
const client = new PrismaClient();

module.exports = {
  async execute(usuarioId, tagId, acao) {
    try {
      const response = await client.$transaction(async (client) => {
        let buscarRlTag = [];

        buscarRlTag = await client.rlTagsUsuarios.findFirst({
          where: {
            usuarioId,
            tagId,
          },
        });

        if (acao === "adicionar") {
          if (!buscarRlTag) {
            buscarRlTag = await client.rlTagsUsuarios.create({
              data: {
                usuarioId,
                tagId,
              },
            });
          }
        } else if (acao === "remover") {
          if (buscarRlTag) {
            await client.rlTagsUsuarios.delete({
              where: {
                id: buscarRlTag.id,
              },
            });
          }
        }

        let tagsUsuario = await client.rlTagsUsuarios.findMany({
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

        tagsUsuario = tagsUsuario?.map((tagRelation) => ({
          id: tagRelation.tags.id,
          nome: tagRelation.tags.nome,
        }));

        return tagsUsuario;
      });

      return response;
    } catch (error) {
      error.path = "/models/equipe/perfilEquipe/updateTagsMembroEquipe";
      logger.error("Erro ao atualizar tags do membro da equipe model", error);
      throw error;
    } finally {
      await client.$disconnect();
    }
  },
};
