const { PrismaClient } = require("@prisma/client");
const logger = require("../../../custom/logger");
const client = new PrismaClient();

module.exports = {
  async execute(equipeId) {
    try {
      const escalaEquipe = await client.equipe.findFirst({
        where: {
          id: equipeId,
        },
        select: {
          escalaMensal: true,
        },
      });

      if (!escalaEquipe) {
        return null;
      }

      const dataAtual = new Date();
      const agora = dataAtual.getTime();

      const programacoes = JSON.parse(escalaEquipe.escalaMensal);

      // Encontra a próxima programação que ocorre dentro do prazo até 1 hora após o horário atual
      const proximaProgramacao = programacoes?.find((programacao) => {
        const programacaoTime = new Date(
          programacao.data.split("/").reverse().join("-") +
            " " +
            programacao.horario
        ).getTime();

        // Considera o prazo de 1 hora após o horário programado
        return programacaoTime > agora || agora - programacaoTime <= 3600000;
      });

      let escalados = proximaProgramacao?.escalados?.map((escalado) => {
        return {
          membroId: escalado.membroId,
        };
      });

      let fotosUsuarios = await Promise.all(
        escalados?.map(async ({ membroId }) => {
          if (membroId === "sem membro") return;

          let usuario = {};

          usuario = await client.usuarioDefault.findFirst({
            where: {
              id: membroId,
            },
            select: {
              id: true,
              foto: true,
            },
          });

          if (!usuario) {
            usuario = await client.usuarioHost.findFirst({
              where: {
                id: membroId,
              },
              select: {
                id: true,
                foto: true,
              },
            });
          }

          return {
            membroId: usuario.id,
            membroFoto: usuario.foto,
          };
        })
      );

      fotosUsuarios = fotosUsuarios?.filter((foto) => foto !== undefined);

      return { proximaProgramacao, fotosUsuarios } || null;
    } catch (error) {
      error.path = "/models/geral/tabelaProximaEscala/findProximaEscala";
      logger.error("Erro ao buscar próxima escala da equipe model", error);
      throw error;
    } finally {
      await client.$disconnect();
    }
  },
};
