const { PrismaClient } = require("@prisma/client");
const logger = require("../../../custom/logger");
const client = new PrismaClient();

module.exports = {
  async execute(
    equipeId,
    escalaDataId,
    tagId,
    tipo,
    modoEdit,
    escaladosModoEdit
  ) {
    try {
      const buscarInfoEquipe = await client.equipe.findFirst({
        where: {
          id: equipeId,
        },
        select: {
          escalaMensal: true,
          proximaEscalaMensal: true,
          Usuarios: {
            select: {
              id: true,
              nome: true,
              foto: true,
              statusUsuario: true,
              RlTagsUsuarios: {
                select: {
                  tags: {
                    select: {
                      id: true,
                      nome: true,
                    },
                  },
                },
              },
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

      if (!buscarInfoEquipe) {
        return [];
      }

      let escalaData = [];

      if (tipo === 1) {
        escalaData = JSON.parse(buscarInfoEquipe?.escalaMensal)?.find(
          (escala) => escala.escalaDataId === escalaDataId
        );
      } else if (tipo === 2) {
        escalaData = JSON.parse(buscarInfoEquipe?.proximaEscalaMensal)?.find(
          (escala) => escala.escalaDataId === escalaDataId
        );
      }

      const usuariosAtivos =
        buscarInfoEquipe?.Usuarios?.filter(
          (usuario) => usuario.statusUsuario
        )?.map((usuario) => {
          return {
            id: usuario.id,
            nome: usuario.nome,
            foto: usuario.foto,
            statusUsuario: usuario.statusUsuario,
            tags: usuario.RlTagsUsuarios?.map((tagRelation) => ({
              id: tagRelation.tags.id,
              nome: tagRelation.tags.nome,
            })),
            EscalaUsuarios: {
              id: usuario.EscalaUsuarios[0]?.id,
              disponibilidade:
                tipo === 1
                  ? JSON?.parse(
                      usuario.EscalaUsuarios[0]?.disponibilidadeMensal || "{}"
                    )
                  : JSON?.parse(
                      usuario.EscalaUsuarios[0]?.disponibilidadeProximoMes ||
                        "{}"
                    ),
            },
          };
        }) || [];

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
            usuario.EscalaUsuarios?.disponibilidade
          );

          const possuiDisponibilidade = [...disponibilidade].some(
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
            foto: usuario.foto,
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
      error.path = "/models/geral/tabelaEscalaMensal/findUsuariosDisponiveis";
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
