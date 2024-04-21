const { PrismaClient } = require("@prisma/client");
const logger = require("../../custom/logger");
const client = new PrismaClient();

module.exports = {
  async execute(usuarioDefaultId, equipeId) {
    try {
      const response = await client.$transaction(async (client) => {
        const solicitacaoExiste = await client.rlSolicitacao.findFirst({
          where: {
            usuarioDefaultId,
          },
        });

        if (!solicitacaoExiste) {
          await client.rlSolicitacao.create({
            data: {
              usuarioDefaultId,
              equipeId,
            },
          });
          const usuarioDefault = await client.usuarioDefault.findFirst({
            where: {
              id: usuarioDefaultId,
            },
            select: {
              id: true,
              equipeId: true,
              perfil: {
                select: {
                  nome: true,
                  email: true,
                  dataNascimento: true,
                  termos: true,
                  primeiroAcesso: true,
                },
              },
            },
          });

          return {
            usuarioDefaultId: usuarioDefault.id,
            nome: usuarioDefault.perfil.nome,
            email: usuarioDefault.perfil.email,
            dataNascimento: usuarioDefault.perfil.dataNascimento,
            termos: usuarioDefault.perfil.termos,
            primeiroAcesso: usuarioDefault.perfil.primeiroAcesso,
            equipeId: "solicitacao enviada",
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
