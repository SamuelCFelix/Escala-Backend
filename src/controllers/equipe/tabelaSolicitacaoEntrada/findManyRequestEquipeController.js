const findManyRequestEquipe = require("../../../models/equipe/findManyRequestEquipe");
const logger = require("../../../custom/logger");

module.exports = {
  async handle(req, res) {
    try {
      const { equipeId } = req.body;

      let response = await findManyRequestEquipe.execute(equipeId);

      return res.status(200).json(response);
    } catch (error) {
      if (!error.path) {
        error.path = "/controllers/equipe/findManyRequestEquipeController";
        logger.error("Erro ao buscar solicitações da equipe:", error);
      }
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  },
};
