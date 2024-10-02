const { PrismaClient } = require("@prisma/client");
const logger = require("../../custom/logger");
const client = new PrismaClient();

module.exports = {
  async execute(equipeId) {
    try {
      logger.debug("Organizando informações da escala mensal da equipe");

      // Buscando equipe e informações relacionadas
      const buscarEquipe = await client.equipe.findFirst({
        where: {
          id: equipeId,
        },
        select: {
          proximaEscalaMensal: true,
          Usuarios: {
            select: {
              EscalaUsuarios: {
                select: {
                  id: true,
                  disponibilidadeProximoMes: true,
                  disponibilidadeMensal: true,
                },
              },
            },
          },
        },
      });

      if (!buscarEquipe) {
        throw new Error("Equipe não encontrada");
      }

      // Atualizar a escala mensal da equipe
      await client.equipe.update({
        where: {
          id: equipeId,
        },
        data: {
          escalaMensal: buscarEquipe.proximaEscalaMensal,
          proximaEscalaMensal: null,
        },
      });

      // Atualizar disponibilidade dos usuários padrão
      await Promise.all(
        buscarEquipe?.Usuarios?.map(async (usuario) => {
          const escalaUsuario = usuario.EscalaUsuarios[0];
          if (!escalaUsuario) return; // Se não houver escala, sair

          const disponibilidadeModificada =
            escalaUsuario.disponibilidadeProximoMes?.map((culto) => ({
              ...culto,
              indisponibilidade: [], // Zera o array de indisponibilidades
            }));

          await client.escalaUsuarios.update({
            where: {
              id: escalaUsuario.id,
            },
            data: {
              disponibilidadeMensal: escalaUsuario.disponibilidadeProximoMes,
              disponibilidadeProximoMes: disponibilidadeModificada,
              updateAt: new Date(),
            },
          });
        })
      );

      logger.debug("Informações da escala mensal da equipe organizadas");
    } catch (error) {
      error.path =
        "/models/equipe/tabelaEscalaMensal/organizarInfoEscalaMensal";
      logger.error(
        "Erro ao organizar informações da escala mensal da equipe model",
        error
      );
      throw error;
    } finally {
      await client.$disconnect();
    }
  },
};
