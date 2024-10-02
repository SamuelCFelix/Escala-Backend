const { PrismaClient } = require("@prisma/client");
const logger = require("../../../custom/logger");
const client = new PrismaClient();

module.exports = {
  async execute(equipeId, usuarioId) {
    try {
      const response = await client.$transaction(async (client) => {
        const buscarMembro = await client.usuarios.update({
          where: {
            id: usuarioId,
          },
          data: {
            equipeId: null,
            statusUsuario: true,
            updateAt: new Date(),
          },
        });

        const tagsMembro = await client.rlTagsUsuarios.findMany({
          where: {
            usuarioId,
          },
          select: {
            id: true,
          },
        });

        if (tagsMembro?.length > 0) {
          await client.rlTagsUsuarios.deleteMany({
            where: {
              usuarioId,
            },
          });
        }

        const escalaUsuario = await client.escalaUsuarios.findFirst({
          where: {
            usuarioId,
          },
        });

        if (escalaUsuario?.id) {
          await client.escalaUsuarios.update({
            where: {
              id: escalaUsuario?.id,
            },
            data: {
              disponibilidadeProximoMes: null,
              disponibilidadeMensal: null,
              updateAt: new Date(),
            },
          });
        }

        const buscarEquipe = await client.equipe.findFirst({
          where: {
            id: equipeId,
          },
          select: {
            escalaMensal: true,
            proximaEscalaMensal: true,
          },
        });

        if (buscarEquipe?.escalaMensal) {
          const programacoes = JSON.parse(buscarEquipe.escalaMensal);

          const novasProgramacoes = programacoes?.map((programacao) => {
            const novosEscalados = programacao.escalados?.map((escalado) => {
              if (escalado.membroId === usuarioId) {
                return {
                  ...escalado,
                  membroId: "sem membro",
                  membroNome: "sem membro",
                };
              }
              return escalado;
            });

            return {
              ...programacao,
              escalados: novosEscalados,
            };
          });

          await client.equipe.update({
            where: {
              id: equipeId,
            },
            data: {
              escalaMensal: JSON.stringify(novasProgramacoes),
            },
          });
        }

        if (buscarEquipe?.proximaEscalaMensal) {
          const programacoes = JSON.parse(buscarEquipe.proximaEscalaMensal);

          const novasProgramacoes = programacoes?.map((programacao) => {
            const novosEscalados = programacao.escalados?.map((escalado) => {
              if (escalado.membroId === usuarioId) {
                return {
                  ...escalado,
                  membroId: "sem membro",
                  membroNome: "sem membro",
                };
              }
              return escalado;
            });

            return {
              ...programacao,
              escalados: novosEscalados,
            };
          });

          await client.equipe.update({
            where: {
              id: equipeId,
            },
            data: {
              proximaEscalaMensal: JSON.stringify(novasProgramacoes),
            },
          });
        }

        return buscarMembro;
      });

      return response;
    } catch (error) {
      error.path = "/models/equipe/perfilEquipe/expulsarMembroEquipe";
      logger.error("Erro ao expulsar membro da equipe model", error);
      throw error;
    } finally {
      await client.$disconnect();
    }
  },
};
