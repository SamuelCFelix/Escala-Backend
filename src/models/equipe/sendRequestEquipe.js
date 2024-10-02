const { PrismaClient } = require("@prisma/client");
const logger = require("../../custom/logger");
const client = new PrismaClient();

module.exports = {
  async execute(usuarioId, equipeId) {
    try {
      const response = await client.$transaction(async (client) => {
        const solicitacaoExiste = await client.rlSolicitacoes.findFirst({
          where: {
            usuarioId,
          },
        });

        if (!solicitacaoExiste) {
          await client.rlSolicitacoes.create({
            data: {
              usuarioId,
              equipeId,
            },
          });
          const user = await client.usuarios.findFirst({
            where: {
              id: usuarioId,
            },
            select: {
              id: true,
              equipeId: true,
              autorizacao: true,
              perfil: {
                select: {
                  nome: true,
                  email: true,
                  foto: true,
                  dataNascimento: true,
                  termos: true,
                  primeiroAcesso: true,
                },
              },
            },
          });

          return {
            usuarioId: user.id,
            autorizacao: user.autorizacao,
            equipeId: "solicitacao enviada",
            nome: user.perfil.nome,
            foto: user.perfil.foto,
            email: user.perfil.email,
            dataNascimento: user.perfil.dataNascimento,
            termos: user.perfil.termos,
            primeiroAcesso: user.perfil.primeiroAcesso,
          };
        } else {
          throw { message: "Solicitação já existe", status: 400 };
        }
      });
      return response;
    } catch (error) {
      error.path = "/models/equipe/requestEquipe";
      logger.error("Erro ao enviar solitação para uma equipe", error);
      throw error;
    } finally {
      await client.$disconnect();
    }
  },
};
