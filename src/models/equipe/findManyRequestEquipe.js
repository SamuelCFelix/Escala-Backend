const { PrismaClient } = require("@prisma/client");
const { format } = require("date-fns");
const { ptBR } = require("date-fns/locale");
const logger = require("../../custom/logger");
const client = new PrismaClient();

module.exports = {
  async execute(equipeId) {
    try {
      const solicitacoesEquipe = await client.rlSolicitacao.findMany({
        where: {
          equipeId,
        },
        select: {
          usuarioDefaultId: true,
          usuarioDefault: {
            select: {
              perfil: {
                select: {
                  nome: true,
                  email: true,
                },
              },
            },
          },
          createAt: true,
        },
      });

      const solicitacoesTransformadas = solicitacoesEquipe?.map(
        (solicitacao) => {
          const formattedDate = format(
            new Date(solicitacao.createAt),
            "HH:mm - dd/MM/yyyy",
            { locale: ptBR }
          );

          return {
            usuarioDefaultId: solicitacao.usuarioDefaultId,
            nome: solicitacao.usuarioDefault.perfil.nome,
            email: solicitacao.usuarioDefault.perfil.email,
            createAt: formattedDate,
          };
        }
      );

      return solicitacoesTransformadas;
    } catch (error) {
      error.path = "/models/equipe/findManyRequestEquipe";
      logger.error("Erro ao buscar solicitações da equipe model", error);
      throw error;
    } finally {
      await client.$disconnect();
    }
  },
};
