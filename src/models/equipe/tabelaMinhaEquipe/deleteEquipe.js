const { PrismaClient } = require("@prisma/client");
const logger = require("../../../custom/logger");
const client = new PrismaClient();

const bcrypt = require("bcrypt");

async function comparePasswords(plainPassword, hashedPassword) {
  return await bcrypt.compare(plainPassword, hashedPassword);
}

module.exports = {
  async execute(equipeId, usuarioHostId, senha) {
    try {
      const usuarioHost = await client.usuarios.findFirst({
        where: {
          id: usuarioHostId,
        },
        select: {
          perfil: {
            select: {
              senha: true,
            },
          },
        },
      });

      if (!usuarioHost) {
        throw new Error("Usuário não encontrado");
      }

      const comparePassword = await comparePasswords(
        senha,
        usuarioHost.perfil.senha
      );

      if (comparePassword) {
        const equipe = await client.equipe.findFirst({
          where: {
            id: equipeId,
          },
          select: {
            Usuarios: {
              select: {
                id: true,
                autorizacao: true,
              },
            },
          },
        });

        if (!equipe) {
          throw new Error("Equipe não encontrada");
        }

        Promise.all(
          equipe?.Usuarios.map(async (usuario) => {
            await client.usuarios.update({
              where: {
                id: usuario.id,
              },
              data: {
                equipeId: null,
                statusUsuario: true,
                incluirUsuarioGerarEscala: true,
                autorizacao: usuario.autorizacao === "adm001" ? "adm001" : null,
                updateAt: new Date(),
              },
            });

            const tagsMembro = await client.rlTagsUsuarios.findMany({
              where: {
                usuarioId: usuario.id,
              },
              select: {
                id: true,
              },
            });

            if (tagsMembro?.length > 0) {
              await client.rlTagsUsuarios.deleteMany({
                where: {
                  usuarioId: usuario.id,
                },
              });
            }

            const escalaUsuario = await client.escalaUsuarios.findFirst({
              where: {
                usuarioId: usuario.id,
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
          })
        );

        await client.equipe.delete({
          where: {
            id: equipeId,
          },
        });
      } else {
        return "Senha autorizacao incorreta";
      }

      return usuarioHost;
    } catch (error) {
      error.path = "/models/equipe/tabelaMinhaEquipe/deleteEquipe";
      logger.error("Erro ao deletar equipe model", error);
      throw error;
    } finally {
      await client.$disconnect();
    }
  },
};
