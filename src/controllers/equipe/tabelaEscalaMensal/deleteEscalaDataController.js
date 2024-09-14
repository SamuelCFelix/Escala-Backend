const deleteEscalaData = require("../../../models/equipe/tabelaEscalaMensal/deleteEscalaData");
const logger = require("../../../custom/logger");

module.exports = {
  async handle(req, res) {
    try {
      const { equipeId, escalaDataId } = req.body;

      let response = await deleteEscalaData.execute(equipeId, escalaDataId);

      return res.status(200).json(response);
    } catch (error) {
      if (!error.path) {
        error.path =
          "/controllers/geral/tabelaEscalaMensal/deleteEscalaDataController";
        logger.error("Erro ao deletar escala data da equipe:", error);
      }
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  },
};
