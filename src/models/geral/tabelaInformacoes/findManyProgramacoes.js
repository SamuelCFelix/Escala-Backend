const { PrismaClient } = require("@prisma/client");
const { v4: uuidv4 } = require("uuid");
const logger = require("../../../custom/logger");
const client = new PrismaClient();

// Função para obter o próximo mês
const getNextMonth = () => {
  const date = new Date();
  let nextMonth = date.getMonth() + 1; // Mês seguinte
  let year = date.getFullYear();

  if (nextMonth === 12) {
    nextMonth = 0;
    year += 1;
  }

  return { month: nextMonth + 1, year };
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

module.exports = {
  async execute(equipeId) {
    try {
      const programacoesEquipe = await client.equipe.findFirst({
        where: {
          id: equipeId,
        },
        select: {
          Programacoes: {
            select: {
              id: true,
              culto: true,
              dia: true,
              horario: true,
              RlTagsProgramacoes: {
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
        },
      });

      if (!programacoesEquipe) {
        throw new Error("Equipe não encontrada");
      }

      const { month, year } = getNextMonth();

      const programacoesEquipeFormatted = programacoesEquipe?.Programacoes?.map(
        (programacao) => ({
          id: programacao.id,
          culto: programacao.culto,
          dia: programacao.dia,
          horario: programacao.horario,
          tags: programacao.RlTagsProgramacoes?.map((tagRelation) => ({
            id: tagRelation.tags.id,
            nome: tagRelation.tags.nome,
          })),
          datasMesSeguinte: getDatesForDayInMonth(
            programacao.dia,
            month,
            year
          ).map((data) => ({
            dataId: uuidv4(),
            data,
          })),
        })
      );

      return programacoesEquipeFormatted;
    } catch (error) {
      error.path = "/models/geral/tabelaInformacoes/findManyTagsMembrosEquipe";
      logger.error("Erro ao buscar tags de membro da equipe model", error);
      throw error;
    } finally {
      await client.$disconnect();
    }
  },
};
