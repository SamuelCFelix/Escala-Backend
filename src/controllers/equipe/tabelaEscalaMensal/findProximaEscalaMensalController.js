const findProximaEscalaMensal = require("../../../models/equipe/tabelaEscalaMensal/findProximaEscalaMensal");
const logger = require("../../../custom/logger");

module.exports = {
  async handle(req, res) {
    try {
      const { equipeId } = req.body;

      let response = await findProximaEscalaMensal.execute(equipeId);

      return res.status(200).json(response);
    } catch (error) {
      if (!error.path) {
        error.path =
          "/controllers/equipe/tabelaEscalaMensal/findProximaEscalaMensalController";
        logger.error("Erro ao buscar escala mensal da equipe", error);
      }
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  },
};
