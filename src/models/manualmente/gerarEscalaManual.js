const { PrismaClient } = require("@prisma/client");
const logger = require("../../custom/logger");
const client = new PrismaClient();
const { v4: uuidv4 } = require("uuid");

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

function handleEscalaMembros(programacaoMensal, usuariosAtivos) {
  // Array que irá armazenar as escalas para todas as programações mensais
  const escalaEquipe = [];

  // Itera sobre cada programação mensal
  programacaoMensal?.forEach((programacao) => {
    // Filtra e mapeia os usuários disponíveis para a programação atual
    const usuariosDisponiveis = usuariosAtivos
      ?.filter((usuario) => {
        const disponibilidade =
          usuario.EscalaUsuarioHost?.disponibilidade ||
          usuario.EscalaUsuarioDefault?.disponibilidade;

        return (
          Array.isArray(disponibilidade) &&
          disponibilidade.some(
            (infoUser) =>
              infoUser.programacaoId === programacao.id &&
              infoUser.disponibilidade === true
          )
        );
      })
      .map((usuario) => {
        // Filtra a indisponibilidade do usuário para a programação atual
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

    // Cria uma cópia da lista de usuários disponíveis e das tags da programação
    let copyUsuariosDisponiveis = [...usuariosDisponiveis];
    const copyTagsProgramacao = [...programacao.tags];

    // Cria a estrutura de escala para o mês com base nas datas da programação
    const escalaProgramacaoMensal = programacao.datasProgramacaoMes.map(
      (data) => ({
        escalaDataId: uuidv4(),
        programacaoId: programacao.id,
        data: data.data,
        dia: programacao.dia,
        horario: programacao.horario,
        culto: programacao.culto,
        escalados: programacao.tags?.map((tag) => ({
          tagId: tag.id,
          tagNome: tag.nome,
          membroId: "sem membro",
          membroNome: "sem membro",
        })),
      })
    );

    // Loop para processar todas as tags da programação
    while (copyTagsProgramacao.length > 0) {
      // Escolhe uma tag aleatoriamente
      const randomIndex = Math.floor(
        Math.random() * copyTagsProgramacao.length
      );
      const getTag = copyTagsProgramacao[randomIndex];

      // Itera sobre todas as datas da programação mensal
      for (let i = 0; i < escalaProgramacaoMensal.length; i++) {
        const escala = escalaProgramacaoMensal[i];

        // Filtra os usuários que têm a tag atual e não estão indisponíveis na data específica
        let usuariosComTag = copyUsuariosDisponiveis
          ?.filter(
            (usuario) =>
              usuario.tags?.some((tag) => tag.id === getTag.id) &&
              !usuario.indisponibilidade.some((ind) => ind.data === escala.data)
          )
          .sort((a, b) => {
            const diff =
              b.indisponibilidade.length - a.indisponibilidade.length;
            // Se a quantidade de indisponibilidade for igual, embaralha a ordem
            if (diff === 0) {
              return Math.random() - 0.5;
            }
            return diff;
          });

        // Se há usuários disponíveis com a tag
        if (usuariosComTag.length > 0) {
          // Tenta alocar um usuário disponível na escala
          for (const usuario of usuariosComTag) {
            if (
              !escala.escalados.some(
                (escalados) => escalados.membroId === usuario.id
              ) &&
              !escalaEquipe.some((programacao) =>
                programacao.some(
                  (escalaExistente) =>
                    escalaExistente.data === escala.data &&
                    escalaExistente.escalados.some(
                      (escalado) => escalado.membroId === usuario.id
                    )
                )
              )
            ) {
              const posicaoIndex = escala.escalados.findIndex(
                (escalado) =>
                  escalado.tagId === getTag.id &&
                  escalado.membroId === "sem membro"
              );

              if (posicaoIndex !== -1) {
                // Atribui o usuário à posição disponível na escala
                escala.escalados[posicaoIndex] = {
                  tagId: getTag.id,
                  tagNome: getTag.nome,
                  membroId: usuario.id,
                  membroNome: usuario.nome,
                };

                // Remove o usuário da lista de disponíveis
                copyUsuariosDisponiveis = copyUsuariosDisponiveis.filter(
                  (u) => u.id !== usuario.id
                );

                break; // Sai do loop assim que um usuário for escalado
              }
            }
          }
        } else if (
          usuariosDisponiveis?.filter(
            (usuario) =>
              usuario.tags?.some((tag) => tag.id === getTag.id) &&
              !usuario.indisponibilidade.some(
                (ind) => ind.data === escala.data
              ) &&
              !escala.escalados.some(
                (escalados) => escalados.membroId === usuario.id
              ) &&
              !escalaEquipe.some((programacao) =>
                programacao.some(
                  (escalaExistente) =>
                    escalaExistente.data === escala.data &&
                    escalaExistente.escalados.some(
                      (escalado) => escalado.membroId === usuario.id
                    )
                )
              )
          ).length > 0
        ) {
          // Se não há usuários disponíveis na lista copiada, repõe a lista original e reinicia o loop
          copyUsuariosDisponiveis = [...usuariosDisponiveis];
          i--; // Reinicia o loop para tentar escalá-los novamente
        }

        if (
          escala.escalados.some(
            (escalado) =>
              escalado.tagId === getTag.id && escalado.membroId === "sem membro"
          )
        ) {
          let usuariosComDisponibilidade = usuariosDisponiveis?.filter(
            (usuario) =>
              usuario.tags?.some((tag) => tag.id === getTag.id) &&
              !usuario.indisponibilidade.some(
                (ind) => ind.data === escala.data
              ) &&
              !escala.escalados.some(
                (escalados) => escalados.membroId === usuario.id
              ) &&
              !escalaEquipe.some((programacao) =>
                programacao.some(
                  (escalaExistente) =>
                    escalaExistente.data === escala.data &&
                    escalaExistente.escalados.some(
                      (escalado) => escalado.membroId === usuario.id
                    )
                )
              )
          );

          if (usuariosComDisponibilidade.length > 0) {
            const randomIndex = Math.floor(
              Math.random() * usuariosComDisponibilidade.length
            );
            const usuario = usuariosComDisponibilidade[randomIndex];

            const posicaoIndex = escala.escalados.findIndex(
              (escalado) =>
                escalado.tagId === getTag.id &&
                escalado.membroId === "sem membro"
            );

            if (posicaoIndex !== -1) {
              // Atribui o usuário à posição disponível na escala
              escala.escalados[posicaoIndex] = {
                tagId: getTag.id,
                tagNome: getTag.nome,
                membroId: usuario.id,
                membroNome: usuario.nome,
              };
            }
          }
        }
      }

      // Remove a tag do loop após atribuir a todos os dias
      copyTagsProgramacao.splice(randomIndex, 1);
    }

    // Adiciona a escala mensal à equipe
    escalaEquipe.push(escalaProgramacaoMensal);
  });

  return escalaEquipe;
}

module.exports = {
  async execute(programacoes, usuarios) {
    try {
      logger.debug("Gerando escala mensal da equipe");

      const response = await client.$transaction(async (client) => {
        const { month, year } = getNextMonthAndYear();

        const programacaoMensal = programacoes?.map((programacao) => ({
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
        }));

        let escalaMensalFormada = [];

        escalaMensalFormada?.push(
          handleEscalaMembros(programacaoMensal, usuarios)
        );

        // colocar na ordem cronológica:
        // 1. Achatar o array para que todos os objetos estejam no mesmo nível.
        const flattenedArray = escalaMensalFormada?.flat(Infinity);

        // 2. Ordenar o array achatado por data e horário.
        escalaMensalFormada = flattenedArray.sort((a, b) => {
          const dateA = new Date(
            a.data.split("/").reverse().join("-") + " " + a.horario
          );
          const dateB = new Date(
            b.data.split("/").reverse().join("-") + " " + b.horario
          );
          return dateA - dateB;
        });

        logger.info("Escala mensal da equipe gerada com sucesso");

        return escalaMensalFormada;
      });

      return response;
    } catch (error) {
      error.path = "/models/manualmente/gerarEscalaMensal";
      logger.error(
        "Erro ao gerar escala mensal manualmente da equipe model",
        error
      );
      throw error;
    } finally {
      await client.$disconnect();
    }
  },
};
