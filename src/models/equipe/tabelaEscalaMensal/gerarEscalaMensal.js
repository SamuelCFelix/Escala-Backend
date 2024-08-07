const { PrismaClient } = require("@prisma/client");
const logger = require("../../../custom/logger");
const client = new PrismaClient();

/* const getCurrentMonthAndYear = () => {
  const date = new Date();
  const month = date.getMonth() + 1; // Mês atual
  const year = date.getFullYear();

  return { month, year };
}; */

const getNextMonthAndYear = () => {
  const date = new Date();
  const nextMonth = (date.getMonth() + 1) % 12;
  const nextYear =
    nextMonth === 0 ? date.getFullYear() + 1 : date.getFullYear();

  return { month: nextMonth + 1, year: nextYear };
};

// Função para obter todas as datas de um dia da semana em um determinado mês
const getDatesForDayInMonth = (day, month, year) => {
  const dates = [];
  const dayNames = [
    "Domingo",
    "Segunda-Feira",
    "Terça-Feira",
    "Quarta-Feira",
    "Quinta-Feira",
    "Sexta-Feira",
    "Sábado",
  ];
  const dayIndex = dayNames.indexOf(day);

  if (dayIndex === -1) {
    throw new Error("Invalid day name");
  }

  for (
    let date = new Date(year, month - 1, 1);
    date.getMonth() === month - 1;
    date.setDate(date.getDate() + 1)
  ) {
    if (date.getDay() === dayIndex) {
      dates.push(
        `${date.getDate().toString().padStart(2, "0")}/${(date.getMonth() + 1)
          .toString()
          .padStart(2, "0")}/${date.getFullYear()}`
      );
    }
  }

  return dates;
};

/* programacaoMensal?.forEach((programacao) => {
    const escaladosDia = (programacao = {
      programacaoId: programacao.escalaDia.programacaoId,
      data: programacao.escalaDia.data,
      dia: programacao.escalaDia.dia,
      horario: programacao.escalaDia.horario,
      culto: programacao.escalaDia.culto,
      escalados: programacao.escalaDia.tags?.map((tag) => {
        return {
          tagId: tag.id,
          tagNome: tag.nome,
          membroId: "Sem membro",
          membroNome: "Sem membro",
        };
      }),
    });

    escaladosProgramacao.push(escaladosDia);
  }); */

function handleEscalaMembros(programacaoMensal, usuariosAtivos) {
  const escaladosProgramacao = [];

  programacaoMensal?.forEach((programacao) => {
    const usuariosDisponiveis = usuariosAtivos
      ?.filter((usuario) => {
        const disponibilidade =
          usuario.EscalaUsuarioHost?.disponibilidade ||
          usuario.EscalaUsuarioDefault?.disponibilidade;

        if (!Array.isArray(disponibilidade)) {
          return false;
        }

        return disponibilidade?.some(
          (infoUser) =>
            infoUser.programacaoId === programacao.id &&
            infoUser.disponibilidade === true
        );
      })
      .map((usuario) => {
        const indisponibilidade =
          usuario.EscalaUsuarioHost?.disponibilidade?.filter(
            (infoUser) => infoUser.programacaoId === programacao.id
          ) ||
          usuario.EscalaUsuarioDefault?.disponibilidade?.filter(
            (infoUser) => infoUser.programacaoId === programacao.id
          );

        return {
          id: usuario.id,
          nome: usuario.nome,
          tags: usuario.tags,
          indisponibilidade: indisponibilidade[0]?.indisponibilidade || [],
        };
      });

    const ordemEscalarUsuario = usuariosDisponiveis?.sort(
      (a, b) => b?.indisponibilidade?.length - a?.indisponibilidade?.length
    );

    escaladosProgramacao.push(ordemEscalarUsuario);
  });

  return escaladosProgramacao;
}

/* const escalados = [];
  const membrosDisponiveisCopy = [...membrosDisponiveis]; // Cria uma cópia da lista de membros disponíveis

  tags?.forEach((tag) => {
    // Filtra membros que possuem a tag atual
    const membrosDisponiveisComTag = membrosDisponiveisCopy?.filter((membro) =>
      membro.tags?.some((tagMembro) => tagMembro.id === tag.id)
    );

    if (membrosDisponiveisComTag.length > 0) {
      // Escolhe um membro aleatório da lista filtrada
      const randomIndex = Math.floor(
        Math.random() * membrosDisponiveisComTag?.length
      );
      const membro = membrosDisponiveisComTag[randomIndex];

      escalados.push({
        tagId: tag.id,
        tagNome: tag.nome,
        membroId: membro.id,
        membroNome: membro.nome,
      });

      // Remove o membro selecionado da lista de disponíveis
      const membroIndex = membrosDisponiveisCopy.findIndex(
        (m) => m.id === membro.id
      );
      if (membroIndex !== -1) {
        membrosDisponiveisCopy.splice(membroIndex, 1);
      }
    } else {
      escalados.push({
        tagId: tag.id,
        tagNome: tag.nome,
        membroId: "Sem membro",
        membroNome: "Sem membro",
      });
    }
  });

  return escalados; */

module.exports = {
  async execute(equipeId) {
    try {
      const response = await client.$transaction(async (client) => {
        const buscarInfoEquipe = await client.equipe.findFirst({
          where: {
            id: equipeId,
          },
          select: {
            Programacao: {
              select: {
                id: true,
                culto: true,
                dia: true,
                horario: true,
                RlTagsProgramacao: {
                  select: {
                    tags: {
                      select: {
                        id: true,
                        nome: true,
                      },
                    },
                  },
                },
              },
            },
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
          throw new Error("Equipe não encontrada");
        }

        /* const { month, year } = getCurrentMonthAndYear(); */
        const { month, year } = getNextMonthAndYear();

        const programacaoMensal = buscarInfoEquipe?.Programacao?.map(
          (programacao) => ({
            id: programacao.id,
            culto: programacao.culto,
            dia: programacao.dia,
            horario: programacao.horario,
            tags: programacao.RlTagsProgramacao?.map((tagRelation) => ({
              id: tagRelation.tags.id,
              nome: tagRelation.tags.nome,
            })),
            datasProgramacaoMes: getDatesForDayInMonth(
              programacao.dia,
              month,
              year
            ).map((data) => ({
              data,
            })),
          })
        );

        /* const corpoEscalaMensal = programacaoMensal?.map((programacao) => {
          const escalaMensal = programacao?.datasProgramacaoMes?.map((data) => {
            const escala = {
              programacaoId: programacao.id,
              data: data.data,
              dia: programacao.dia,
              horario: programacao.horario,
              culto: programacao.culto,
              tags: programacao.tags,
              escalados: [],
            };
            return escala;
          });
          return escalaMensal;
        }); */

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
                  JSON?.parse(
                    usuario.EscalaUsuarioDefault[0]?.disponibilidade
                  ) || {},
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

        const escalaMensalFormada = [];

        escalaMensalFormada?.push(
          handleEscalaMembros(programacaoMensal, usuariosAtivos)
        );

        return escalaMensalFormada;

        /* escalaMensalFormada?.push(handleEscalaMembros(programacaoMensal)); */

        /*  corpoEscalaMensal?.forEach((escala) => {
          const programacaoMensal = escala?.map((escalaDia) => {
            const membrosDisponiveis = usuariosAtivos
              ?.filter((usuario) => {
                if (usuario.EscalaUsuarioHost) {
                  return usuario?.EscalaUsuarioHost?.disponibilidade?.some(
                    (programacao) =>
                      programacao.programacaoId === escalaDia.programacaoId &&
                      programacao.disponibilidade === true &&
                      !programacao.indisponibilidade?.some(
                        (dataIndisponivel) =>
                          dataIndisponivel.data === escalaDia.data
                      )
                  );
                } else {
                  return usuario?.EscalaUsuarioDefault?.disponibilidade?.some(
                    (programacao) =>
                      programacao.programacaoId === escalaDia.programacaoId &&
                      programacao.disponibilidade === true &&
                      !programacao.indisponibilidade?.some(
                        (dataIndisponivel) =>
                          dataIndisponivel.data === escalaDia.data
                      )
                  );
                }
              })
              .map((usuario) => {
                const indisponibilidade = usuario.EscalaUsuarioHost
                  ? JSON.parse(usuario.EscalaUsuarioHost?.[0]?.disponibilidade)
                      .indisponibilidade
                  : JSON.parse(
                      usuario.EscalaUsuarioDefault?.[0]?.disponibilidade
                    ).indisponibilidade;

                return {
                  id: usuario.id,
                  nome: usuario.nome,
                  tags: usuario.tags,
                  indisponibilidade: indisponibilidade || [],
                };
              });

            return { escalaDia, membrosDisponiveis };
          });

          console.log(usuariosAtivos);
          escalaMensalFormada?.push(handleEscalaMembros(programacaoMensal));
        }); */

        return escalaMensalFormada;
      });

      return response;
    } catch (error) {
      error.path = "/models/equipe/tabelaEscalaMensal/gerarEscalaMensal";
      logger.error("Erro ao gerar escala mensal da equipe model", error);
      throw error;
    } finally {
      await client.$disconnect();
    }
  },
};
