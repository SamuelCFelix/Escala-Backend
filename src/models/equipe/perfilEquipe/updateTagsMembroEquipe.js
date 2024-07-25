const { PrismaClient } = require("@prisma/client");
const logger = require("../../../custom/logger");
const client = new PrismaClient();

module.exports = {
  async execute(usuarioId, tagId, acao, host) {
    try {
      const response = await client.$transaction(async (client) => {
        let buscarRlTag = [];

        if (host) {
          buscarRlTag = await client.rlTagsUsuarioHost.findFirst({
            where: {
              usuarioHostId: usuarioId,
              tagId,
            },
          });

          if (acao === "adicionar") {
            if (!buscarRlTag) {
              buscarRlTag = await client.rlTagsUsuarioHost.create({
                data: {
                  usuarioHostId: usuarioId,
                  tagId,
                },
              });
            }
          } else if (acao === "remover") {
            if (buscarRlTag) {
              await client.rlTagsUsuarioHost.delete({
                where: {
                  id: buscarRlTag.id,
                },
              });
            }
          }

          let tagsUsuarioHost = await client.rlTagsUsuarioHost.findMany({
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

          tagsUsuarioHost = tagsUsuarioHost?.map((tagRelation) => ({
            id: tagRelation.tags.id,
            nome: tagRelation.tags.nome,
          }));

          return tagsUsuarioHost;
        } else {
          buscarRlTag = await client.rlTagsUsuarioDefault.findFirst({
            where: {
              usuarioDefaultId: usuarioId,
              tagId,
            },
          });

          if (acao === "adicionar") {
            if (!buscarRlTag) {
              buscarRlTag = await client.rlTagsUsuarioDefault.create({
                data: {
                  usuarioDefaultId: usuarioId,
                  tagId,
                },
              });
            }
          } else if (acao === "remover") {
            if (buscarRlTag) {
              await client.rlTagsUsuarioDefault.delete({
                where: {
                  id: buscarRlTag.id,
                },
              });
            }
          }

          let tagsUsuarioDefault = await client.rlTagsUsuarioDefault.findMany({
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

          tagsUsuarioDefault = tagsUsuarioDefault?.map((tagRelation) => ({
            id: tagRelation.tags.id,
            nome: tagRelation.tags.nome,
          }));

          return tagsUsuarioDefault;
        }
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
