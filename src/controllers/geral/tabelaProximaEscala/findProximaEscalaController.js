const findProximaEscala = require("../../../models/geral/tabelaProximaEscala/findProximaEscala");
const logger = require("../../../custom/logger");

module.exports = {
  async handle(req, res) {
    try {
      const { equipeId } = req.body;

      let response = await findProximaEscala.execute(equipeId);

      return res.status(200).json(response);
    } catch (error) {
      if (!error.path) {
        error.path =
          "/controllers/geral/tabelaProximaEscala/findProximaEscalaController";
        logger.error("Erro ao buscar próxima escala da equipe:", error);
      }
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  },
};
