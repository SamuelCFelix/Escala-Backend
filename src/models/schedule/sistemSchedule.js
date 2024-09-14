const { PrismaClient } = require("@prisma/client");
const logger = require("../../custom/logger");
const client = new PrismaClient();
const cron = require("node-cron");
const gerarEscalaMensal = require("../equipe/tabelaEscalaMensal/gerarEscalaMensal");
const organizarInfoEscalaMensal = require("./organizarInfoEscalaMensal");

// Gerar Escala Mensal
const handleGerarEscalaMensal = async () => {
  try {
    logger.debug("Buscando equipes para gerar escala mensal");

    const buscarEquipes = await client.equipe.findMany({
      select: {
        id: true,
      },
    });

    for (const { id } of buscarEquipes) {
      //1 = Gerar escala para o mês atual
      //2 = Gerar escala do próximo mês
      await gerarEscalaMensal.execute(id, 2);
    }

    logger.info("Escalas mensais geradas com sucesso.");
  } catch (error) {
    error.path = "/models/schedule/sistemSchedule.js";
    logger.error(
      "Erro ao gerar escala mensal das equipe SCHEDULE model",
      error
    );
  } finally {
    await client.$disconnect();
  }
};

// Organizar informações da escala mensal
const handleOrganizarInfoEscalaMensal = async () => {
  try {
    logger.debug("Buscando equipes para organizar escala mensal");

    const buscarEquipes = await client.equipe.findMany({
      select: {
        id: true,
      },
    });

    for (const { id } of buscarEquipes) {
      await organizarInfoEscalaMensal.execute(id);
    }

    logger.info("Informações das escalas mensais organizadas com sucesso.");
  } catch (error) {
    error.path = "/models/schedule/sistemSchedule.js";
    logger.error(
      "Erro ao organizar escala mensal das equipe SCHEDULE model",
      error
    );
  } finally {
    await client.$disconnect();
  }
};

// Agendamento para rodar 3 dias antes de cada mês
const gerarEscalaMensalSchedule = () => {
  cron.schedule("0 0 28 * *", () => {
    logger.info("Executando criação de escala mensal das equipes...");
    handleGerarEscalaMensal();
  });
};

// Agendamento para rodar às 00:00 do dia 1 de cada mês
const organizarInfoEscalaMensalSchedule = () => {
  cron.schedule("0 0 1 * *", () => {
    logger.info(
      "Executando organização das informações da escala mensal das equipes..."
    );
    handleOrganizarInfoEscalaMensal();
  });
};

module.exports = {
  gerarEscalaMensalSchedule,
  organizarInfoEscalaMensalSchedule,
};
