const updateProximaEscalaData = require("../../../models/equipe/tabelaEscalaMensal/updateProximaEscalaData");
const logger = require("../../../custom/logger");

module.exports = {
  async handle(req, res) {
    try {
      const { equipeId, escalaDataId, escalados } = req.body;

      let response = await updateProximaEscalaData.execute(
        equipeId,
        escalaDataId,
        escalados
      );

      return res.status(200).json(response);
    } catch (error) {
      if (!error.path) {
        error.path =
          "/controllers/geral/tabelaEscalaMensal/updateProximaEscalaDataController";
        logger.error("Erro ao atualizar próxima escala data da equipe:", error);
      }
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  },
};
