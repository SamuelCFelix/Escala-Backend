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
          usuarioHost: {
            select: {
              EscalaUsuarioHost: {
                select: {
                  id: true,
                  disponibilidade: true,
                  backupDisponibilidade: true,
                },
              },
            },
          },
          UsuarioDefault: {
            select: {
              EscalaUsuarioDefault: {
                select: {
                  id: true,
                  disponibilidade: true,
                  backupDisponibilidade: true,
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
        buscarEquipe?.UsuarioDefault?.map(async (usuario) => {
          const escalaUsuarioDefault = usuario.EscalaUsuarioDefault[0];
          if (!escalaUsuarioDefault) return; // Se não houver escala, sair

          const disponibilidadeModificada =
            escalaUsuarioDefault.disponibilidade?.map((culto) => ({
              ...culto,
              indisponibilidade: [], // Zera o array de indisponibilidades
            }));

          await client.escalaUsuarioDefault.update({
            where: {
              id: escalaUsuarioDefault.id,
            },
            data: {
              backupDisponibilidade: escalaUsuarioDefault.disponibilidade,
              disponibilidade: disponibilidadeModificada,
              updateAt: new Date(),
            },
          });
        })
      );

      // Atualizar disponibilidade do usuário host, se existir
      const usuarioHostBackupEscala = buscarEquipe?.usuarioHost;
      if (usuarioHostBackupEscala) {
        const escalaUsuarioHost = usuarioHostBackupEscala?.EscalaUsuarioHost[0];
        if (escalaUsuarioHost) {
          const disponibilidadeModificadaHost =
            escalaUsuarioHost.disponibilidade?.map((culto) => ({
              ...culto,
              indisponibilidade: [], // Zera o array de indisponibilidades
            }));

          await client.escalaUsuarioHost.update({
            where: {
              id: escalaUsuarioHost.id,
            },
            data: {
              backupDisponibilidade: escalaUsuarioHost.disponibilidade,
              disponibilidade: disponibilidadeModificadaHost,
              updateAt: new Date(),
            },
          });
        }
      }

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
