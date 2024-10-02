const { PrismaClient } = require("@prisma/client");
const { format } = require("date-fns");
const { ptBR } = require("date-fns/locale");
const logger = require("../../../custom/logger");
const client = new PrismaClient();

module.exports = {
  async execute(equipeId) {
    try {
      const solicitacoesEquipe = await client.rlSolicitacoes.findMany({
        where: {
          equipeId,
        },
        select: {
          usuarioId: true,
          usuarios: {
            select: {
              perfil: {
                select: {
                  nome: true,
                  foto: true,
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
            usuarioId: solicitacao.usuarioId,
            nome: solicitacao.usuarios.perfil.nome,
            foto: solicitacao.usuarios.perfil.foto,
            email: solicitacao.usuarios.perfil.email,
            createAt: formattedDate,
          };
        }
      );

      return solicitacoesTransformadas;
    } catch (error) {
      error.path =
        "/models/equipe/tabelaSolicitacaoEntrada/findManyRequestEquipe";
      logger.error("Erro ao buscar solicitações da equipe model", error);
      throw error;
    } finally {
      await client.$disconnect();
    }
  },
};
