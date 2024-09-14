const deleteProximaEscalaData = require("../../../models/equipe/tabelaEscalaMensal/deleteProximaEscalaData");
const logger = require("../../../custom/logger");

module.exports = {
  async handle(req, res) {
    try {
      const { equipeId, escalaDataId } = req.body;

      let response = await deleteProximaEscalaData.execute(
        equipeId,
        escalaDataId
      );

      return res.status(200).json(response);
    } catch (error) {
      if (!error.path) {
        error.path =
          "/controllers/geral/tabelaEscalaMensal/deleteProximaEscalaDataController";
        logger.error(
          "Erro ao deletar escala(próximo mês) data da equipe:",
          error
        );
      }
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  },
};
