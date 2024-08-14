const findEscalaMensal = require("../../../models/equipe/tabelaEscalaMensal/findEscalaMensal");
const logger = require("../../../custom/logger");

module.exports = {
  async handle(req, res) {
    try {
      const { equipeId } = req.body;

      let response = await findEscalaMensal.execute(equipeId);

      return res.status(200).json(response);
    } catch (error) {
      if (!error.path) {
        error.path =
          "/controllers/equipe/tabelaEscalaMensal/findEscalaMensalController";
        logger.error("Erro ao buscar escala mensal da equipe", error);
      }
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  },
};
