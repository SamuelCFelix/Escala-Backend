const updateEscalaData = require("../../../models/geral/tabelaProximaEscala/updateEscalaData");
const logger = require("../../../custom/logger");

module.exports = {
  async handle(req, res) {
    try {
      const { equipeId, escalaDataId, escalados } = req.body;

      let response = await updateEscalaData.execute(
        equipeId,
        escalaDataId,
        escalados
      );

      return res.status(200).json(response);
    } catch (error) {
      if (!error.path) {
        error.path =
          "/controllers/geral/tabelaProximaEscala/updateEscalaDataController";
        logger.error("Erro ao atualizar escala data da equipe:", error);
      }
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  },
};
