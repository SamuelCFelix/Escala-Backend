const { PrismaClient } = require("@prisma/client");
const logger = require("../../custom/logger");
const client = new PrismaClient();

module.exports = {
  async execute(
    usuarioHostId,
    nomeEquipe,
    descricaoEquipe,
    programacoes,
    tags
  ) {
    try {
      const response = await client.$transaction(async (client) => {
        logger.debug("Iniciando criação de equipe");
        const createEquipe = await client.equipe.create({
          data: {
            nome: nomeEquipe,
            descricao: descricaoEquipe,
            usuarioHostId: usuarioHostId,
          },
        });

        await Promise.all(
          tags?.map(async ({ tag }) => {
            await client.tags.create({
              data: {
                nome: tag,
                equipeId: createEquipe.id,
              },
            });
          })
        );

        await Promise.all(
          programacoes?.map(
            async ({ culto, dia, horario, servindo, tagsCulto }) => {
              const createProgramacao = await client.programacao.create({
                data: {
                  culto,
                  dia,
                  horario,
                  servindo,
                  equipeId: createEquipe.id,
                },
              });
              await Promise.all(
                tagsCulto?.map(async (tagProgramacao) => {
                  const findTag = await client.tags.findFirst({
                    where: {
                      nome: tagProgramacao,
                      equipeId: createEquipe.id,
                    },
                    select: {
                      id: true,
                    },
                  });

                  await client.rlTagsProgramacao.create({
                    data: {
                      programacaoId: createProgramacao.id,
                      tagId: findTag.id,
                    },
                  });
                })
              );
            }
          )
        );
        logger.debug("Processo finalizado");
        return "Equipe criada";
      });
      return response;
    } catch (error) {
      error.path = "/models/equipe/createEquipe";
      logger.error("Erro ao criar equipe", error);
      throw error;
    } finally {
      await client.$disconnect();
    }
  },
};
