const { PrismaClient } = require("@prisma/client");
const logger = require("../../../custom/logger");
const client = new PrismaClient();

module.exports = {
  async execute(equipeId, escalaDataId, tagId, modoEdit, escaladosModoEdit) {
    try {
      const buscarInfoEquipe = await client.equipe.findFirst({
        where: {
          id: equipeId,
        },
        select: {
          escalaMensal: true,
          usuarioHost: {
            select: {
              id: true,
              nome: true,
              ativo: true,
              RlTagsUsuarioHost: {
                select: {
                  tags: {
                    select: {
                      id: true,
                      nome: true,
                    },
                  },
                },
              },
              EscalaUsuarioHost: {
                select: {
                  id: true,
                  disponibilidade: true,
                },
              },
            },
          },
          UsuarioDefault: {
            select: {
              id: true,
              nome: true,
              ativo: true,
              RlTagsUsuarioDefault: {
                select: {
                  tags: {
                    select: {
                      id: true,
                      nome: true,
                    },
                  },
                },
              },
              EscalaUsuarioDefault: {
                select: {
                  id: true,
                  disponibilidade: true,
                },
              },
            },
          },
        },
      });

      if (!buscarInfoEquipe) {
        return [];
      }

      const escalaData = JSON.parse(buscarInfoEquipe?.escalaMensal)?.find(
        (escala) => escala.escalaDataId === escalaDataId
      );

      const usuariosAtivos =
        buscarInfoEquipe?.UsuarioDefault?.filter(
          (usuario) => usuario.ativo
        )?.map((usuario) => {
          return {
            id: usuario.id,
            nome: usuario.nome,
            ativo: usuario.ativo,
            tags: usuario.RlTagsUsuarioDefault?.map((tagRelation) => ({
              id: tagRelation.tags.id,
              nome: tagRelation.tags.nome,
            })),
            EscalaUsuarioDefault: {
              id: usuario.EscalaUsuarioDefault[0]?.id,
              disponibilidade:
                JSON?.parse(usuario.EscalaUsuarioDefault[0]?.disponibilidade) ||
                {},
            },
          };
        }) || [];

      if (buscarInfoEquipe?.usuarioHost?.ativo) {
        const usuarioHost = {
          id: buscarInfoEquipe?.usuarioHost?.id,
          nome: buscarInfoEquipe?.usuarioHost?.nome,
          ativo: buscarInfoEquipe?.usuarioHost?.ativo,
          tags: buscarInfoEquipe?.usuarioHost?.RlTagsUsuarioHost?.map(
            (tagRelation) => ({
              id: tagRelation.tags.id,
              nome: tagRelation.tags.nome,
            })
          ),
          EscalaUsuarioHost: {
            id: buscarInfoEquipe?.usuarioHost?.EscalaUsuarioHost[0]?.id,
            disponibilidade:
              JSON?.parse(
                buscarInfoEquipe?.usuarioHost?.EscalaUsuarioHost[0]
                  ?.disponibilidade
              ) || {},
          },
        };
        usuariosAtivos?.push(usuarioHost);
      }

      let usuariosFiltrados = [];

      usuariosFiltrados = usuariosAtivos
        ?.filter((usuario) => {
          if (modoEdit) {
            return !escaladosModoEdit?.some(
              (usuarioEscalado) => usuarioEscalado.membroId === usuario.id
            );
          } else {
            return !escalaData?.escalados?.some(
              (usuarioEscalado) => usuarioEscalado.membroId === usuario.id
            );
          }
        })
        ?.map((usuario) => {
          const disponibilidade = Array.isArray(
            usuario.EscalaUsuarioDefault?.disponibilidade
          )
            ? usuario.EscalaUsuarioDefault.disponibilidade
            : [];

          const disponibilidadeHost = Array.isArray(
            usuario.EscalaUsuarioHost?.disponibilidade
          )
            ? usuario.EscalaUsuarioHost.disponibilidade
            : [];

          const possuiDisponibilidade = [
            ...disponibilidade,
            ...disponibilidadeHost,
          ].some(
            (dispoUsuario) =>
              dispoUsuario.programacaoId === escalaData?.programacaoId &&
              dispoUsuario.disponibilidade === true &&
              !(dispoUsuario.indisponibilidade || []).some(
                (dataIndispo) => dataIndispo.data === escalaData?.data
              )
          );

          return {
            usuarioId: usuario.id,
            nome: usuario.nome,
            possuiTag: usuario.tags.some((tag) => tag.id === tagId),
            possuiDisponibilidade,
          };
        });

      usuariosFiltrados.sort((a, b) => {
        // Prioridade de ordenação
        const prioridadeA =
          (a.possuiTag ? 2 : 0) + (a.possuiDisponibilidade ? 1 : 0);
        const prioridadeB =
          (b.possuiTag ? 2 : 0) + (b.possuiDisponibilidade ? 1 : 0);

        // Ordena por prioridade
        if (prioridadeA !== prioridadeB) {
          return prioridadeB - prioridadeA; // Ordem decrescente de prioridade
        }

        // Se as prioridades são iguais, ordena por nome
        return a.nome.localeCompare(b.nome);
      });

      return usuariosFiltrados;
    } catch (error) {
      error.path = "/models/geral/tabelaProximaEscala/findUsuariosDisponiveis";
      logger.error(
        "Erro ao buscar usuários disponíveis para preencher a escala da equipe model",
        error
      );
      throw error;
    } finally {
      await client.$disconnect();
    }
  },
};
