const { PrismaClient } = require("@prisma/client");
const logger = require("../../../custom/logger");
const client = new PrismaClient();

module.exports = {
  async execute(equipeId, usuarioId) {
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
        throw new Error("Equipe não encontrada");
      }

      if (escalaEquipe.escalaMensal !== null) {
        let escalacoesUsuario = [];

        escalacoesUsuario = JSON.parse(escalaEquipe?.escalaMensal);

        // Obtenha a data e hora atual
        const dataAtual = new Date();

        escalacoesUsuario = escalacoesUsuario
          .map((programacao) => {
            let membroEscalado = programacao.escalados.filter(
              (escalado) => escalado.membroId === usuarioId
            );

            if (membroEscalado?.length > 0) {
              const dataHoraProgramacao = new Date(
                `${programacao.data.split("/").reverse().join("-")} ${
                  programacao.horario
                }`
              );

              // Calcule a diferença em horas
              const diffHoras =
                (dataAtual - dataHoraProgramacao) / (1000 * 60 * 60);

              if (diffHoras <= 1) {
                return {
                  programacaoId: programacao.id,
                  data: programacao.data,
                  dia: programacao.dia,
                  horario: programacao.horario,
                  culto: programacao.culto,
                  usuarioEscalado: membroEscalado[0],
                };
              }
            }
          })
          .filter((programacao) => programacao !== undefined);

        return escalacoesUsuario;
      } else {
        return [];
      }
    } catch (error) {
      error.path = "/models/geral/tabelaInformacoes/findEscalacoesUsuario";
      logger.error("Erro ao buscar escala do membro da equipe model", error);
      throw error;
    } finally {
      await client.$disconnect();
    }
  },
};
